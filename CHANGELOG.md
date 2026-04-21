# 변경 이력

본 저장소의 주요 변경점. [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 형식을 느슨하게 따른다.

## [Unreleased]

- 예제 6개에 실제 데모 mp4 첨부 (ROADMAP v1.0)
- Cloud Run 워크플로우 예제 (ROADMAP v1.1)

## [0.7.0] — 2026-04-21

### 추가

- 새 예제 `examples/code-tutorial/` — 60초 "VIBE CODING · 1분 설명" 세로 쇼츠
  - 코드 블록 라인별 타이핑 애니메이션 (핵심 35초)
  - 사전 토큰화 (Shiki 없이 의존성 최소) + VSCode Dark+ 팔레트
  - 2Hz 커서 블링크, 현재 타이핑 라인 배경 하이라이트
  - 5개 씬: Intro → Prompt 타이핑 → CodeBlock → ResultPreview → CTA
- 새 스킬 `skills/code-tutorial.md` — 바이브코딩/개발 튜토리얼 쇼츠 컴포지션 규칙
- README/examples README/skills README — 카운트 8스킬·6예제로 갱신

## [0.6.0] — 2026-04-21

### 추가

- 새 예제 `examples/finance-broll/` — Remotion 데이터 + Veo/Pexels B-roll 하이브리드
  - 30초 세로 KOSPI/환율 리포트 + 3개 B-roll 클립
  - `<OffthreadVideo>` 임베드, `BrollClip` 컴포넌트(파일 누락 시 그라데이션 폴백)
  - `BROLL_CLIPS` 매니페스트로 클립 메타데이터 + dim 강도 + 출처
  - `public/broll/MANIFEST.md` — Veo 프롬프트 예시 + Pexels 링크 + ffmpeg 크롭 안내
- 새 스킬 `skills/broll-composition.md` — 데이터 + B-roll 합성 규칙
- README/docs/16-images-video/examples README/skills README — 카운트 7스킬·5예제로 갱신

## [0.5.1] — 2026-04-21

### 개선

- README 전면 개편 — 첫 방문자 경험 강화
  - 용어 미니 가이드 (Remotion · Claude Code · Agent Skills 3개 각 1줄)
  - 저장소 성격 명시 (개인 큐레이션) + Claude Code 없이도 되는지 답
  - 데모 자리 ASCII 플레이스홀더 (v1.0 전까지 공백 대체)
  - 빠른 시작에 필요 환경 (Node 22 / Remotion 라이선스) 한 줄
  - 저장소 지도 (디렉토리 tree)
  - 스킬 설치 한 줄 (`mkdir -p .claude/skills && cp ...`)
  - FAQ 섹션 7개 (접을 수 있는 `<details>`)
  - 안정성 뱃지 `status-active%20curation-yellow` 추가

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
