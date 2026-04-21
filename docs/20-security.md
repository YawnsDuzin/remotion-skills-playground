# 보안 — API 키·에셋·Lambda IAM

> 읽는 데 약 11분 · 기준일 2026-04-15

Remotion 프로젝트에서 털리는 경로는 거의 정해져 있다 — 1) API 키가 코드에 들어가거나 퍼블릭 번들에 섞임, 2) Lambda IAM 권한이 지나치게 넓음, 3) `public/`에 민감 파일이 들어감.
이 문서는 공격 표면별로 실제 예방 체크리스트를 제공한다.

## 1. API 키 — 3중 방어

### 1.1 `.env` + `.gitignore`

개인 환경에선 `.env` 파일 사용, 절대 커밋 금지.

```bash
# .env (로컬만)
KMA_API_KEY=xxxxxxxx
CLOVA_VOICE_ID=xxxxxxxx
CLOVA_VOICE_SECRET=xxxxxxxx
```

`.gitignore`에 `.env`, `.env.local`, `.env.*` 모두 포함. 본 저장소 [루트 `.gitignore`](../.gitignore)에 이미 들어있음. 실수로 커밋된 경우 단순 `git rm`으로는 부족 — git history에 남으므로 [`git filter-repo`](https://github.com/newren/git-filter-repo)로 완전 제거 후 키 **즉시 로테이션**.

### 1.2 CI는 GitHub Secrets

`Settings → Secrets and variables → Actions`에 등록 후 워크플로우에서 `${{ secrets.XXX }}`로 참조. 로그에 자동 마스킹됨.

주의: Fork PR에서는 시크릿이 노출되지 않도록 GitHub가 자동 차단 — 즉 외부 기여자 PR에서는 `secrets.*`가 빈 값이 된다. 이 경우 렌더 스텝을 건너뛰도록:

```yaml
- name: Render (skip for fork PRs)
  if: github.event.pull_request.head.repo.full_name == github.repository
  run: npx remotion render ...
```

### 1.3 클라이언트 코드 vs 빌드 코드

Remotion 컴포지션은 **Chromium에서 실행**된다 — 즉 `process.env`로 접근한 값이 번들에 그대로 박힌다. 키를 `calculateMetadata`에서만 쓰고 (Node 환경), 컴포넌트 본문에선 절대 참조 금지.

```ts
// ❌ 위험 — 번들에 키가 섞임
const Comp = () => {
  fetch(`https://api.example.com?key=${process.env.SECRET}`);
};

// ✅ 안전 — Node에서만 실행
const calc: CalculateMetadataFunction = async () => {
  const data = await fetch(`https://api.example.com?key=${process.env.SECRET}`);
  return { props: { data: await data.json() }, ... };
};
```

## 2. 시크릿 스캔 자동화

### 2.1 pre-commit hook

[`gitleaks`](https://github.com/gitleaks/gitleaks)를 `husky` + `lint-staged`로 커밋마다 자동 실행.

```json
// package.json
{
  "scripts": { "prepare": "husky" },
  "lint-staged": { "*": "gitleaks protect --staged --redact" }
}
```

```bash
npm i -D husky lint-staged
npx husky init
echo "npx lint-staged" > .husky/pre-commit
```

이 한 번의 셋업으로 이후 "abc123"처럼 생긴 AWS 키가 스테이지되면 커밋이 거부된다.

### 2.2 CI에서 전체 레포 스캔

```yaml
- name: Gitleaks
  uses: gitleaks/gitleaks-action@v2
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

PR마다 전체 히스토리 스캔. false positive는 `.gitleaksignore`에 경로 지정.

### 2.3 GitHub의 내장 secret scanning

퍼블릭 레포는 자동 활성화. 프라이빗은 GitHub Advanced Security 필요. 탐지 시 레포 오너에게 이메일 + Settings → Security → Secret scanning alerts에 표시.

## 3. 퍼블릭 에셋 유출

### 3.1 `public/`의 위험

Remotion의 `public/` 디렉토리는 빌드 시 **전부 번들에 포함된다**. Lambda에선 S3에 업로드되고 URL로 접근 가능. 실수로 민감 파일(고객 데이터 엑셀, 백업 DB 덤프 등)을 넣으면 퍼블릭.

원칙:
- `public/`은 "의도적으로 공개되어도 되는" 파일만
- 고객 데이터는 `calculateMetadata`에서 fetch 후 props로만 전달, 파일로 저장 안 함
- `public/`에 들어가는 파일 목록을 PR 리뷰 시 항상 확인

### 3.2 Lambda 사이트 URL

`npx remotion lambda sites create`로 만들어진 URL (`https://<bucket>.s3.amazonaws.com/sites/<id>/index.html`)은 기본적으로 **퍼블릭**. 누구나 번들 JS 코드를 받아 분석 가능.

프라이빗 번들이 필요하면:
- S3 버킷에 CloudFront + OAI(Origin Access Identity) 구성
- 또는 `@remotion/lambda`의 `privacy: "private"` 옵션 (렌더 함수 간 서명)
- 기본값은 `"public"` — 반드시 확인

## 4. Lambda IAM 최소 권한

배포 스크립트가 요구하는 권한을 그대로 주면 `*:*` 수준이 되기 쉽다. 정책을 좁히는 샘플:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RemotionLambdaInvoke",
      "Effect": "Allow",
      "Action": ["lambda:InvokeFunction"],
      "Resource": "arn:aws:lambda:ap-northeast-2:123456789012:function:remotion-render-*"
    },
    {
      "Sid": "S3ReadSites",
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:ListBucket"],
      "Resource": ["arn:aws:s3:::remotionlambda-*", "arn:aws:s3:::remotionlambda-*/*"]
    }
  ]
}
```

배포는 관리자 권한, 호출은 위의 좁은 정책 — 두 역할로 분리.

## 5. 사용자 입력 검증

Player에서 `inputProps`를 URL 파라미터로 받는 경우, 검증 없이 넘기면 XSS/SSRF 가능.

```tsx
// ❌ 위험
const script = searchParams.get("script");
<Player inputProps={{ script }} />

// ✅ zod로 검증
import { z } from "zod";
const schema = z.object({ script: z.string().max(500).regex(/^[가-힣a-zA-Z0-9\s.,!?]+$/) });
const parsed = schema.safeParse({ script: searchParams.get("script") });
if (!parsed.success) return <div>잘못된 입력</div>;
<Player inputProps={parsed.data} />
```

특히 `<Img src={props.imageUrl} />`처럼 URL을 그대로 넘기면 SSRF — 허용 도메인 화이트리스트 검증.

## 6. 취약점 제보 창구

외부 제보자가 비공개로 알릴 수 있게 `SECURITY.md` 파일을 레포 루트에 둔다. 본 저장소는 [`SECURITY.md`](../SECURITY.md) 참조.

## 체크리스트 요약

- [ ] `.env`·`.env.*` gitignore
- [ ] gitleaks pre-commit + CI 스캔
- [ ] API 키는 `calculateMetadata`에서만 사용 (컴포넌트 본문 금지)
- [ ] `public/`에 민감 파일 없음 (PR 때 확인)
- [ ] Lambda IAM은 arn 단위 좁은 정책
- [ ] Player `inputProps`는 zod 검증
- [ ] Fork PR에서 secret 사용 안 함 (`if` 조건)
- [ ] `SECURITY.md`로 제보 창구 명시
