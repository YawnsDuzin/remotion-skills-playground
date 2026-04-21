---
name: weather-menu
description: 날씨 조건에 따라 카페 메뉴를 추천하는 세로 쇼츠 스킬
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition]
---

# Weather Menu 스킬

## 목적

한 줄 프롬프트("오늘 서울 비, 따뜻한 메뉴 추천 영상")를 받아 10초 세로 쇼츠를 만든다.

## 스펙

- 해상도 1080×1920, 30fps, 300 frames (10초)
- 구성: 오프닝 2초 → 날씨 아이콘 3초 → 메뉴 3개 4초 → CTA 1초
- 폰트 Pretendard Variable (Bold/Medium 혼용)
- 기본 배경색 `#FAF6F0` (웜톤), 악센트 `#C9592E`

## Props 스키마

```ts
import { z } from "zod";

export const weatherMenuSchema = z.object({
  city: z.string().default("서울"),
  condition: z.enum(["sunny", "cloudy", "rainy", "snowy"]).default("rainy"),
  temperature: z.number().default(12),
  menus: z.array(z.object({
    name: z.string(),
    priceKrw: z.number(),
    emoji: z.string(),
  })).length(3),
  cta: z.string().default("따뜻한 카페 드립에서"),
});

export type WeatherMenuProps = z.infer<typeof weatherMenuSchema>;
```

## 조건별 기본 메뉴 세트

에이전트가 메뉴 목록을 생성할 때 아래를 기본값으로 쓴다.

| condition | 메뉴 | 톤 |
|---|---|---|
| `rainy` | 아메리카노, 카페라떼, 유자차 | 따뜻함 강조 |
| `sunny` | 아이스 아메리카노, 레모네이드, 청포도 에이드 | 청량감 강조 |
| `cloudy` | 바닐라 라떼, 카푸치노, 밀크티 | 차분함 강조 |
| `snowy` | 핫초코, 쑥 라떼, 대추차 | 진한 단맛 강조 |

## 애니메이션 규칙

- 메뉴 3개는 0.3초 간격으로 순차 등장 (`Sequence` + `from` 속성)
- 각 메뉴는 `spring({fps, frame, config: {damping: 12, stiffness: 100}})` 사용
- CTA는 마지막 1초, 배경이 악센트 색으로 채워지면서 텍스트 페이드인

## 렌더 명령

```bash
npx remotion render src/index.ts WeatherMenu out/weather-menu.mp4 \
  --props='{"city":"서울","condition":"rainy","temperature":9}'
```

## 에이전트 행동 지침

- 사용자가 도시명만 주면 `condition`과 `temperature`는 위 기본값 중에서 임의 선택
- 사용자가 메뉴 3개를 직접 지정한 경우, 조건별 기본 세트 대신 사용자 값 우선
- 가격(`priceKrw`)을 생략하면 3,500~6,500원 범위에서 랜덤 생성
- 최종 결과물 경로는 항상 `out/<composition-id>-<timestamp>.mp4` 규칙
