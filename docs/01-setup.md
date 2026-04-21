# 환경 설정

> 읽는 데 약 10분

Remotion은 네이티브 바이너리(Chrome Headless, FFmpeg)에 의존하기 때문에 OS마다 걸리는 지점이 다르다.
이 문서는 macOS·윈도우·리눅스 각각에서 "설치 후 첫 렌더가 성공"하는 지점까지의 최단 경로를 정리한다.
한글 폰트 설정은 공식 가이드에 없으므로 이 문서에서만 다룬다.

## 전제 조건

- **Node.js 20 LTS 이상** (22 권장 — Remotion 4.x가 22에서 가장 안정적)
- **Claude Code 최신 버전** (`claude --version`으로 확인)
- **Remotion 라이선스**: 개인/소규모 스튜디오는 무료, 법인 3인 이상부터 유료 — [라이선스 FAQ](https://www.remotion.dev/docs/license) 필독

## macOS

M1~M4 모두 문제없이 돌아간다. Rosetta 불필요.
주의점 하나 — `brew`로 설치한 Node와 `nvm`으로 설치한 Node가 섞이면 `remotion studio` 실행 시 Chromium 경로를 못 찾는다. 하나로 통일할 것.

## 윈도우

WSL2를 권장하되, 네이티브 윈도우도 가능하다. 네이티브에서 쓸 거면 `C:\Program Files` 같이 공백 있는 경로는 피한다 — 경로에 공백이 있으면 Remotion 내부의 FFmpeg 호출이 깨진다.
PowerShell보단 Windows Terminal + Git Bash 조합이 덜 말썽이다.

## 리눅스

Ubuntu 22.04+ 기준 `libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 libxrandr2 libgbm1 libasound2` 패키지가 없으면 Chromium이 뜨지 않는다. 에러 메시지가 모호하니 미리 설치.

## 프로젝트 시작 3가지 경로

1. **새로 만들기**: `npx create-video@latest <project-name>` — 처음이라면 이것
2. **기존 Next.js/Vite 프로젝트에 추가**: `npm i remotion @remotion/cli` 후 `src/remotion/` 디렉토리 수동 생성 — 통합 대시보드용
3. **이 저장소 포크**: 한국어 환경 사전 설정이 이미 들어있음 — 가장 빠른 경로

## 한글 폰트 설정 (공식 가이드에 없는 부분)

Pretendard를 기본으로 쓴다. `public/fonts/`에 `.woff2`를 넣고 `src/Root.tsx`에서 `@font-face`로 로드한다.
CJK 전체 구간이 필요하면 Noto Sans KR을, 제목 전용이라면 Pretendard Variable을 쓰는 쪽이 파일 크기상 유리하다.

```tsx
// src/fonts.ts
import { continueRender, delayRender, staticFile } from "remotion";

const waitForFont = delayRender();
const font = new FontFace(
  "Pretendard",
  `url(${staticFile("fonts/PretendardVariable.woff2")}) format("woff2")`
);
font.load().then(() => {
  document.fonts.add(font);
  continueRender(waitForFont);
});
```

## 자주 걸리는 5가지

1. **`Error: Could not find Chrome`** — `npx remotion browser ensure` 한 번 실행
2. **`out of memory` 렌더 중단** — `--concurrency=1`로 낮추고 재시도
3. **한글이 네모(□)로 렌더됨** — 폰트 `delayRender` 없이 바로 렌더한 경우. 위 코드 참고
4. **`The composition's durationInFrames must be a positive integer`** — `fps * seconds`가 소수점이 되지 않도록
5. **Claude Code가 스킬을 인식 못함** — `.claude/skills/` 디렉토리 위치 재확인, `claude --debug`로 로드 로그 보기

---

## ✍️ 두진아님이 직접 채워야 할 부분

- [ ] Remotion 라이선스 관련, 본인이 확인한 최신 가격표 스크린샷 또는 링크
- [ ] 윈도우 환경에서 실제로 겪은 경로 이슈 구체 사례 (에러 메시지 원문)
- [ ] Pretendard `.woff2` 파일 직접 다운로드 링크 (저장소에 포함할지 여부 결정)
- [ ] "자주 걸리는 5가지"에 본인 경험 기반 에피소드 1~2개 교체
- [ ] Node 버전별 실제 테스트 매트릭스 (20/22/24)
