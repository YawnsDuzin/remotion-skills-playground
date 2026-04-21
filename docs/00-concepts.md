# 개념 이해: Skills, Rule, Asset

> 읽는 데 약 6분

Remotion 생태계에 "Agent Skills"가 들어오면서 혼란스러운 용어가 세 개 생겼다 — Skill, Rule, Asset.
셋 다 에이전트에게 무언가를 "주입"한다는 점에서 비슷해 보이지만, 생명주기와 역할이 다르다.
이 문서는 각 개념의 실체를 코드 관점에서 정리한다. 추상적인 정의보다는 "언제 어느 것을 쓰는가"에 초점을 맞춘다.

## Remotion Agent Skills란

Remotion Agent Skills는 Claude Code 같은 코딩 에이전트가 Remotion 프로젝트를 만들 때 참고하는 사전 정의된 지침 묶음이다.
단순 프롬프트 템플릿이 아니라, 에이전트가 "이 상황엔 이 컴포넌트를 써라"고 판단할 수 있도록 코드 예시·규칙·파일 구조까지 포함한 패키지다.

## Claude Code와 만나면 뭐가 달라지나

Claude Code 없이 Remotion을 쓰면 Composition·Sequence·interpolate API 문서를 직접 읽고 매번 구조를 짠다.
Skills가 주입되면 에이전트가 "15초 타이틀 시퀀스" 같은 자연어 요청을 곧바로 `<Composition fps={30} durationInFrames={450}>` 구조로 옮긴다 — 결정 비용이 사람에서 에이전트로 넘어간다.

## 공식 저장소와 본 저장소의 관계

공식 [`remotion-dev/skills`](https://github.com/remotion-dev/skills)는 스킬 원본(source of truth)이고, 이 저장소는 그 위에 쌓은 레이어다.
포크가 아니라 참조 관계 — 공식이 업데이트되면 여기서는 "이 변경으로 한국어 환경에서 뭐가 바뀌는가"를 기록한다.

## Skill · Rule · Asset의 차이

| 구분 | 수명 | 사례 | 어디에 사는가 |
|---|---|---|---|
| **Skill** | 프로젝트 생성 시점 | "Remotion 컴포지션 작성법" | `.claude/skills/*.md` |
| **Rule** | 세션 내내 유지 | "항상 TypeScript 엄격 모드로" | `CLAUDE.md` |
| **Asset** | 런타임 참조 | 폰트 파일, 로고 이미지 | `public/` |

한 줄 요약: **Skill은 "어떻게 짤지", Rule은 "어떤 기준으로 짤지", Asset은 "어떤 재료로 짤지"를 담당한다.**

## 언제 쓰고 언제 안 쓰는가

Skills가 빛나는 지점은 "반복적인 영상 포맷"이다 — 주간 리포트, SNS 쇼츠, 교육 영상 인트로처럼.
반대로 한 번만 만들고 버릴 영상이라면 Skills 설치 비용이 본 작업보다 클 수 있다. 자세한 판단 기준은 [`docs/03-patterns.md`](./03-patterns.md) 끝부분을 참고.

---

## ✍️ 두진아님이 직접 채워야 할 부분

- [ ] "Claude Code와 만나면" 섹션에 본인이 실제로 체감한 생산성 변화 한 문단 추가 (before/after)
- [ ] Skill·Rule·Asset 표의 "사례" 열을 본 저장소에 실제 있는 파일명으로 교체
- [ ] 공식 저장소 커밋 해시/날짜 명시 ("2026-XX-XX 기준" 형태)
- [ ] "언제 안 쓰는가"에 본인이 실제로 포기했던 케이스 1개 추가
