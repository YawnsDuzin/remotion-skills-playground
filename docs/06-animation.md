# 애니메이션 깊이 있게

> 읽는 데 약 14분 · 기준일 2026-04-15 · `interpolate` / `spring` / `Easing` 모두 다룬다

`interpolate`만 쓰면 모든 애니메이션이 "선풍기처럼" 느껴진다. `spring`만 쓰면 모든 게 "통통 튀는 슬라임" 같다.
이 문서는 두 도구를 어떻게 섞고, 언제 어느 이징을 고르고, 트랜지션은 어떻게 직접 만드는지를 정리한다.

## 이징 — 어떤 곡선을 고를 것인가

`Easing` 모듈이 제공하는 함수는 30개 가까이 되지만 실전에서 90%는 4개로 끝난다.

| 함수 | 느낌 | 어디에 |
|---|---|---|
| `Easing.linear` | 일정 속도 | 카운트다운, 진행 바 |
| `Easing.out(Easing.ease)` | 빨리 시작해 부드럽게 멈춤 | 등장 애니메이션의 95% |
| `Easing.inOut(Easing.cubic)` | S자 곡선 | 카메라 팬, 화면 전환 |
| `Easing.bezier(.4,0,.2,1)` | Material standard | 절대 안 어색하고 싶을 때 |

```tsx
import { Easing, interpolate, useCurrentFrame } from "remotion";

const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 30], [0, 1], {
  easing: Easing.out(Easing.ease),
  extrapolateRight: "clamp",
});
```

**팁**: 시작이 느리고 끝에서 느려지는 게 자연스러운 이유는 — 사람 눈이 그렇게 진화했기 때문이다. 등장은 `out`, 퇴장은 `in`, 둘 다는 `inOut`. 외울 만하다.

## 두 단계 등장 — 페이드 + 슬라이드

UI 라이브러리에서 흔한 "위에서 살짝 내려오면서 페이드인". `interpolate` 두 번이 답.

```tsx
const frame = useCurrentFrame();
const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
const y = interpolate(frame, [0, 20], [-40, 0], {
  extrapolateRight: "clamp",
  easing: Easing.out(Easing.cubic),
});

return (
  <div style={{ opacity, transform: `translateY(${y}px)` }}>
    안녕
  </div>
);
```

이것을 `spring` 하나로 바꾸면:

```tsx
const { fps } = useVideoConfig();
const progress = spring({ frame, fps, config: { damping: 15, stiffness: 120 } });

return (
  <div style={{
    opacity: progress,
    transform: `translateY(${(1 - progress) * -40}px)`,
  }} />
);
```

코드 줄이 줄지만, 출렁임을 원치 않으면 `damping`을 200 이상으로 올려야 한다 — 이쯤 되면 그냥 `interpolate` 쓰는 게 낫다.

## 스프링 튜닝 치트시트

`spring` 출력은 항상 0에서 시작해 1로 수렴한다. 단, 튜닝에 따라 1을 넘었다가 돌아오기도 한다(오버슈트).

| 효과 | damping | stiffness | mass |
|---|---|---|---|
| 부드럽게 등장 (오버슈트 X) | 200 | 100 | 1 |
| 살짝 통통 | 12 | 100 | 1 |
| 트램펄린 | 6 | 80 | 0.5 |
| 무거운 등장 | 20 | 50 | 3 |

기본값은 `{ damping: 10, stiffness: 100, mass: 1 }`. 한 번에 하나씩만 바꾸면서 감 잡기.

## 트랜지션 — 두 씬 사이 갈아끼우기

크로스페이드, 슬라이드, 와이프 같은 화면 전환은 `@remotion/transitions` 패키지에 미리 만들어져 있다.

```tsx
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

<TransitionSeries>
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneA />
  </TransitionSeries.Sequence>
  <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 15 })} />
  <TransitionSeries.Sequence durationInFrames={60}>
    <SceneB />
  </TransitionSeries.Sequence>
</TransitionSeries>
```

내장 트랜지션: `fade`, `slide`, `wipe`, `flip`, `iris`, `clockWipe`. 직접 만들고 싶으면 `presentation` 자리에 컴포넌트를 끼우면 된다 — 자세한 건 공식 문서 참조.

**함정**: `TransitionSeries`는 `Series`와 별개 컴포넌트다. 기존 `Series` 구조에서 트랜지션을 추가하려면 통째로 갈아끼워야 한다.

## staggered 애니메이션 — n개의 카드 순차 등장

`weather-menu`에서도 쓴 패턴. 인덱스마다 시작 프레임을 어긋나게 한다.

```tsx
{items.map((item, i) => (
  <Sequence key={item.id} from={i * 9}>
    <Card item={item} />
  </Sequence>
))}
```

부모가 마운트되어 있는 동안 자식의 `useCurrentFrame()`은 0부터 시작하므로 카드 컴포넌트는 인덱스를 몰라도 같은 코드로 등장한다.

지연 간격(`* 9`)은 fps와 무관하게 프레임 단위다. 30fps 기준 9프레임은 0.3초. 다른 fps에서도 같은 시각 효과를 원하면 `Math.round(fps * 0.3)`로.

## frame 기반 vs spring 기반 — 언제 뭘 쓰나

| 상황 | 선택 |
|---|---|
| 정확히 N프레임에 끝나야 함 | `interpolate` + `clamp` |
| "자연스럽게" 느껴야 함 | `spring` |
| 두 단계 이상 변화 (0→1→0) | `interpolate` 다단계 |
| 감속 곡선 | `Easing.out(Easing.ease)` + `interpolate` |
| 통통 튀는 등장 | `spring` 낮은 damping |
| 카운트다운, 차트 채우기 | `interpolate` + `linear` |

**한 줄 원칙**: 정확한 시간이 중요하면 `interpolate`, 자연스러운 움직임이 중요하면 `spring`.

## 디버깅 — 안 움직일 때 체크리스트

1. `useCurrentFrame()`을 컴포넌트 함수 본문에서 호출했는가
2. `Sequence` 안에 있다면 시작 시점부터 0이 맞는가 (절대 프레임 아님)
3. `extrapolate*` 옵션을 빠뜨려서 범위 밖에서 음수가 나오는 건 아닌가
4. CSS에서 `transition` 속성을 추가하지 않았는가 — Remotion은 매 프레임을 정적으로 렌더하므로 CSS transition은 의미 없고 가끔 깨진다
5. `transform`이 `position: absolute`와 충돌하지 않는가

다음 — 외부 데이터로 애니메이션 값을 바꾸려면 [`docs/07-data-fetching.md`](./07-data-fetching.md)로.
