# ROADMAP

본 저장소가 "Remotion을 한국어로 처음부터 끝까지 학습할 수 있는 단일 소스"로 자라기 위한 작업 목록.
체크된 항목은 완료, 비어있는 항목은 진행 중 또는 예정.

## v0.1 — 기초 (완료)

- [x] 루트 README + 5개 핵심 문서 (00-개념, 01-환경, 02-튜토리얼, 03-패턴, 04-레퍼런스)
- [x] LICENSE / CONTRIBUTING / CI 워크플로우
- [x] `skills/remotion-composition.md`, `skills/weather-menu.md`
- [x] `examples/weather-menu/` 동작하는 첫 예제

## v0.2 — Remotion 전영역 커버 (완료)

- [x] `docs/05-core-api.md` — Composition / Sequence / AbsoluteFill / useCurrentFrame / interpolate / spring 정리
- [x] `docs/06-animation.md` — 이징 함수, 트랜지션, 스프링 깊이 있게
- [x] `docs/07-data-fetching.md` — `calculateMetadata`, `delayRender`, 외부 API 연동
- [x] `docs/08-audio-tts.md` — Audio 컴포넌트, 한국어 TTS(CLOVA·Typecast) 통합
- [x] `docs/09-rendering.md` — 로컬 / Lambda / Cloud Run, CLI 옵션 전수
- [x] `docs/10-deployment.md` — GitHub Actions cron, S3/Cloudinary 자동 업로드
- [x] `docs/11-skills-authoring.md` — 자기만의 Agent Skill 작성법
- [x] `docs/12-troubleshooting.md` — 종합 트러블슈팅 (에러 메시지 → 해결책 매핑)
- [x] `docs/13-performance.md` — 렌더 시간 단축, 메모리 절약, 캐싱
- [x] `docs/14-glossary.md` — 한영 용어집

## v0.3 — 스킬 라이브러리 (완료)

- [x] `skills/data-fetch.md`
- [x] `skills/tts-korean.md`
- [x] `skills/motion.md`
- [x] `skills/title-card.md`

## v0.4 — 예제 모음 (완료)

- [x] `examples/title-card/` — 가장 단순한 5초 영상
- [x] `examples/daily-report/` — KOSPI/환율 일일 리포트
- [x] `examples/blog-summary/` — 마크다운 → 영상 요약

## v1.0 — 안정화 (진행 중)

- [ ] 모든 예제에 데모 mp4 첨부 (`assets/demo/`)
- [ ] 한국어 TTS 실비용 측정 후 패턴 문서 갱신
- [ ] 외부 기여자 PR 1개 이상 머지
- [ ] 한국어 블로그/유튜브 자료 5개 이상 큐레이션
- [ ] 모든 예제에 단어 단위 자막 동기화 옵션 추가
- [ ] `examples/training-video/` (사내 교육용 패턴)
- [ ] CI에 실제 렌더 smoke test 추가 (현재는 typecheck만)

## v1.1+ — 미래

- [ ] Cloud Run 워크플로우 예제
- [ ] `@remotion/player` 임베드 가이드
- [ ] Storybook 통합 예제
- [ ] 한국어 자막 자동 줄바꿈 헬퍼 라이브러리

## 항상 진행 중

- 공식 `remotion-dev/skills` drift 월 1회 체크
- 각 문서 상단 "기준일" 갱신
- 깨진 링크 자동 검사 (`.github/workflows/ci.yml`)
- 새 Remotion 메이저 릴리스(예: 5.x) 호환성 검증
