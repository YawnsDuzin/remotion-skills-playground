# 스킬 인덱스

본 디렉토리의 스킬은 Claude Code 같은 코딩 에이전트의 컨텍스트로 자동 로드된다. 작성 원칙은 [`docs/11-skills-authoring.md`](../docs/11-skills-authoring.md).

## 설치

프로젝트 루트에서:

```bash
mkdir -p .claude/skills
cp skills/*.md .claude/skills/
```

의존 스킬 한두 개만 고르고 싶으면 필요한 파일만 복사. `depends_on` 배열을 따라 연쇄 설치.

## 스킬 목록

| 스킬 | 설명 | depends_on |
|---|---|---|
| [`remotion-composition.md`](./remotion-composition.md) | Composition 작성 공통 규칙 | — |
| [`motion.md`](./motion.md) | spring/interpolate 프리셋 6개 | remotion-composition |
| [`title-card.md`](./title-card.md) | 5초 타이틀 카드 (가로/세로) | remotion-composition, motion |
| [`weather-menu.md`](./weather-menu.md) | 날씨별 카페 메뉴 세로 쇼츠 | remotion-composition |
| [`data-fetch.md`](./data-fetch.md) | 외부 API + sha256 캐싱 | remotion-composition |
| [`tts-korean.md`](./tts-korean.md) | CLOVA Voice 통합 | remotion-composition, data-fetch |
| [`broll-composition.md`](./broll-composition.md) | Veo/Pexels B-roll + 데이터 오버레이 | remotion-composition |

## 의존 그래프

```
remotion-composition  (루트)
├── motion
│   └── title-card
├── weather-menu
├── broll-composition
└── data-fetch
    └── tts-korean
```

## 자기만의 스킬 만들기

순서:

1. [`docs/11-skills-authoring.md`](../docs/11-skills-authoring.md) 읽기 (11분)
2. 본 디렉토리 스킬 1~2개를 템플릿으로 복사
3. frontmatter `name`·`version`·`depends_on` 채우기
4. 새 세션에서 검증 (스킬만 주입하고 테스트 프롬프트 던지기)
5. PR로 제보 (라벨 `help wanted: skill`)

## 검증 체크리스트

스킬 PR 리뷰 시 확인하는 항목:

- [ ] frontmatter 4개 필드 (`name`, `description`, `install_to`, `version`) 존재
- [ ] 본문 4개 섹션 (목적/스펙/스키마/지침) 존재
- [ ] 200줄 이내
- [ ] 금지 사항 5개 이하
- [ ] 코드 예시가 컴파일됨
- [ ] `depends_on`이 실제 존재하는 스킬
