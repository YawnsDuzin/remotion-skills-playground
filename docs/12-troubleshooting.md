# 트러블슈팅 종합

> 읽는 데 약 10분 · 기준일 2026-04-15 · 에러 메시지를 Cmd/Ctrl+F로 검색해 쓰는 문서

자주 만나는 25개 에러를 카테고리별로 정리. 각 항목은 "에러 → 원인 → 해결 → 예방" 4단으로.

## 환경 설치

### `Error: Cannot find module 'remotion'`

- **원인**: `npm install` 안 했거나, monorepo에서 다른 워크스페이스에 install됨
- **해결**: 해당 디렉토리에서 `npm install` 다시
- **예방**: `package.json`의 `name`과 디렉토리명 일치시키기

### `Could not find the binary for Chrome Headless Shell`

- **원인**: Remotion이 사용하는 Chromium 미설치
- **해결**: `npx remotion browser ensure`
- **예방**: CI에선 워크플로우에 `browser ensure` 단계 추가

### `EACCES: permission denied`

- **원인**: 글로벌 install 디렉토리 권한 문제 (보통 `sudo npm install -g` 사용한 흔적)
- **해결**: `nvm` 또는 `volta` 사용. 절대 `sudo`로 npm 쓰지 말 것
- **예방**: 새 머신에선 처음부터 `nvm` 셋업

## 컴포지션/렌더

### `The composition's durationInFrames must be a positive integer, got 149.99999999999997`

- **원인**: `fps * seconds`가 부동소수점
- **해결**: `Math.round(fps * seconds)`로 감싸기
- **예방**: 본 저장소 [`skills/remotion-composition.md`](../skills/remotion-composition.md)의 `sec()` 헬퍼 사용

### `Cannot use a Composition with no defaultProps when calling useVideoConfig`

- **원인**: `Composition`에 `defaultProps`가 없는데 컴포넌트가 props에 의존
- **해결**: `defaultProps={{ ... }}` 명시
- **예방**: TypeScript strict 모드 + `Composition<Props>` 제네릭으로 타입 강제

### 렌더 결과가 검은 화면

- **원인**: 컴포넌트가 렌더링 시점에 throw하거나, `AbsoluteFill` 위치 충돌
- **해결**: Studio에서 동일 props로 재현 → 콘솔 에러 확인. `--log=verbose`로 렌더 로그 보기
- **예방**: `try { ... } catch(e) { console.error(e); return <div>{String(e)}</div> }` 패턴으로 디버깅

### 렌더 진행률이 50%에서 멈춤

- **원인**: 특정 프레임에서 컴포넌트가 throw하거나 `delayRender`가 안 풀림
- **해결**: `--concurrency=1 --log=verbose`로 어느 프레임인지 확인 → 그 프레임만 `--frames=NN-NN`으로 재현
- **예방**: 모든 `delayRender` 호출에 `continueRender` catch 보장

## 폰트/한글

### 한글이 네모(□)로 렌더됨

- **원인**: 폰트 미로드. `delayRender` 누락
- **해결**: [`docs/01-setup.md`](./01-setup.md)의 폰트 로더 코드 사용
- **예방**: `@remotion/google-fonts`로 자동화 (영문 폰트는 더 쉬움)

### Studio에선 보이는데 렌더만 깨짐

- **원인**: 같음. Studio는 캐시된 시스템 폰트를 쓰는 경우가 있음
- **해결**: 동일
- **예방**: 항상 `delayRender` 패턴 사용

### `FontFace is not defined`

- **원인**: `fonts.ts`가 SSR/Node 환경에서 import됨
- **해결**: `fonts.ts`는 `Root.tsx`에서만 import — 다른 곳에서 부르지 말 것
- **예방**: 폴더 분리 — fonts.ts를 `src/client/`에 두면 실수 줄임

## 데이터 패칭

### `delayRender` 타임아웃 (30초)

- **원인**: API 응답 30초 초과
- **해결**: `delayRender("...", { timeoutInMilliseconds: 60000 })` 또는 `Config.setDelayRenderTimeoutInMilliseconds`
- **예방**: 가능하면 `calculateMetadata`로 옮기기 (타임아웃 별개)

### `fetch is not defined`

- **원인**: Node 18 미만 + Remotion 4.x 사용
- **해결**: Node 20 이상으로 업그레이드, 또는 `node-fetch` import
- **예방**: 본 저장소 [`docs/01-setup.md`](./01-setup.md)의 Node 버전 매트릭스 따르기

### CORS 에러 (Studio에서만)

- **원인**: API 서버가 localhost를 허용하지 않음
- **해결**: `calculateMetadata`로 옮기면 Node에서 호출되어 CORS 무관
- **예방**: 외부 API는 처음부터 `calculateMetadata`로

## 오디오

### 음성이 안 들림 (렌더 결과만)

- **원인**: 코덱이 audio 미지원이거나 `--enforce-audio-track=false`
- **해결**: `--codec=h264 --enforce-audio-track=true`
- **예방**: `<Audio>`를 `Sequence` 안에 넣지 말고 컴포지션 최상단

### 음성이 비디오보다 짧게 잘림

- **원인**: `<Audio>`를 감싼 `Sequence`의 `durationInFrames`이 음성 길이보다 짧음
- **해결**: 음성 길이를 `getAudioDurationInSeconds`로 측정해 컴포지션 길이를 맞춤
- **예방**: `calculateMetadata`에서 음성 길이로 `durationInFrames` 계산

## Lambda/Cloud Run

### `Function timed out after 240 seconds`

- **원인**: 영상이 길거나 메모리 부족으로 렌더가 느림
- **해결**: `npx remotion lambda functions deploy --memory=3008 --timeout=900`로 재배포
- **예방**: 1080p 1분 이상은 메모리 3008MB

### `AccessDenied: User is not authorized to perform: s3:PutObject`

- **원인**: IAM 권한 부족
- **해결**: 정책에 `s3:PutObject`, `s3:GetObject`, `s3:ListBucket` 추가
- **예방**: 처음에 `AmazonS3FullAccess`로 시작했다가 좁히기 (보안)

### Lambda 비용이 예상보다 큼

- **원인**: `sites create`를 매번 호출 (사이트가 누적되어 S3 비용)
- **해결**: `npx remotion lambda sites ls`로 확인 후 `sites rm` 정리
- **예방**: CI에서 `sites create --override-existing`

## Claude Code 통합

### 에이전트가 스킬을 무시

- **원인**: `.claude/skills/` 위치 또는 frontmatter 오류
- **해결**: `claude --debug 2>&1 | grep -i skill`로 로드 로그 확인. 파일명과 frontmatter `name` 일치 확인
- **예방**: 본 저장소 [`docs/11-skills-authoring.md`](./11-skills-authoring.md)의 frontmatter 형식 따르기

### 에이전트가 Composition을 잘못 만듦 (해상도, fps 등)

- **원인**: 스킬에 명시값이 없거나 모호
- **해결**: 스킬 본문에 "정확히 1080×1920" 같이 단정형으로 작성
- **예방**: `## 금지 사항`에 "이 외 해상도 사용 금지" 추가

### Claude Code 세션이 자꾸 끊김

- **원인**: 컨텍스트 윈도우 초과 (스킬 너무 많이 로드)
- **해결**: 안 쓰는 스킬은 `.claude/skills/`에서 빼두기
- **예방**: 스킬 200줄 제한 ([`docs/11-skills-authoring.md`](./11-skills-authoring.md))

---

## 일반 디버깅 흐름

1. 에러 메시지를 정확히 복사 → 이 문서 Cmd/Ctrl+F
2. 없으면 `npx remotion render ... --log=verbose` 풀로그 확인
3. 그래도 안 풀리면 [Remotion Discord](https://www.remotion.dev/discord) 또는 GitHub 이슈
4. 한국어 도움이 필요하면 본 저장소 이슈로

빠진 케이스가 있다면 PR 환영. 라벨 `good first issue`로 처리.

다음 — 렌더가 너무 느리다면 [`docs/13-performance.md`](./13-performance.md).
