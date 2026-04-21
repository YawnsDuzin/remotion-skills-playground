# 한영 용어집

> 읽는 데 약 5분 · 기준일 2026-04-15

Remotion + Agent Skills 문서를 한국어로 옮기다 보면 매번 같은 용어를 다르게 번역하게 된다.
이 문서는 본 저장소가 일관되게 쓰는 30여 개 용어를 정리한다. PR 리뷰 시 기준으로 사용.

## Remotion 핵심

| 영문 | 본 저장소 표기 | 메모 |
|---|---|---|
| Composition | 컴포지션 | 영어 그대로도 자주 씀 |
| Sequence | 시퀀스 | 그대로 |
| Series | 시리즈 | "연속 시퀀스" 표현은 쓰지 않음 |
| Timeline | 타임라인 | 그대로 |
| Frame | 프레임 | 그대로 |
| FPS (frames per second) | fps / 초당 프레임 | 표 안에선 fps |
| Render | 렌더 / 렌더링 | "렌더하다" 동사 형태 OK |
| Bundle | 번들 | 그대로 |
| Studio | 스튜디오 | 또는 "Remotion Studio" 그대로 |
| Player | 플레이어 | `@remotion/player` 패키지 |
| Lambda | 람다 | "AWS 람다" 또는 "Lambda" |
| Concurrency | 동시성 / 동시 처리 | CLI 옵션 표시는 `concurrency` |

## React / 프론트엔드

| 영문 | 본 저장소 표기 |
|---|---|
| Component | 컴포넌트 |
| Props | props (그대로) |
| State | 상태 |
| Hook | 훅 |
| Render (React) | 리렌더 |
| Mount | 마운트 |
| Effect | 이펙트 |
| Memoization | 메모이제이션 |

## 애니메이션

| 영문 | 본 저장소 표기 |
|---|---|
| Interpolate | 보간 / interpolate |
| Easing | 이징 |
| Spring | 스프링 |
| Damping | 댐핑 |
| Stiffness | 강성 / stiffness |
| Overshoot | 오버슈트 |
| Stagger | 스태거 / 순차 등장 |
| Transition | 트랜지션 |
| Crossfade | 크로스페이드 |
| Wipe | 와이프 |

## 코덱·미디어

| 영문 | 본 저장소 표기 |
|---|---|
| Codec | 코덱 |
| Container | 컨테이너 |
| Bitrate | 비트레이트 |
| Resolution | 해상도 |
| Aspect ratio | 종횡비 / aspect ratio |
| Pixel format | 픽셀 포맷 |
| Lossless | 무손실 |
| Encoding | 인코딩 |

## Agent Skills

| 영문 | 본 저장소 표기 |
|---|---|
| Skill | 스킬 (영문 그대로도 OK) |
| Rule | 룰 / 규칙 — 문맥에 따라 |
| Asset | 에셋 / 자산 |
| Frontmatter | 프론트매터 |
| Dependency | 의존성 |
| Composition (스킬 안에서) | "스킬 컴포지션"이라는 표현은 쓰지 않음. "Remotion Composition"으로 명확히 |

## 자주 헷갈리는 표현

| 잘못된 번역 | 본 저장소 표기 | 이유 |
|---|---|---|
| `~을 통해서` | `~로 / ~으로` | 번역체 1순위 |
| `~에 대해서` | 생략 또는 `~의 / ~을` | 영어 about의 직역 |
| `~을 가지다` | `~이 있다 / ~을 포함하다` | have의 직역 |
| `~에 있어서` | `~에서 / ~의 경우` | in의 직역 |
| `~에 의해서` | `~로 인해 / ~때문에` (가급적 능동) | by의 직역 |
| `~되어집니다` | `~됩니다 / ~된다` | 이중피동 |
| `한국어 문서` | `한국어 문서` (OK) — 단 기술명은 영문 병기 | "Remotion(리모션)" 식으로 |

## 단위·표기

- 시간: 초(s), 프레임(f), 분(m). "10sec" 같은 영문 단위는 코드 외엔 안 씀
- 해상도: `1080×1920` (×는 곱셈 기호 U+00D7, ASCII `x` 아님)
- 색상: `#FAF6F0` 6자리 헥스 권장. 짧게 `#FFF` 가능
- 명령줄: 백틱으로 ``` `npm install` ```. `$` 프롬프트 표시는 코드 블록 안에서만

## 외부 표준 따르기

- **Remotion 공식 문서**의 영문 용어는 그대로 차용 (단 한글 번역 병기)
- **MDN** 한국어판이 있는 용어는 그쪽 표기 따름
- **Anthropic Claude 문서**의 한국어 표기를 우선 (Skills, Tools, Sub-agents 등)

## 본 용어집 갱신 규칙

- 새 PR에서 처음 등장하는 용어는 이 표에 추가
- 기존 표기를 바꿀 땐 모든 문서 일괄 검색·치환 + 그 PR 설명에 명시
- 분기 1회 (3월/6월/9월/12월) 일괄 점검
