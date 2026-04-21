# remotion-skills-playground

> Claude Code로 Remotion Agent Skills를 다루는 한국어 실전 노트

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/yawnsduzin/remotion-skills-playground/ci.yml?branch=main)](../../actions)
[![Last commit](https://img.shields.io/github/last-commit/yawnsduzin/remotion-skills-playground)](../../commits/main)
[![Docs](https://img.shields.io/badge/docs-21%20pages-blue)](./docs)
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
cd remotion-skills-playground
bash scripts/fetch-pretendard.sh   # 한글 폰트 설치 (선택)
cd examples/title-card && npm install && npm start
```

`title-card`가 가장 단순한 입문 예제. Claude Code로 직접 새 영상을 만드는 흐름은 [`docs/02-tutorial.md`](./docs/02-tutorial.md).

## 학습 경로 — 어디부터 읽을지

목적에 따라 네 가지 트랙으로 정리. 전체 문서 인덱스와 요약은 [`docs/README.md`](./docs/README.md).

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

## 스킬 카탈로그 (6개)

`.claude/skills/`에 복사해 사용. 설치·의존 그래프는 [`skills/README.md`](./skills/README.md).

| 스킬 | 설명 | 의존 |
|---|---|---|
| [`skills/remotion-composition.md`](./skills/remotion-composition.md) | Composition 작성 공통 규칙 | — |
| [`skills/motion.md`](./skills/motion.md) | spring/interpolate 프리셋 6개 | composition |
| [`skills/title-card.md`](./skills/title-card.md) | 5초 타이틀 카드 (가로/세로) | composition, motion |
| [`skills/weather-menu.md`](./skills/weather-menu.md) | 날씨별 카페 메뉴 쇼츠 | composition |
| [`skills/data-fetch.md`](./skills/data-fetch.md) | 외부 API 호출 + 캐싱 패턴 | composition |
| [`skills/tts-korean.md`](./skills/tts-korean.md) | CLOVA Voice 통합 | composition, data-fetch |

## 동작하는 예제 (4개)

각 디렉토리에서 `npm install && npm start`로 즉시 실행. 상세는 [`examples/README.md`](./examples/README.md).

| 예제 | 핵심 학습 | 난이도 |
|---|---|---|
| [`examples/title-card`](./examples/title-card) | Composition, useCurrentFrame, spring | 하 |
| [`examples/weather-menu`](./examples/weather-menu) | Series, staggered 등장, props 검증 | 중 |
| [`examples/daily-report`](./examples/daily-report) | calculateMetadata, KOSPI/환율/날씨 + 캐싱 | 중상 |
| [`examples/blog-summary`](./examples/blog-summary) | 마크다운 → TTS 내레이션 | 상 |

## 왜 또 만들었나

공식 [`remotion-dev/skills`](https://github.com/remotion-dev/skills)는 레퍼런스 구현이지만, 한국 개발자가 실무에서 부딪히는 지점 — Pretendard 폰트 삽입, 한국어 음성합성 연동, 공공데이터 포털 API를 스킬에 넘기는 법 — 은 비어있다.
이 저장소는 그 공백을 메우는 게 목적이다. 진행 중·예정 작업은 [`ROADMAP.md`](./ROADMAP.md), 변경 이력은 [`CHANGELOG.md`](./CHANGELOG.md).

## 기여 / 라이선스 / 보안

- 버그·오타·한국어 자료 제보는 [이슈](../../issues), 새 패턴/예제는 PR
- 외부 기여 범위와 PR 체크리스트는 [`CONTRIBUTING.md`](./CONTRIBUTING.md)
- 저장소 공용 규칙(톤·구조·스킬 작성)은 [`CLAUDE.md`](./CLAUDE.md)
- 보안 취약점 제보는 [`SECURITY.md`](./SECURITY.md)
- MIT — [`LICENSE`](./LICENSE). 코드 조각은 그대로 복붙해 써도 된다. 스크린샷·데모 영상은 저작자 표기 부탁
