# remotion-skills-playground

> Claude Code로 Remotion Agent Skills를 다루는 한국어 실전 노트

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![CI](https://img.shields.io/github/actions/workflow/status/yawnsduzin/remotion-skills-playground/ci.yml?branch=main)](../../actions)
[![Last commit](https://img.shields.io/github/last-commit/yawnsduzin/remotion-skills-playground)](../../commits/main)

코드로 영상을 만드는 Remotion에, Claude Code가 "어떤 컴포넌트를 어떻게 조합할지" 자동으로 판단하게 해주는 Agent Skills를 얹는다.
이 저장소는 그 조합을 한국 개발자 시점에서 정리한 실전 노트다 — 공식 저장소의 번역이 아니라, 실제로 막혔던 지점들을 기록했다.

## 누구를 위한 저장소인가

- React는 쓸 줄 알고, Claude Code는 들어본 적 있지만 Remotion은 처음인 2~5년 차 개발자
- "AI 에이전트로 영상을 자동 생성한다"는 키워드로 온 시니어 개발자 — [`docs/00-concepts.md`](./docs/00-concepts.md)만 봐도 충분하다
- 한글 폰트, 한국어 TTS, 국내 API 연동에서 삽질한 기록이 필요한 사람

## 빠른 시작 (5분)

```bash
# 1. 이 저장소의 완성 예제를 받아 바로 실행
git clone https://github.com/yawnsduzin/remotion-skills-playground
cd remotion-skills-playground/examples/weather-menu
npm install && npm start
```

Claude Code로 직접 새 영상을 만들고 싶다면 [`docs/02-tutorial.md`](./docs/02-tutorial.md)로 이동.

## 무엇이 들어있나

| 경로 | 내용 | 예상 시간 |
|---|---|---|
| [`docs/00-concepts.md`](./docs/00-concepts.md) | Skills·Rule·Asset 개념 정리 | 6분 |
| [`docs/01-setup.md`](./docs/01-setup.md) | OS별 환경 설정 + 한글 폰트 | 10분 |
| [`docs/02-tutorial.md`](./docs/02-tutorial.md) | 10분 안에 첫 영상 렌더 | 15분 |
| [`docs/03-patterns.md`](./docs/03-patterns.md) | 실전 시나리오 4가지 | 12분 |
| [`docs/04-references.md`](./docs/04-references.md) | 원문/커뮤니티 링크 | 3분 |
| [`skills/`](./skills) | 설치 가능한 스킬 파일 | — |
| [`examples/`](./examples) | 바로 돌아가는 예제 프로젝트 | — |

## 왜 또 만들었나

공식 [`remotion-dev/skills`](https://github.com/remotion-dev/skills)는 레퍼런스 구현이지만, 한국 개발자가 실무에서 부딪히는 지점 — Pretendard 폰트 삽입, 한국어 음성합성 연동, 공공데이터 포털 API를 스킬에 넘기는 법 — 은 비어있다.
이 저장소는 그 공백을 메우는 게 목적이다.

## 기여

버그/오타는 이슈, 새 패턴은 PR. 외부 기여 범위와 PR 체크리스트는 [`CONTRIBUTING.md`](./CONTRIBUTING.md) 참고.

## 라이선스

MIT — [`LICENSE`](./LICENSE). 저장소의 코드 조각은 그대로 복붙해 써도 된다. 스크린샷이나 예제 영상은 저작자 표기 부탁.
