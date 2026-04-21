# remotion-skills-playground

> Claude Code로 Remotion Agent Skills를 다루는 한국어 실전 노트

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/yawnsduzin/remotion-skills-playground/ci.yml?branch=main)](../../actions)
[![Last commit](https://img.shields.io/github/last-commit/yawnsduzin/remotion-skills-playground)](../../commits/main)
[![Status](https://img.shields.io/badge/status-active%20curation-yellow)](./ROADMAP.md)
[![Docs](https://img.shields.io/badge/docs-21%20pages-blue)](./docs)
[![Skills](https://img.shields.io/badge/skills-7-orange)](./skills)
[![Examples](https://img.shields.io/badge/examples-5-green)](./examples)

코드로 영상을 만드는 Remotion에, Claude Code가 "어떤 컴포넌트를 어떻게 조합할지" 자동으로 판단하게 해주는 Agent Skills를 얹는다.
이 저장소 하나로 Remotion을 한국어로 배우고, Claude Code와 통합하고, 실제 운영 가능한 자동 영상 파이프라인까지 구축할 수 있도록 모든 자료를 한 곳에 모은다.

### 용어 미니 가이드 — 셋 중 처음 듣는 게 있다면

- **Remotion** — React 컴포넌트로 영상을 만드는 프레임워크. MP4/GIF/WebM으로 렌더. [공식](https://www.remotion.dev)
- **Claude Code** — Anthropic의 CLI 코딩 에이전트. 터미널에서 자연어로 코드를 쓰고 고친다. [공식](https://docs.claude.com/en/docs/claude-code)
- **Agent Skills** — 에이전트의 컨텍스트로 자동 로드되는 마크다운 지침 패키지. "이런 요청엔 이렇게 코딩하라"의 재사용 가능한 형태

## 저장소 성격과 대상

- **성격**: `@yawnsduzin`의 개인 학습 기록 + 한국어 자료 큐레이션 (MIT 공개, 외부 기여 환영하되 범위 제한 — [CONTRIBUTING.md](./CONTRIBUTING.md))
- **1차 독자**: React는 쓸 줄 알고 Claude Code는 들어봤지만 Remotion은 처음인 2~5년 차 한국 개발자
- **2차 독자**: "AI 에이전트로 영상 자동 생성" 키워드로 온 시니어 — [`docs/00-concepts.md`](./docs/00-concepts.md)만 봐도 충분
- **3차 독자**: 한글 폰트·한국어 TTS·국내 API 연동에서 삽질한 기록이 필요한 사람

> 📌 **Claude Code를 쓰지 않는 경우에도** `docs/`와 `examples/`는 한국어 Remotion 학습 교재로 독립 사용 가능. `skills/`만 에이전트 없으면 쓰임새가 없다.

## 데모

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   📽️  데모 GIF/MP4는 v1.0에서 추가 예정               │
│                                                     │
│   진행 상황 — ROADMAP.md / CHANGELOG.md             │
│   지금 당장 결과물을 보려면 아래 빠른 시작으로        │
│   title-card를 직접 렌더해 볼 것                    │
│                                                     │
└─────────────────────────────────────────────────────┘
```

## 빠른 시작 (5분)

**필요 환경**: Node 22 LTS (권장) · `nvm use`로 `.nvmrc` 읽힘 · 개인 사용은 Remotion 무료 · Claude Code는 선택 (스킬 사용 시에만)

```bash
git clone https://github.com/yawnsduzin/remotion-skills-playground
cd remotion-skills-playground
bash scripts/fetch-pretendard.sh     # 한글 폰트 일괄 설치 (선택)
cd examples/title-card && npm install && npm start
```

브라우저에 Remotion Studio(`http://localhost:3000`)가 뜨면 성공. Claude Code로 새 영상을 직접 만드는 흐름은 [`docs/02-tutorial.md`](./docs/02-tutorial.md).

## 저장소 지도

```
.
├── docs/              21개 한국어 문서 (입문 00~14 · 심화 15~20) + 인덱스 README
├── skills/            6개 Agent Skill (.claude/skills/로 복사해 사용)
├── examples/          4개 동작 예제 (npm install && npm start로 즉시 실행)
├── scripts/           폰트 다운로드 + CI 스크립트 (번역체·frontmatter 검사)
├── assets/            데모 영상/스크린샷 (v1.0 예정)
├── .github/           CI 워크플로우 · 이슈/PR 템플릿 · Dependabot
├── CLAUDE.md          저장소 공용 규칙 (Claude Code 세션에 자동 로드)
├── ROADMAP.md         v0.1 → v1.1+ 진행 현황
├── CHANGELOG.md       버전별 변경 이력
├── CONTRIBUTING.md    외부 기여 범위 + PR 체크리스트
└── SECURITY.md        취약점 제보 절차
```

## 학습 경로 — 어디부터 읽을지

목적에 따라 네 가지 트랙. 전체 문서 인덱스와 요약은 [`docs/README.md`](./docs/README.md).

### 🟢 처음 시작 (45분)

1. [`00-concepts`](./docs/00-concepts.md) — Skills/Rule/Asset 개념
2. [`01-setup`](./docs/01-setup.md) — 환경 설정 + 한글 폰트
3. [`02-tutorial`](./docs/02-tutorial.md) — 첫 영상 렌더
4. [`examples/title-card`](./examples/title-card) — 가장 단순한 예제 실행

### 🔵 Remotion 핵심 (60분)

5. [`05-core-api`](./docs/05-core-api.md) — 외워둘 8개 API
6. [`06-animation`](./docs/06-animation.md) — 애니메이션 깊이 있게
7. [`07-data-fetching`](./docs/07-data-fetching.md) — 외부 데이터
8. [`08-audio-tts`](./docs/08-audio-tts.md) — 오디오/한국어 TTS

### 🟡 운영 단계 (60분)

9. [`09-rendering`](./docs/09-rendering.md) — 로컬/Lambda/Cloud Run
10. [`10-deployment`](./docs/10-deployment.md) — GitHub Actions cron
11. [`13-performance`](./docs/13-performance.md) — 성능 최적화
12. [`19-testing`](./docs/19-testing.md) — 테스트 3계층
13. [`20-security`](./docs/20-security.md) — 보안
14. [`examples/daily-report`](./examples/daily-report) — 자동 일일 리포트

### 🟣 심화 / 스킬 작성자 (70분)

15. [`11-skills-authoring`](./docs/11-skills-authoring.md) — 스킬 만들기
16. [`15-player`](./docs/15-player.md) — 웹 임베드
17. [`16-images-video`](./docs/16-images-video.md) — 미디어 임베드
18. [`17-subtitles`](./docs/17-subtitles.md) — 자막 (SRT/워드)
19. [`18-fonts-deep-dive`](./docs/18-fonts-deep-dive.md) — 폰트 심화

## 문서 전체 인덱스 (21개)

**입문** [`00`](./docs/00-concepts.md) · [`01`](./docs/01-setup.md) · [`02`](./docs/02-tutorial.md) · [`03`](./docs/03-patterns.md) · [`04`](./docs/04-references.md)
**핵심** [`05`](./docs/05-core-api.md) · [`06`](./docs/06-animation.md) · [`07`](./docs/07-data-fetching.md) · [`08`](./docs/08-audio-tts.md)
**운영** [`09`](./docs/09-rendering.md) · [`10`](./docs/10-deployment.md) · [`11`](./docs/11-skills-authoring.md) · [`12`](./docs/12-troubleshooting.md) · [`13`](./docs/13-performance.md) · [`14`](./docs/14-glossary.md)
**심화** [`15`](./docs/15-player.md) · [`16`](./docs/16-images-video.md) · [`17`](./docs/17-subtitles.md) · [`18`](./docs/18-fonts-deep-dive.md) · [`19`](./docs/19-testing.md) · [`20`](./docs/20-security.md)

각 문서별 소요 시간·요약은 [`docs/README.md`](./docs/README.md).

## 스킬 카탈로그 (7개)

**설치** — 사용할 프로젝트 루트에서:

```bash
mkdir -p .claude/skills && cp /path/to/remotion-skills-playground/skills/*.md .claude/skills/
```

또는 필요한 스킬만 선별 복사. 의존 그래프와 검증 체크리스트는 [`skills/README.md`](./skills/README.md).

| 스킬 | 설명 | 의존 |
|---|---|---|
| [`skills/remotion-composition.md`](./skills/remotion-composition.md) | Composition 작성 공통 규칙 | — |
| [`skills/motion.md`](./skills/motion.md) | spring/interpolate 프리셋 6개 | composition |
| [`skills/title-card.md`](./skills/title-card.md) | 5초 타이틀 카드 (가로/세로) | composition, motion |
| [`skills/weather-menu.md`](./skills/weather-menu.md) | 날씨별 카페 메뉴 쇼츠 | composition |
| [`skills/data-fetch.md`](./skills/data-fetch.md) | 외부 API 호출 + 캐싱 패턴 | composition |
| [`skills/tts-korean.md`](./skills/tts-korean.md) | CLOVA Voice 통합 | composition, data-fetch |
| [`skills/broll-composition.md`](./skills/broll-composition.md) | Veo/Pexels B-roll + 데이터 오버레이 | composition |

## 동작하는 예제 (5개)

각 디렉토리에서 `npm install && npm start`로 즉시 실행. 상세는 [`examples/README.md`](./examples/README.md).

| 예제 | 핵심 학습 | 난이도 |
|---|---|---|
| [`examples/title-card`](./examples/title-card) | Composition, useCurrentFrame, spring | 하 |
| [`examples/weather-menu`](./examples/weather-menu) | Series, staggered 등장, props 검증 | 중 |
| [`examples/daily-report`](./examples/daily-report) | calculateMetadata, KOSPI/환율/날씨 + 캐싱 | 중상 |
| [`examples/blog-summary`](./examples/blog-summary) | 마크다운 → TTS 내레이션 | 상 |
| [`examples/finance-broll`](./examples/finance-broll) | OffthreadVideo + 데이터 오버레이 (B-roll 하이브리드) | 상 |

## FAQ

<details>
<summary><b>Claude Code 없이도 쓸 수 있나?</b></summary>

예. `docs/`는 한국어 Remotion 교재로 독립 사용 가능, `examples/` 4개 모두 Remotion CLI만으로 실행된다. `skills/`만 Claude Code(또는 호환 에이전트) 있어야 의미가 있다.
</details>

<details>
<summary><b>API 키(KMA, CLOVA, AWS) 없이 돌려볼 수 있나?</b></summary>

예. `title-card`·`weather-menu`는 외부 API 전혀 불필요. `daily-report`는 `npm run build:mock`로 mock 데이터 렌더, `blog-summary`는 `USE_MOCK_TTS=true`로 무음 플레이스홀더 사용 가능.
</details>

<details>
<summary><b>Remotion 라이선스는 어떻게 되나?</b></summary>

개인·4인 미만 팀·개인사업자는 무료. 법인 4인 이상부터 유료($15/개발자/월, 2026-04 기준). 자세한 건 [공식 라이선스](https://www.remotion.dev/docs/license)와 [`docs/01-setup.md`](./docs/01-setup.md#전제-조건).
</details>

<details>
<summary><b>Lambda나 Cloud Run 없이 로컬 렌더만으로 충분한가?</b></summary>

일 100편 미만이면 로컬 충분. 그 이상 대량 양산이나 이벤트 기반 트리거가 필요하면 Lambda가 비용·속도에서 유리. 판단 기준은 [`docs/09-rendering.md`](./docs/09-rendering.md#셋의-비교).
</details>

<details>
<summary><b>한글이 네모(□)로 렌더된다</b></summary>

99% 폰트 로드 실패. `public/fonts/PretendardVariable.woff2`가 있는지 먼저 확인 — `bash scripts/fetch-pretendard.sh`로 일괄 다운로드. 그래도 안 되면 [`docs/12-troubleshooting.md`](./docs/12-troubleshooting.md#폰트한글) 참조.
</details>

<details>
<summary><b>공식 <code>remotion-dev/skills</code>와 뭐가 다른가?</b></summary>

공식은 영어 레퍼런스, 본 저장소는 한국어 + 실전 경험. Pretendard 폰트 설정·CLOVA/Typecast TTS·기상청 API 연동처럼 한국 개발자가 실제로 막히는 지점에 집중.
</details>

<details>
<summary><b>기여하려면 뭘 해야 하나?</b></summary>

라벨 `good first issue` / `help wanted: korean-resource` / `help wanted: screenshot` / `help wanted: bugfix`가 붙은 이슈만 외부 PR 받음. 상세는 [`CONTRIBUTING.md`](./CONTRIBUTING.md).
</details>

## 왜 또 만들었나

공식 [`remotion-dev/skills`](https://github.com/remotion-dev/skills)는 영어 레퍼런스 구현. 한국 개발자가 실무에서 부딪히는 지점 — Pretendard 폰트 삽입, 한국어 음성합성 연동, 공공데이터 포털 API를 스킬에 넘기는 법 — 은 비어있다.
이 저장소는 그 공백을 메우는 게 목적이다. 진행 중·예정 작업은 [`ROADMAP.md`](./ROADMAP.md), 변경 이력은 [`CHANGELOG.md`](./CHANGELOG.md).

## 기여 · 라이선스 · 보안

- 버그·오타·한국어 자료 제보는 [이슈](../../issues), 새 패턴/예제는 PR
- 외부 기여 범위와 PR 체크리스트는 [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- 저장소 공용 규칙(톤·구조·스킬 작성)은 [`CLAUDE.md`](./CLAUDE.md)
- 보안 취약점 제보는 [`SECURITY.md`](./SECURITY.md)
- MIT — [`LICENSE`](./LICENSE). 코드 조각은 그대로 복붙해 써도 된다. 스크린샷·데모 영상은 저작자 표기 부탁
