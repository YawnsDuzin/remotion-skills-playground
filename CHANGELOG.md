# 변경 이력

본 저장소의 주요 변경점. [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 형식을 느슨하게 따른다.

## [Unreleased]

- 예제 4개에 실제 데모 mp4 첨부 (ROADMAP v1.0)
- Cloud Run 워크플로우 예제 (ROADMAP v1.1)

## [0.5.0] — 2026-04-21

### 추가

- 심화 문서 6개: `docs/15-player.md` ~ `docs/20-security.md`
- 디렉토리 인덱스: `docs/README.md`, `skills/README.md`, `examples/README.md`
- 리포 위생: `.nvmrc`, `CHANGELOG.md`, `SECURITY.md`, `.github/dependabot.yml`
- CI 강화: 번역체 검사, 스킬 frontmatter 검증, smoke render (1프레임 PNG)
- `scripts/fetch-pretendard.sh` — 예제 4개 일괄 폰트 다운로드
- `scripts/check-translation-style.sh`, `scripts/check-skill-frontmatter.mjs`

### 크로스링크

- `docs/00-concepts.md` 끝 → `05-core-api`, `01-setup`, `14-glossary` 링크
- `docs/03-patterns.md` 매트릭스: 가상 스킬(`tts*`, `data-fetch*`) → 실제 파일명 반영
- `docs/04-references.md`: 내부 문서 21개 전체 바로가기 추가
- `README.md`: 학습 경로 4개 트랙으로 확장, 심화 문서 6개 반영

### 수정

- README 뱃지 `examples-3` → `examples-4`
- `blog-summary/Root.tsx`: `fps()` 함수와 prop 이름 충돌 해소
- `blog-summary/tts.ts`: 깨진 base64 mock MP3 → ffmpeg 기반 `_silent.mp3` 안내
- 예제 4개 `package.json`: 정확 버전 → 캐럿(`^`) 범위로
- 루트 `.gitignore` 추가

### 통일

- 예제 4개 모두 `src/fonts.ts` + `public/fonts/.gitkeep` 구조로 통일

## [0.4.0] — 2026-04-21

- 예제 3개 추가: `title-card`, `daily-report`, `blog-summary`
- 이전의 `weather-menu`와 함께 총 4개 동작 예제

## [0.3.0] — 2026-04-21

- 스킬 4개 추가: `motion`, `title-card`, `data-fetch`, `tts-korean`
- 기존 `remotion-composition`, `weather-menu`와 함께 총 6개 스킬

## [0.2.0] — 2026-04-21

- 문서 10개 추가: `docs/05-core-api.md` ~ `docs/14-glossary.md`
- Remotion 전영역(API, 애니메이션, 데이터, 오디오, 렌더, 배포, 스킬 작성, 트러블슈팅, 성능, 용어집) 커버

## [0.1.0] — 2026-04-21

- 초기 문서 5개: `docs/00-concepts.md` ~ `docs/04-references.md`
- 첫 예제 `examples/weather-menu/`
- 첫 스킬 `skills/remotion-composition.md`, `skills/weather-menu.md`
- 리포지토리 구조: `LICENSE`, `CONTRIBUTING.md`, `CLAUDE.md`, `ROADMAP.md`, CI 워크플로우, 이슈/PR 템플릿
