# 환경 설정

> 읽는 데 약 10분 · 기준일 2026-04-15

Remotion은 네이티브 바이너리(Chrome Headless, FFmpeg)에 의존하기 때문에 OS마다 걸리는 지점이 다르다.
이 문서는 macOS·윈도우·리눅스 각각에서 "설치 후 첫 렌더가 성공"하는 지점까지의 최단 경로를 정리한다.
한글 폰트 설정은 공식 가이드에 없으므로 이 문서에서만 다룬다.

## 전제 조건

- **Node.js 버전 매트릭스** (본 저장소 `examples/`에서 실측)

  | Node | 상태 | 비고 |
  |---|---|---|
  | 18.x | ⚠️ 비권장 | Remotion 4.x는 돌아가나 일부 의존성 경고 |
  | 20 LTS | ✅ OK | 안정적. 메모리 소비 가장 낮음 |
  | 22 LTS | ✅ 권장 | CI 기본값. `--experimental-vm-modules` 불필요 |
  | 24.x | ✅ OK | 2025-10 릴리스 이후 특이사항 없음 |

- **Claude Code 최신 버전** (`claude --version`으로 확인)
- **Remotion 라이선스**: 개인·소규모 팀(4명 미만)은 무료, 개인 사업자도 무료, 법인 4명 이상부터 유료($15/개발자/월, 2026-04 기준) — [공식 라이선스 페이지](https://www.remotion.dev/docs/license)에서 최종 확인

## macOS

M1~M4 모두 문제없이 돌아간다. Rosetta 불필요.
주의점 하나 — `brew`로 설치한 Node와 `nvm`으로 설치한 Node가 섞이면 `remotion studio` 실행 시 Chromium 경로를 못 찾는다. 하나로 통일할 것. `which node`와 `which npx`가 같은 prefix를 가리키는지 확인.

## 윈도우

WSL2를 권장하되, 네이티브 윈도우도 가능하다. 네이티브에서 쓸 거면 `C:\Program Files` 같이 공백 있는 경로는 피한다 — 경로에 공백이 있으면 Remotion 내부의 FFmpeg 호출이 깨진다.

실제로 본 에러 메시지 예시:

```
Error: spawn C:\Users\Two Jinah\AppData\Local\...\ffmpeg.exe ENOENT
  at ChildProcess._handle.onexit (node:internal/child_process:283:19)
```

사용자 이름에 공백이 있으면 홈 디렉토리 자체가 문제다. 이럴 땐 `C:\dev\<project>`처럼 드라이브 루트에 가까운 경로로 옮기고, PowerShell보단 Windows Terminal + Git Bash 조합을 쓴다.

## 리눅스

Ubuntu 22.04+ 기준 아래 패키지가 없으면 Chromium이 뜨지 않는다. 에러 메시지가 모호하니 미리 설치.

```bash
sudo apt-get install -y libnss3 libatk1.0-0 libatk-bridge2.0-0 \
  libcups2 libxkbcommon0 libxcomposite1 libxdamage1 libxfixes3 \
  libxrandr2 libgbm1 libasound2
```

## 프로젝트 시작 3가지 경로

1. **새로 만들기**: `npx create-video@latest <project-name>` — 처음이라면 이것
2. **기존 Next.js/Vite 프로젝트에 추가**: `npm i remotion @remotion/cli` 후 `src/remotion/` 디렉토리 수동 생성 — 통합 대시보드용
3. **이 저장소 포크**: [`examples/weather-menu`](../examples/weather-menu)를 복사해 시작 — 한국어 환경 사전 설정이 이미 들어있음, 가장 빠른 경로

## 한글 폰트 설정 (공식 가이드에 없는 부분)

Pretendard를 기본으로 쓴다. [`orioncactus/pretendard` 릴리스](https://github.com/orioncactus/pretendard/releases)에서 `PretendardVariable.woff2` 받아 `public/fonts/`에 넣고 아래 로더를 `src/fonts.ts`로 저장, `Root.tsx` 상단에서 `import "./fonts"`.
CJK 전체 구간이 필요하면 Noto Sans KR을, 제목 전용이라면 Pretendard Variable을 쓰는 쪽이 파일 크기상 유리하다.

```tsx
// src/fonts.ts
import { continueRender, delayRender, staticFile } from "remotion";

const handle = delayRender("Loading Pretendard font");
const font = new FontFace(
  "Pretendard",
  `url(${staticFile("fonts/PretendardVariable.woff2")}) format("woff2-variations")`,
  { weight: "45 920" }
);
font.load().then((loaded) => {
  document.fonts.add(loaded);
  continueRender(handle);
});
```

## 자주 걸리는 5가지

1. **`Error: Could not find Chrome`** — `npx remotion browser ensure` 한 번 실행. Remotion 4.x에선 첫 실행 시 자동 다운로드를 시도하지만 회사망 프록시 환경에선 수동 실행 필요
2. **`FATAL: out of memory` 렌더 중단** — M1 8GB에서 1080p 장편 렌더 시 실제로 재현됨. `--concurrency=1 --chrome-mode=chrome-for-testing`로 낮추고 재시도
3. **한글이 네모(□)로 렌더됨** — 로컬 Studio에선 보이는데 렌더 결과만 깨지는 케이스. 원인은 거의 `delayRender()` 누락. 위 폰트 로더 코드 사용
4. **`The composition's durationInFrames must be a positive integer, got 149.99999999999997`** — `fps * seconds` 계산 시 부동소수점 오차. `Math.round(fps * seconds)`로 감싸기
5. **Claude Code가 스킬을 인식 못함** — `.claude/skills/` 위치 확인, 파일명에 공백 없는지, frontmatter의 `name` 필드가 파일명과 일치하는지 점검. `claude --debug 2>&1 | grep skill`로 로드 로그 확인
