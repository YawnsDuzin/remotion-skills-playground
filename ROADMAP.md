# ROADMAP

본 저장소가 "Remotion을 한국어로 처음부터 끝까지 학습할 수 있는 단일 소스"로 자라기 위한 작업 목록.
체크된 항목은 완료, 비어있는 항목은 진행 중 또는 예정. 변경 이력은 [`CHANGELOG.md`](./CHANGELOG.md).

## v0.1 — 기초 (완료)

- [x] 루트 README + 5개 핵심 문서 (00~04)
- [x] LICENSE / CONTRIBUTING / CI 워크플로우
- [x] `skills/remotion-composition.md`, `skills/weather-menu.md`
- [x] `examples/weather-menu/` 동작하는 첫 예제

## v0.2 — Remotion 전영역 커버 (완료)

- [x] 문서 10개 추가 (`docs/05`~`docs/14`)
- [x] Core API · 애니메이션 · 데이터 · 오디오 · 렌더 · 배포 · 스킬 작성 · 트러블슈팅 · 성능 · 용어집

## v0.3 — 스킬 라이브러리 (완료)

- [x] `skills/motion.md`, `skills/title-card.md`, `skills/data-fetch.md`, `skills/tts-korean.md`

## v0.4 — 예제 모음 (완료)

- [x] `examples/title-card/`, `examples/daily-report/`, `examples/blog-summary/`

## v0.5 — 심화 문서 + 위생 (완료)

- [x] 문서 6개 추가 (`docs/15`~`docs/20`): Player · Images/Video · Subtitles · Fonts · Testing · Security
- [x] 디렉토리 인덱스 3개 (`docs/README.md`, `skills/README.md`, `examples/README.md`)
- [x] 리포 위생: `.nvmrc`, `CHANGELOG.md`, `SECURITY.md`, `.github/dependabot.yml`
- [x] CI 강화: 번역체 검사, 스킬 frontmatter 검증, smoke render (1프레임 PNG)
- [x] 치명적 버그 수정: README 뱃지, `blog-summary` Root/TTS, 캐럿 버전, 폰트 통일
- [x] `scripts/fetch-pretendard.sh` 일괄 폰트 다운로드

## v0.6 — B-roll 하이브리드 (완료)

- [x] `examples/finance-broll/` — Remotion 데이터 + Veo/Pexels B-roll 합성 30초 리포트
- [x] `skills/broll-composition.md` — 데이터 + B-roll 레이어 규칙
- [x] `<OffthreadVideo>` 실전 사용 예제 (이전엔 docs만 있었음)

## v0.7 — 바이브코딩 튜토리얼 (완료)

- [x] `examples/code-tutorial/` — 60초 "VIBE CODING · 1분" 세로 쇼츠
- [x] `skills/code-tutorial.md` — 코드 블록 타이핑 애니메이션 규칙
- [x] 사전 토큰화 + VSCode Dark+ 팔레트 + 2Hz 커서 블링크 패턴 확립

## v1.0 — 안정화 (진행 중)

- [ ] 모든 예제(6개)에 데모 mp4 첨부 (`assets/demo/`)
- [ ] `finance-broll`에 실제 Veo/Pexels B-roll 3개 첨부 + 데모 mp4
- [ ] `code-tutorial`에 실제 Shiki 기반 동적 토큰화 데모 추가
- [ ] 한국어 TTS 실비용 측정 후 `docs/03-patterns.md` 갱신
- [ ] 외부 기여자 PR 1개 이상 머지
- [ ] 한국어 블로그/유튜브 자료 5개 이상 큐레이션 ([`docs/04-references.md`](./docs/04-references.md))
- [ ] `examples/training-video/` — 사내 교육용 패턴
- [ ] 각 예제에 단어 단위 자막 옵션 ([`docs/17-subtitles.md`](./docs/17-subtitles.md) 기반)
- [ ] `scripts/visual-regression/` — pixelmatch 기반 회귀 테스트 ([`docs/19-testing.md`](./docs/19-testing.md))

## v1.1+ — 미래

- [ ] Cloud Run 워크플로우 예제 (Lambda와 병렬)
- [ ] Storybook 통합 예제 (Player 컴포넌트)
- [ ] 한국어 자막 자동 줄바꿈 헬퍼 라이브러리 (BudouX 래퍼)
- [ ] `skills/shorts-factory.md` — 일괄 양산 패턴 스킬
- [ ] `skills/subtitle-sync.md` — 워드 단위 동기화 스킬

## 항상 진행 중

- 공식 `remotion-dev/skills` drift 월 1회 체크
- 각 문서 상단 "기준일" 분기 갱신
- 깨진 링크 / 번역체 / frontmatter 자동 검사 ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml))
- 새 Remotion 메이저 릴리스(예: 5.x) 호환성 검증
- Dependabot PR 월별 리뷰 ([`.github/dependabot.yml`](./.github/dependabot.yml))
