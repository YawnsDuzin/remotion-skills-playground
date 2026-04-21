# examples/daily-report

매일 아침 KOSPI 종가 / USD 환율 / 서울 날씨를 묶은 60초 세로 리포트 영상.
`calculateMetadata` + 디스크 캐싱 + 차트 컴포넌트 + GitHub Actions cron 패턴을 한 번에 보여준다.

## 실행

```bash
npm install
cp .env.example .env   # 키 입력
npm start              # Studio
npm run build:mock     # 키 없이 mock 데이터로 렌더
npm run build          # 실제 API로 렌더
```

## 구조

```
src/
  index.ts
  Root.tsx              # Composition + calculateMetadata
  DailyReport.tsx       # 메인 컴포넌트
  scenes/
    Opening.tsx
    KospiChart.tsx
    ExchangeCard.tsx
    WeatherStrip.tsx
    Cta.tsx
  fetch/
    cache.ts            # sha256 + ttl 캐시
    kospi.ts
    exchange.ts
    weather.ts
  schema.ts
  motion.ts
```

## 데이터 소스

- **KOSPI**: 네이버 금융 차트 API (비공식). 운영용으로는 한국거래소(KRX) 정식 API 권장
- **환율 (USD/KRW)**: 한국은행 ECOS — `BOK_API_KEY` 필요 (무료)
- **날씨**: 기상청 단기예보 — `KMA_API_KEY` 필요 (공공데이터 포털, 무료)

키가 없거나 `USE_MOCK=true`인 경우 `src/fetch/mock.ts`의 고정 데이터를 사용해 컴포지션 자체는 항상 빌드된다.

## GitHub Actions 자동화

[`.github/workflows/daily-report.yml`](../../.github/workflows/) 참고 (예시는 [`docs/10-deployment.md`](../../docs/10-deployment.md)).

## 학습 포인트

- `calculateMetadata`로 외부 API 호출
- sha256 + TTL 디스크 캐싱
- mock 데이터 폴백
- 차트를 React + SVG로 직접 그리기 (라이브러리 없이)
- `Series`로 5개 씬 순차 배치
