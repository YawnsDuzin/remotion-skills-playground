# 예제 인덱스

6개 모두 `npm install && npm start`로 즉시 실행된다. 난이도 순으로 정렬.

## 실행 전 공통 준비

한글 폰트는 별도 다운로드 필요:

```bash
# 레포 루트에서 — 6개 예제 모두에 Pretendard 설치
bash scripts/fetch-pretendard.sh
```

또는 예제별로 `public/fonts/PretendardVariable.woff2`를 수동 배치.
폰트 없어도 동작은 하지만 한글이 시스템 폰트로 fallback.

## 예제 목록

### 1. [`title-card`](./title-card) — 난이도 하 (10분)

5초짜리 타이틀 카드 영상, 가로·세로 비율 두 컴포지션.
**학습 포인트**: `Composition` 기본, `useCurrentFrame`, `spring`, zod 스키마.

```bash
cd examples/title-card && npm install && npm start
```

### 2. [`weather-menu`](./weather-menu) — 난이도 중 (20분)

날씨 조건에 따라 카페 메뉴를 추천하는 10초 세로 쇼츠.
**학습 포인트**: `Series`, `Sequence`, staggered 등장, props 검증.

```bash
cd examples/weather-menu && npm install && npm start
```

### 3. [`daily-report`](./daily-report) — 난이도 중상 (40분)

매일 KOSPI / USD / 날씨를 묶는 60초 세로 리포트. 외부 API + 캐싱.
**학습 포인트**: `calculateMetadata`, sha256 TTL 캐시, SVG 차트, mock 폴백.

```bash
cd examples/daily-report && npm install && npm run build:mock
```

### 4. [`blog-summary`](./blog-summary) — 난이도 상 (60분+)

마크다운 블로그 포스트 → TTS 내레이션 영상.
**학습 포인트**: TTS 통합, `getAudioDurationInSeconds`, 문장 단위 자막 동기화.

```bash
cd examples/blog-summary && npm install
USE_MOCK_TTS=true npm start  # 키 없이 미리보기 (_silent.mp3 필요)
```

### 5. [`finance-broll`](./finance-broll) — 난이도 상 (60분+)

KOSPI/환율 데이터 카드 사이에 AI 생성(Veo) 또는 스톡(Pexels) **B-roll**을 끼워 넣는 30초 세로 영상. 데이터 정확성과 영상 완성도를 모두 잡는 하이브리드 패턴.
**학습 포인트**: `<OffthreadVideo>`, B-roll 위 데이터 오버레이, 매니페스트 + dim, mock 폴백.

```bash
cd examples/finance-broll && npm install
npm run build:mock     # B-roll 자산 없이 그라데이션 폴백으로 렌더
```

B-roll 자산 가이드는 [`examples/finance-broll/public/broll/MANIFEST.md`](./finance-broll/public/broll/MANIFEST.md), 합성 규칙은 스킬 [`broll-composition`](../skills/broll-composition.md).

### 6. [`code-tutorial`](./code-tutorial) — 난이도 상 (60분+)

60초 세로 쇼츠 "VIBE CODING · 1분 설명". 개발 튜토리얼에서 가장 보기 좋은 **코드 블록 라인별 타이핑** + 구문 강조 + 커서 블링크를 그대로 구현.
**학습 포인트**: 토큰 단위 타이핑 (`useCurrentFrame` × 타이핑 속도), VSCode Dark+ 팔레트, 2Hz 커서 블링크, 현재 라인 하이라이트, 중첩 미리보기.

```bash
cd examples/code-tutorial && npm install && npm start
```

합성 규칙은 스킬 [`code-tutorial`](../skills/code-tutorial.md).

## 직접 만들 때 참고

- 스킬은 [`../skills/`](../skills/)에서 복사해 `.claude/skills/`로
- Remotion API 레퍼런스는 [`docs/05-core-api.md`](../docs/05-core-api.md)
- 에러가 나면 [`docs/12-troubleshooting.md`](../docs/12-troubleshooting.md)
- 운영 파이프라인은 [`docs/10-deployment.md`](../docs/10-deployment.md)

## 공통 구조

모든 예제가 같은 파일 배치를 따른다:

```
examples/<name>/
  src/
    index.ts          # registerRoot 진입점
    Root.tsx          # Composition 등록
    schema.ts         # zod 스키마
    motion.ts         # 애니메이션 프리셋
    fonts.ts          # Pretendard 로더
    <Component>.tsx   # 주 컴포넌트
    scenes/           # (복잡한 경우) 장면별 컴포넌트
    fetch/            # (외부 API 쓰는 경우) 데이터 계층
  public/
    fonts/.gitkeep
  package.json
  tsconfig.json
  remotion.config.ts
  .env.example        # (해당 시)
  README.md
```

새 예제 PR은 이 구조를 따라야 병합 가능.
