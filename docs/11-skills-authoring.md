# 자기만의 Agent Skill 작성하기

> 읽는 데 약 11분 · 기준일 2026-04-15

남이 만든 스킬을 쓰는 것과 직접 만드는 것 사이의 차이는 크지 않다 — 마크다운 파일 하나면 끝이다.
그러나 "에이전트가 실제로 따르는 스킬"과 "그냥 메모"의 차이는 있다. 이 문서는 그 차이를 만드는 7가지 규칙을 정리한다.

## 스킬이란 무엇인가

Claude Code 입장에서 스킬은 **세션에 자동으로 주입되는 마크다운 문서**다. `~/.claude/skills/`(글로벌) 또는 `<project>/.claude/skills/`(프로젝트별)에 두면 세션 시작 시 컨텍스트로 로드된다.
형식 자유 — 하지만 frontmatter와 구조가 일관될수록 에이전트가 더 잘 따른다.

## 1. frontmatter 구조

본 저장소 모든 스킬이 공유하는 형식:

```yaml
---
name: weather-menu
description: 날씨 조건에 따라 카페 메뉴를 추천하는 세로 쇼츠 스킬
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition]
---
```

| 필드 | 필수 | 의미 |
|---|---|---|
| `name` | ✅ | 파일명과 일치시킬 것. 에이전트가 이 이름으로 참조 |
| `description` | ✅ | 한 줄로. "무엇을 만드는 스킬인지" |
| `install_to` | — | 사용자 가이드용. 에이전트는 무시 |
| `version` | ✅ | semver. 호환성 깨질 변경 시 메이저 |
| `depends_on` | — | 다른 스킬 이름 배열. 함께 로드 권장 |

## 2. 본문 4개 섹션

순서가 의외로 중요. 에이전트는 위에서 아래로 읽으면서 우선순위를 매긴다.

```
1. 목적 — 한 문단
2. 스펙 — 해상도/길이/폰트/색
3. Props 스키마 — TypeScript 또는 zod
4. 행동 지침 — "이런 입력엔 이렇게 응답하라" 규칙
```

각 섹션을 짧고 단정하게 — 에이전트는 모호한 표현("적절히", "필요시")을 무시하는 경향이 있다.

## 3. 예시는 패턴이 아니라 정답

코드 예시를 넣을 땐 "이거 참고해서 적당히"가 아니라 "이걸 그대로 복사해서 변수만 바꿔라" 식으로 명령형. 이유는 에이전트가 패턴 추상화를 잘 못해서가 아니라, **명시된 정답이 있을 때 안 깨진다**.

나쁜 예:
> Composition은 보통 1080×1920 정도가 좋다.

좋은 예:
> 모든 컴포지션은 정확히 `width={1080} height={1920}`로 선언한다. 다른 해상도가 필요하면 새 스킬을 만들어라.

## 4. 금지 사항을 명시

LLM은 "하지 마라" 형식의 명령을 잘 따른다. 본문에 `## 금지 사항` 섹션을 두고 5개 이내로:

```
## 금지 사항

- `setInterval` / `setTimeout` 사용
- 외부 이미지 URL 직접 참조 (반드시 staticFile)
- `useState`로 시간 추적 (useCurrentFrame 사용)
- emoji 데이터를 컴포넌트 내부에 하드코딩
- TypeScript `any` 사용
```

5개 넘으면 에이전트가 일부를 흘린다. 정말 중요한 5개만.

## 5. 200줄 제한

길이는 단순 미덕이 아니다. 200줄을 넘는 스킬은:

- 컨텍스트 윈도우를 잡아먹어 다른 스킬과 충돌
- 에이전트가 중간을 건너뛸 확률이 올라감
- 유지보수 비용 폭증

길어지면 분리. 예: `weather-menu.md` + `weather-menu-animations.md` + `weather-menu-data.md`로 쪼개고 `depends_on`으로 묶기.

## 6. 의존성 명시 — depends_on

내 스킬이 다른 스킬을 전제로 한다면 frontmatter에 명시.

```yaml
depends_on: [remotion-composition, korean-typography]
```

에이전트는 이 정보를 보고 의존 스킬을 먼저 로드하거나, 없으면 사용자에게 설치를 요청한다.

본 저장소 [`skills/weather-menu.md`](../skills/weather-menu.md)가 [`skills/remotion-composition.md`](../skills/remotion-composition.md)에 의존하는 것이 그 예.

## 7. 테스트 — 새 세션에서 진짜 스킬을 따르는지

스킬을 만들었으면 검증해야 한다. 절차:

1. 새 빈 프로젝트(`npx create-video@latest test-skill --template=blank`)
2. `.claude/skills/`에 만든 스킬 복사
3. `claude` 실행, "이 스킬로 [구체 시나리오] 만들어줘" 프롬프트
4. 생성된 코드가 스킬의 모든 규칙을 따르는지 체크

자동화하고 싶으면 GitHub Actions에 "스킬 회귀 테스트" 잡 추가 — 매주 한 번 실제 Claude API를 호출해 결과물을 평가. 비용 소모는 있지만 스킬이 깨지는 걸 조기 발견.

---

## 스킬 vs CLAUDE.md vs 프롬프트 — 어디에 둘까

| 종류 | 어디에 | 언제 |
|---|---|---|
| 영상 한 종류의 만드는 법 | `skills/<name>.md` | 같은 포맷을 여러 번 만들 때 |
| 프로젝트 전반 규칙 | `CLAUDE.md` | "엄격 모드 TS", "한국어 주석" 같은 메타 규칙 |
| 한 번만 쓰는 지시 | 프롬프트에 직접 | 1회성 작업 |

스킬은 자산이고, CLAUDE.md는 환경이고, 프롬프트는 트리거다.

## 좋은 스킬의 6가지 신호

1. 새 세션에서 모르는 사람이 같은 결과를 만들 수 있다
2. 200줄 이내
3. 금지 사항이 5개 이내
4. 코드 예시가 그대로 컴파일된다
5. 의존 스킬을 frontmatter로 명시
6. 매월 1회 이상 갱신되거나, 갱신 불필요할 만큼 안정적

## 본 저장소 스킬을 참고

- [`skills/remotion-composition.md`](../skills/remotion-composition.md) — 가장 단순한 형태
- [`skills/weather-menu.md`](../skills/weather-menu.md) — 의존성 + 조건별 기본값
- [`skills/data-fetch.md`](../skills/data-fetch.md) — 외부 API 호출 패턴 (예정)
- [`skills/tts-korean.md`](../skills/tts-korean.md) — 한국어 TTS 통합 (예정)

다음 — 막힐 때마다 보는 트러블슈팅: [`docs/12-troubleshooting.md`](./12-troubleshooting.md).
