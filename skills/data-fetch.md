---
name: data-fetch
description: 외부 API/공공데이터 포털을 calculateMetadata에서 호출하는 패턴
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition]
---

# Data Fetch 스킬

## 목적

외부 데이터(기상청, 한국은행 환율, RSS 등)를 컴포지션 props로 주입한다.
런타임 fetch는 피하고 `calculateMetadata`로 빌드 시점에 1회 호출한다.

## 원칙

1. 모든 외부 호출은 `calculateMetadata` 안에서. 컴포넌트 본문에서 `fetch` 금지
2. API 키는 `process.env.<KEY>`로. 코드에 하드코딩 금지
3. 결과는 `.cache/<sha256>.json`에 캐싱 — 같은 props로 다시 부르면 디스크 hit
4. 실패 시 throw 대신 폴백 데이터 반환 (에이전트가 컴포지션 자체는 만들 수 있도록)

## 파일 구조

```
src/
  index.ts
  Root.tsx
  fetch/
    weather.ts        # KMA API 호출
    exchange.ts       # 한국은행 API
    cache.ts          # 공통 캐시 헬퍼
  compositions/
    DailyReport.tsx
```

## 캐시 헬퍼 템플릿

```ts
// src/fetch/cache.ts
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const CACHE_DIR = ".cache";

export async function cached<T>(key: object, fn: () => Promise<T>, ttlMs = 3_600_000): Promise<T> {
  const hash = crypto.createHash("sha256").update(JSON.stringify(key)).digest("hex");
  const file = path.join(CACHE_DIR, `${hash}.json`);
  try {
    const stat = await fs.stat(file);
    if (Date.now() - stat.mtimeMs < ttlMs) {
      return JSON.parse(await fs.readFile(file, "utf-8"));
    }
  } catch { /* miss */ }
  const fresh = await fn();
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(fresh));
  return fresh;
}
```

TTL 기본 1시간. 일일 리포트는 12시간, 환율은 5분 같이 데이터 성격에 맞게.

## 호출 템플릿

```ts
// src/fetch/weather.ts
import { cached } from "./cache";

export async function fetchWeather(city: string) {
  const key = process.env.KMA_API_KEY;
  if (!key) throw new Error("KMA_API_KEY missing");

  return cached({ kind: "weather", city, day: new Date().toISOString().slice(0, 10) }, async () => {
    const url = `https://apis.data.go.kr/...&serviceKey=${encodeURIComponent(key)}&city=${city}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`KMA ${res.status}`);
    return res.json();
  });
}
```

## calculateMetadata 통합

```ts
const calc: CalculateMetadataFunction<Props> = async ({ props }) => {
  let weather;
  try {
    weather = await fetchWeather(props.city);
  } catch (e) {
    console.warn("Weather fetch failed, using fallback:", e);
    weather = { temp: 20, condition: "unknown" }; // 폴백
  }
  return {
    props: { ...props, weather },
    durationInFrames: weather.alerts?.length > 0 ? 600 : 300,
  };
};
```

## 금지 사항

- 컴포넌트 함수 본문에서 `fetch` 호출
- API 키를 코드에 하드코딩
- `try/catch` 없이 외부 호출
- TTL 없는 무한 캐시 (날짜 데이터가 stale될 수 있음)
- `.cache/` 디렉토리를 git에 커밋 (`.gitignore`에 추가)

## 환경 변수 명세

스킬 사용자가 `.env`에 둬야 할 키:

```
KMA_API_KEY=xxx              # 공공데이터 포털 → 단기예보
BOK_API_KEY=xxx              # 한국은행 ECOS
```

## 에이전트 행동 지침

- 사용자가 "오늘 날씨로 영상 만들어줘"라고 하면 자동으로 `fetchWeather`를 calculateMetadata에 통합
- API 키 없이 실행하면 폴백 데이터로 컴포지션은 완성하되 사용자에게 키 설정 안내
- 캐시 파일은 `.cache/`에만, 다른 위치에 두지 말 것
