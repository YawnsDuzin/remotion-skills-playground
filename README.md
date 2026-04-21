# remotion-skills-playground

> Claude Code로 Remotion Agent Skills를 다루는 한국어 실전 노트

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/yawnsduzin/remotion-skills-playground/ci.yml?branch=main)](../../actions)
[![Last commit](https://img.shields.io/github/last-commit/yawnsduzin/remotion-skills-playground)](../../commits/main)
[![Docs](https://img.shields.io/badge/docs-15%20pages-blue)](./docs)
[![Skills](https://img.shields.io/badge/skills-6-orange)](./skills)
[![Examples](https://img.shields.io/badge/examples-4-green)](./examples)

코드로 영상을 만드는 Remotion에, Claude Code가 "어떤 컴포넌트를 어떻게 조합할지" 자동으로 판단하게 해주는 Agent Skills를 얹는다.
이 저장소 하나로 Remotion을 한국어로 배우고, Claude Code와 통합하고, 실제 운영 가능한 자동 영상 파이프라인까지 구축할 수 있도록 모든 자료를 한 곳에 모은다.

## 누구를 위한 저장소인가

- React는 쓸 줄 알고, Claude Code는 들어본 적 있지만 Remotion은 처음인 2~5년 차 개발자
- "AI 에이전트로 영상을 자동 생성한다"는 키워드로 온 시니어 개발자 — [`docs/00-concepts.md`](./docs/00-concepts.md)만 봐도 충분하다
- 한글 폰트, 한국어 TTS, 국내 API 연동에서 삽질한 기록이 필요한 사람

## 빠른 시작 (5분)

```bash
git clone https://github.com/yawnsduzin/remotion-skills-playground
cd remotion-skills-playground/examples/title-card
npm install && npm start
```

`title-card`가 가장 단순한 입문 예제. Claude Code로 직접 새 영상을 만드는 흐름은 [`docs/02-tutorial.md`](./docs/02-tutorial.md).

## 학습 경로 — 어디부터 읽을지

목적에 따라 필요한 것만 골라 읽어도 되도록 4가지 트랙으로 정리.

### 🟢 처음 시작 (45분)

1. [`docs/00-concepts.md`](./docs/00-concepts.md) — Skills/Rule/Asset 개념 (6분)
2. [`docs/01-setup.md`](./docs/01-setup.md) — 환경 설정 + 한글 폰트 (10분)
3. [`docs/02-tutorial.md`](./docs/02-tutorial.md) — 첫 영상 렌더 (15분)
4. [`examples/title-card`](./examples/title-card) — 가장 단순한 예제 실행 (10분)

### 🔵 Remotion 핵심 (60분)

5. [`docs/05-core-api.md`](./docs/05-core-api.md) — 외워둘 8개 API
6. [`docs/06-animation.md`](./docs/06-animation.md) — 애니메이션 깊이 있게
7. [`docs/07-data-fetching.md`](./docs/07-data-fetching.md) — 외부 데이터 통합
8. [`docs/08-audio-tts.md`](./docs/08-audio-tts.md) — 오디오/한국어 TTS

### 🟡 운영 단계 (50분)

9. [`docs/09-rendering.md`](./docs/09-rendering.md) — 로컬/Lambda/Cloud Run
10. [`docs/10-deployment.md`](./docs/10-deployment.md) — GitHub Actions cron
11. [`docs/13-performance.md`](./docs/13-performance.md) — 성능 최적화
12. [`examples/daily-report`](./examples/daily-report) — 자동 일일 리포트

### 🟣 스킬 작성자 (40분)

13. [`docs/11-skills-authoring.md`](./docs/11-skills-authoring.md) — 자기만의 스킬 만들기
14. [`docs/03-patterns.md`](./docs/03-patterns.md) — 활용 패턴 4가지
15. [`skills/`](./skills) — 6개 스킬 구현 참고

## 문서 전체 인덱스

| # | 경로 | 내용 | 예상 시간 |
|---|---|---|---|
| 00 | [`docs/00-concepts.md`](./docs/00-concepts.md) | Skills·Rule·Asset 개념 정리 | 6분 |
| 01 | [`docs/01-setup.md`](./docs/01-setup.md) | OS별 환경 설정 + 한글 폰트 | 10분 |
| 02 | [`docs/02-tutorial.md`](./docs/02-tutorial.md) | 10분 안에 첫 영상 렌더 | 15분 |
| 03 | [`docs/03-patterns.md`](./docs/03-patterns.md) | 실전 시나리오 4가지 | 12분 |
| 04 | [`docs/04-references.md`](./docs/04-references.md) | 원문/커뮤니티 링크 | 3분 |
| 05 | [`docs/05-core-api.md`](./docs/05-core-api.md) | 외워둘 8개 Core API | 12분 |
| 06 | [`docs/06-animation.md`](./docs/06-animation.md) | 애니메이션 (이징/스프링/트랜지션) | 14분 |
| 07 | [`docs/07-data-fetching.md`](./docs/07-data-fetching.md) | calculateMetadata + delayRender | 13분 |
| 08 | [`docs/08-audio-tts.md`](./docs/08-audio-tts.md) | Audio API + 한국어 TTS | 14분 |
| 09 | [`docs/09-rendering.md`](./docs/09-rendering.md) | 로컬/Lambda/Cloud Run 렌더 | 13분 |
| 10 | [`docs/10-deployment.md`](./docs/10-deployment.md) | GitHub Actions 자동 파이프라인 | 12분 |
| 11 | [`docs/11-skills-authoring.md`](./docs/11-skills-authoring.md) | 자기만의 스킬 작성하기 | 11분 |
| 12 | [`docs/12-troubleshooting.md`](./docs/12-troubleshooting.md) | 25개 에러 해결 모음 | 10분 |
| 13 | [`docs/13-performance.md`](./docs/13-performance.md) | 성능 최적화 8가지 레버 | 11분 |
| 14 | [`docs/14-glossary.md`](./docs/14-glossary.md) | 한영 용어집 | 5분 |

## 스킬 카탈로그

`.claude/skills/`에 복사해 사용. 각 스킬은 frontmatter의 `depends_on`이 자동 의존성을 표시.

| 스킬 | 설명 | 의존 |
|---|---|---|
| [`skills/remotion-composition.md`](./skills/remotion-composition.md) | Composition 작성 공통 규칙 | — |
| [`skills/motion.md`](./skills/motion.md) | spring/interpolate 프리셋 6개 | composition |
| [`skills/title-card.md`](./skills/title-card.md) | 5초 타이틀 카드 (가로/세로) | composition, motion |
| [`skills/weather-menu.md`](./skills/weather-menu.md) | 날씨별 카페 메뉴 쇼츠 | composition |
| [`skills/data-fetch.md`](./skills/data-fetch.md) | 외부 API 호출 + 캐싱 패턴 | composition |
| [`skills/tts-korean.md`](./skills/tts-korean.md) | CLOVA Voice 통합 | composition, data-fetch |

## 동작하는 예제

각 디렉토리에서 `npm install && npm start`로 즉시 실행 가능.

| 예제 | 핵심 학습 | 실행 명령 |
|---|---|---|
| [`examples/title-card`](./examples/title-card) | 가장 단순. Composition 두 개, 모션 프리셋 | `npm start` |
| [`examples/weather-menu`](./examples/weather-menu) | 세로 쇼츠, 데이터 props, staggered 등장 | `npm start` |
| [`examples/daily-report`](./examples/daily-report) | calculateMetadata, KOSPI/환율/날씨 API, 차트 | `npm run build:mock` |
| [`examples/blog-summary`](./examples/blog-summary) | 마크다운 → TTS 음성 → 자막 동기화 | `USE_MOCK_TTS=true npm start` |

## 왜 또 만들었나

공식 [`remotion-dev/skills`](https://github.com/remotion-dev/skills)는 레퍼런스 구현이지만, 한국 개발자가 실무에서 부딪히는 지점 — Pretendard 폰트 삽입, 한국어 음성합성 연동, 공공데이터 포털 API를 스킬에 넘기는 법 — 은 비어있다.
이 저장소는 그 공백을 메우는 게 목적이다. 진행 중인 작업과 향후 계획은 [`ROADMAP.md`](./ROADMAP.md).

## 기여 / 라이선스

- 버그·오타·한국어 자료 제보는 [이슈](../../issues), 새 패턴/예제는 PR
- 외부 기여 범위와 PR 체크리스트는 [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- 저장소 공용 규칙(톤·구조·스킬 작성)은 [`CLAUDE.md`](./CLAUDE.md)
- MIT — [`LICENSE`](./LICENSE). 코드 조각은 그대로 복붙해 써도 된다. 스크린샷·데모 영상은 저작자 표기 부탁
