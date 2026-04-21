---
name: motion
description: spring/interpolate 기반 자주 쓰는 모션 프리셋 모음
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition]
---

# Motion 스킬

## 목적

`spring`/`interpolate`/`Easing`을 매번 재발명하지 않도록 검증된 모션 프리셋을 제공한다.
에이전트가 "부드럽게 등장", "통통 튀는 카드" 같은 자연어 요청을 받으면 이 프리셋을 호출한다.

## 프리셋 6개

| 이름 | 효과 | 사용처 |
|---|---|---|
| `enterFromBottom` | 아래에서 위로 페이드 + 슬라이드 | 메뉴 카드, 자막 |
| `enterFromLeft` | 왼쪽에서 페이드 + 슬라이드 | 사이드 라벨 |
| `bounceIn` | 통통 튀며 등장 | 강조 요소 |
| `pulse` | 1.0 ↔ 1.05 사이 호흡 | CTA 버튼 |
| `fadeOut` | 끝부분 페이드아웃 | 영상 마지막 |
| `staggered` | n개 항목 순차 등장 | 리스트 |

## 헬퍼 파일 템플릿

```ts
// src/motion/presets.ts
import { Easing, interpolate, spring } from "remotion";

type Frame = { frame: number; fps: number };

export const enterFromBottom = ({ frame, fps }: Frame, distance = 40) => {
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  return {
    opacity: progress,
    transform: `translateY(${(1 - progress) * distance}px)`,
  };
};

export const enterFromLeft = ({ frame, fps }: Frame, distance = 40) => {
  const progress = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });
  return {
    opacity: progress,
    transform: `translateX(${(1 - progress) * -distance}px)`,
  };
};

export const bounceIn = ({ frame, fps }: Frame) => {
  const scale = spring({ frame, fps, config: { damping: 8, stiffness: 80 } });
  return {
    transform: `scale(${scale})`,
    opacity: interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" }),
  };
};

export const pulse = ({ frame, fps }: Frame) => {
  const period = fps; // 1초 주기
  const phase = (frame % period) / period; // 0~1
  const scale = 1 + 0.05 * Math.sin(phase * Math.PI * 2);
  return { transform: `scale(${scale})` };
};

export const fadeOut = ({ frame }: { frame: number }, totalFrames: number, duration = 30) => ({
  opacity: interpolate(frame, [totalFrames - duration, totalFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing: Easing.in(Easing.ease),
  }),
});
```

## 사용 예

```tsx
import { useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom } from "./motion/presets";

const Card = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return <div style={enterFromBottom({ frame, fps })}>안녕</div>;
};
```

## staggered 등장 — 별도 컴포넌트로

```tsx
// src/motion/Stagger.tsx
import { Sequence } from "remotion";

export const Stagger = ({ items, delayFrames = 9, render }: {
  items: any[];
  delayFrames?: number;
  render: (item: any, i: number) => React.ReactNode;
}) => (
  <>
    {items.map((item, i) => (
      <Sequence key={i} from={i * delayFrames}>
        {render(item, i)}
      </Sequence>
    ))}
  </>
);
```

호출:

```tsx
<Stagger items={menus} render={(menu) => <MenuCard {...menu} />} />
```

## 금지 사항

- CSS `transition` 속성 사용 (Remotion은 정적 렌더라 무의미)
- `setInterval` / `setTimeout`로 시간 기반 변화 표현
- 매 프레임마다 `new Date()` 호출 (결정적이어야 함)
- 직접 `requestAnimationFrame` 사용
- `pulse` 같은 무한 반복 모션을 영상 끝까지 — 페이드아웃과 함께 쓰기

## 에이전트 행동 지침

- 사용자가 "부드럽게 등장" 요청 → `enterFromBottom`
- "통통 튀는" / "강조" 요청 → `bounceIn`
- "리스트", "여러 개 순차 등장" 요청 → `Stagger` 컴포넌트
- 직접 `spring` 인자를 만들지 말고, 프리셋이 부족하면 사용자에게 새 프리셋 추가 제안
- 모든 프리셋은 결정적(같은 frame에서 항상 같은 값) — 어기면 렌더 결과 불일치
