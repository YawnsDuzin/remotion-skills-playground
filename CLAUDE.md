# CLAUDE.md

이 파일은 본 저장소에서 Claude Code(또는 다른 코딩 에이전트)가 작업할 때 따라야 할 공용 규칙이다.
세션 시작 시 자동 로드된다.

## 저장소 성격

- 한국어 Remotion + Agent Skills 학습 허브
- 큐레이션 + 두진아의 개인 학습 기록
- 공개 (MIT)

## 톤 규칙

- 모든 새 문서는 한국어로 작성
- 어미는 개조식 (`~한다`, `~된다`). 존댓말(`~습니다`) 사용 금지
- 번역체 표현 금지 — `~을 통해서`, `~에 대해서`, `~에 있어서`, `~을 가지다(have)`를 직역하지 말 것
- 기술 용어는 영문 병기 허용 (예: 컴포지션(Composition))
- 이모지는 데이터 마커(✅/◻ 등) 외 장식 목적 사용 금지

## 구조 규칙

- `docs/` 하위 모든 문서는 섹션 8개 이하, 한 섹션의 코드 블록 2개 이하
- 각 문서 상단에 `> 읽는 데 약 N분 · 기준일 YYYY-MM-DD` 형식 표기
- 외부 링크는 깨질 가능성을 가정하고 본문에 핵심 내용 요약 포함
- 새 예제는 `examples/<name>/`에 한 폴더로, `package.json`과 `README.md` 필수

## 코드 규칙

- TypeScript strict 모드 (`tsconfig.json`의 `strict: true`)
- React 19 + Remotion 4.x 기준
- `durationInFrames`는 항상 `Math.round(fps * seconds)`로 감쌀 것
- 외부 폰트는 `delayRender` / `continueRender` 패턴 필수
- 이모지 데이터(메뉴 카드 등)는 컴포넌트 props로 받고, 코드에 하드코딩 금지

## 스킬 작성 규칙

- 모든 스킬은 `skills/<name>.md`에 frontmatter 포함:
  ```yaml
  ---
  name: <스킬 이름>
  description: <한 줄 설명>
  install_to: .claude/skills/
  version: 0.1.0
  depends_on: []
  ---
  ```
- 스킬은 "원칙 → 파일 구조 → 템플릿 → 금지 사항" 순서로 작성
- 한 스킬 길이는 200줄 이내

## 커밋 규칙

- 메시지는 한국어 또는 영어, 시제는 현재형
- prefix는 `docs:`, `feat:`, `fix:`, `chore:` 중 하나
- PR 단위 작업은 `claude/<topic>-<random>` 브랜치
