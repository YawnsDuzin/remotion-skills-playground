# 개념 이해: Skills, Rule, Asset

> 읽는 데 약 6분 · 공식 `remotion-dev/skills` 기준일 2026-04-15

Remotion 생태계에 "Agent Skills"가 들어오면서 혼란스러운 용어가 세 개 생겼다 — Skill, Rule, Asset.
셋 다 에이전트에게 무언가를 "주입"한다는 점에서 비슷해 보이지만, 생명주기와 역할이 다르다.
이 문서는 각 개념의 실체를 코드 관점에서 정리한다. 추상적인 정의보다는 "언제 어느 것을 쓰는가"에 초점을 맞춘다.

## Remotion Agent Skills란

Remotion Agent Skills는 Claude Code 같은 코딩 에이전트가 Remotion 프로젝트를 만들 때 참고하는 사전 정의된 지침 묶음이다.
단순 프롬프트 템플릿이 아니라, 에이전트가 "이 상황엔 이 컴포넌트를 써라"고 판단할 수 있도록 코드 예시·규칙·파일 구조까지 포함한 패키지다.

## Claude Code와 만나면 뭐가 달라지나

Claude Code 없이 Remotion을 쓰면 Composition·Sequence·interpolate API 문서를 직접 읽고 매번 구조를 짠다.
Skills가 주입되면 에이전트가 "15초 타이틀 시퀀스" 같은 자연어 요청을 곧바로 `<Composition fps={30} durationInFrames={450}>` 구조로 옮긴다 — 결정 비용이 사람에서 에이전트로 넘어간다.

체감 차이는 "첫 렌더까지 걸리는 시간"에서 극명하다. Skills 없이 Remotion 문서만 보고 10초짜리 세로 쇼츠 1개를 만들면 구조 고민·폰트 삽입·타이밍 계산에 2~3시간이 녹는다. 동일 작업을 `weather-menu` 스킬과 함께 Claude Code에 맡기면 첫 프롬프트에서 미리보기까지 10분 남짓. 두 번째부터는 메뉴 배열만 바꿔 분 단위로 양산된다.

## 공식 저장소와 본 저장소의 관계

공식 [`remotion-dev/skills`](https://github.com/remotion-dev/skills)는 스킬 원본(source of truth)이고, 이 저장소는 그 위에 쌓은 레이어다.
포크가 아니라 참조 관계 — 공식이 업데이트되면 여기서는 "이 변경으로 한국어 환경에서 뭐가 바뀌는가"를 기록한다. 공식 저장소 drift 체크 주기는 월 1회를 목표로 한다.

## Skill · Rule · Asset의 차이

| 구분 | 수명 | 사례 | 본 저장소 경로 |
|---|---|---|---|
| **Skill** | 프로젝트 생성 시점 | `weather-menu` 스킬 | [`skills/weather-menu.md`](../skills/weather-menu.md) |
| **Skill (공용)** | 프로젝트 생성 시점 | 컴포지션 구조 규칙 | [`skills/remotion-composition.md`](../skills/remotion-composition.md) |
| **Rule** | 세션 내내 유지 | "항상 TypeScript 엄격 모드" | `CLAUDE.md` (프로젝트 루트) |
| **Asset** | 런타임 참조 | Pretendard 폰트 | `examples/weather-menu/public/fonts/` |

한 줄 요약: **Skill은 "어떻게 짤지", Rule은 "어떤 기준으로 짤지", Asset은 "어떤 재료로 짤지"를 담당한다.**

## 언제 쓰고 언제 안 쓰는가

Skills가 빛나는 지점은 "반복적인 영상 포맷"이다 — 주간 리포트, SNS 쇼츠, 교육 영상 인트로처럼.
반대로 한 번만 만들고 버릴 영상이라면 Skills 설치 비용이 본 작업보다 클 수 있다.

한 번 포기했던 사례 — 컨퍼런스 발표용 30초 오프닝 영상 1개만 필요한 상황. 스킬 설계·테스트에 3시간을 썼는데, 정작 결과물은 After Effects 템플릿 장터에서 5,000원짜리 사서 5분 편집하는 게 빨랐다. **1회성 + 단순 모션**은 Skills 영역이 아니다. 더 자세한 판단 기준은 [`docs/03-patterns.md`](./03-patterns.md)의 마지막 섹션 참고.

다음 — Remotion API 자체를 파고들려면 [`docs/05-core-api.md`](./05-core-api.md)로. 환경부터 먼저 맞추려면 [`docs/01-setup.md`](./01-setup.md). 용어가 헷갈리면 언제든 [`docs/14-glossary.md`](./14-glossary.md).
