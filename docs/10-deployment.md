# 배포 — GitHub Actions 자동 렌더 파이프라인

> 읽는 데 약 12분 · 기준일 2026-04-15

매일 아침 자동으로 KOSPI 리포트 영상을 만들어 S3에 올리고 Slack으로 알림을 쏘는 — 그런 파이프라인을 GitHub Actions만으로 구축한다.
이 문서는 cron 트리거부터 시크릿 관리, 산출물 업로드, 실패 알림까지 전 과정을 다룬다.

## 전체 구조

```
GitHub Actions (cron) →
  1. 데이터 fetch (calculateMetadata가 KMA API 호출) →
  2. Remotion 렌더 →
  3. S3 업로드 →
  4. Slack/Discord Webhook 알림 →
  5. 실패 시 GitHub Issue 자동 생성
```

각 단계를 분리하면 디버깅이 쉽고, 한 단계가 깨져도 다음 실행에서 복구된다.

## 시크릿 등록

레포 Settings → Secrets and variables → Actions → New repository secret.

| 시크릿 이름 | 용도 |
|---|---|
| `KMA_API_KEY` | 기상청 API 키 |
| `CLOVA_VOICE_ID` / `CLOVA_VOICE_SECRET` | 네이버 TTS |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | S3 업로드 권한 |
| `AWS_REGION` | 보통 `ap-northeast-2` (서울) |
| `SLACK_WEBHOOK_URL` | 알림용 Webhook |

OIDC 연동이 가능하면 access key 대신 [GitHub OIDC + AWS IAM Role](https://docs.github.com/en/actions/deployment/security-hardening-your-deployments/configuring-openid-connect-in-amazon-web-services)이 더 안전. 짧은 수명 토큰을 매 실행마다 발급.

## 일일 cron 워크플로우

`.github/workflows/daily-report.yml`:

```yaml
name: Daily Report

on:
  schedule:
    # KST 08:00 = UTC 23:00 (전날)
    - cron: "0 23 * * *"
  workflow_dispatch: # 수동 트리거 허용

jobs:
  render:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    permissions:
      id-token: write
      contents: read
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: npm
          cache-dependency-path: examples/daily-report/package-lock.json

      - name: Install
        working-directory: examples/daily-report
        run: npm ci

      - name: Install Chromium for Remotion
        working-directory: examples/daily-report
        run: npx remotion browser ensure

      - name: Render
        working-directory: examples/daily-report
        env:
          KMA_API_KEY: ${{ secrets.KMA_API_KEY }}
          CLOVA_VOICE_ID: ${{ secrets.CLOVA_VOICE_ID }}
          CLOVA_VOICE_SECRET: ${{ secrets.CLOVA_VOICE_SECRET }}
        run: |
          mkdir -p out
          npx remotion render src/index.ts DailyReport \
            "out/$(date +%Y-%m-%d).mp4" \
            --concurrency=2 --log=verbose

      - name: Upload to S3
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789012:role/GitHubActionsRemotion
          aws-region: ap-northeast-2

      - name: Sync
        working-directory: examples/daily-report
        run: aws s3 cp out/ s3://my-videos/daily/ --recursive --exclude "*" --include "*.mp4"

      - name: Notify Slack
        if: always()
        uses: slackapi/slack-github-action@v1
        with:
          payload: |
            {
              "text": "${{ job.status == 'success' && '✅ Daily report 렌더 완료' || '❌ Daily report 실패' }}: ${{ github.run_id }}"
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

cron 표현식 — GitHub Actions는 UTC 기준이므로 KST에서 + 9시간 빼서 입력. KST 08:00 = UTC 23:00 (전날).

## 워크플로우 디스패치 — 수동 실행 가능하게

`workflow_dispatch:`를 추가하면 GitHub UI에서 "Run workflow" 버튼이 생긴다. cron 안 기다리고 즉시 테스트 가능.

매개변수도 받을 수 있다:

```yaml
on:
  workflow_dispatch:
    inputs:
      city:
        description: "어느 도시 리포트?"
        required: true
        default: "서울"
        type: choice
        options: [서울, 부산, 대구, 광주]
```

`${{ inputs.city }}`로 jobs에서 참조.

## 실패 시 자동 이슈 — peter-evans/create-issue-from-file

```yaml
- name: Create issue on failure
  if: failure()
  uses: peter-evans/create-issue-from-file@v5
  with:
    title: "Daily Report 실패: ${{ github.run_id }}"
    content-filepath: ./error.log
    labels: bug, automation
```

렌더 단계에서 `... 2>&1 | tee error.log` 형태로 로그를 캡처해두면 실패 컨텍스트가 이슈에 자동으로 첨부.

## Lambda 사전 배포 워크플로우

Lambda 사이트는 코드가 바뀔 때만 재배포해야 비용 효율적. 별도 워크플로우 분리.

```yaml
name: Deploy Lambda Site

on:
  push:
    paths:
      - "examples/daily-report/src/**"

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: "22" }
      - working-directory: examples/daily-report
        env:
          AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
          AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          AWS_REGION: ap-northeast-2
        run: |
          npm ci
          npx remotion lambda sites create src/index.ts \
            --site-name=daily-report \
            --override-existing
```

`paths` 필터로 컴포지션 코드가 변경된 PR이 머지될 때만 재배포.

## Cloudinary로 바로 업로드 (S3 대안)

S3 + CloudFront 셋업이 부담이면 Cloudinary 한 번에 업로드 + CDN.

```yaml
- name: Upload to Cloudinary
  env:
    CLOUDINARY_URL: ${{ secrets.CLOUDINARY_URL }}
  run: |
    npx cloudinary uploader upload "out/$(date +%Y-%m-%d).mp4" \
      --resource-type video --public-id "daily/$(date +%Y-%m-%d)"
```

무료 플랜 월 25GB 저장 + 25GB CDN — 1080p 1분 영상 ≈ 30MB 기준 월 800편까지 무료.

## 비용 캡

GitHub Actions Free 플랜은 월 2,000분(public repo는 무제한). 매일 15분짜리 렌더라면 월 450분 — 안전.
Lambda는 별도. 일 1편이면 월 $0.10 미만. 일 100편이면 월 $10 정도. CloudWatch 알림으로 임계 설정 권장.

## 실패 패턴 모음

1. **시크릿 누락** — 환경 변수 이름 오타. 워크플로우에서 `env:` 블록과 `secrets.NAME` 둘 다 정확히 일치해야 함
2. **Chromium 다운로드 실패** — GitHub runner 네트워크 일시 장애. `retry-action`으로 감싸기
3. **타임아웃** — `timeout-minutes`를 충분히 (15~20분)
4. **메모리 부족** — runner 메모리는 7GB. 4K 렌더는 self-hosted runner 또는 Lambda로
5. **시크릿이 PR에선 안 노출** — fork PR에서는 시크릿이 빈 값. cron + main 브랜치 push에서만 동작 보장

다음 — 자기만의 스킬을 만들고 싶다면 [`docs/11-skills-authoring.md`](./11-skills-authoring.md).
