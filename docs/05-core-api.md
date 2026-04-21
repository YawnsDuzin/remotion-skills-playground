# Core API — 외워둘 7개

> 읽는 데 약 12분 · 기준일 2026-04-15 · Remotion 4.x 기준

Remotion API는 100여 개지만, 95%의 영상은 7개로 다 만든다.
이 문서는 그 7개(`Composition`, `Sequence`, `AbsoluteFill`, `Series`, `useCurrentFrame`, `useVideoConfig`, `interpolate`)와 `spring` 1개 보너스를 합쳐 8개를 정리한다.
각 API는 "언제 쓰는가 → 시그니처 → 미니 예제 → 함정" 순서.

## Composition — 영상 한 편의 정의

**언제**: 영상마다 1개씩. `registerRoot()`에 넘기는 `Root.tsx`가 모든 `Composition`을 모아둔다.

```tsx
<Composition
  id="WeatherMenu"           // CLI에서 이 이름으로 렌더 호출
  component={WeatherMenu}    // 실제 React 컴포넌트
  durationInFrames={300}     // 프레임 수 (반드시 정수)
  fps={30}                   // 초당 프레임
  width={1080}
  height={1920}
  defaultProps={{ city: "서울" }}
  schema={weatherMenuSchema} // zod 스키마. Studio에 폼 자동 생성
/>
```

**함정**: `durationInFrames`은 정수만 받는다. `30 * 9.99 = 299.7` 같이 소수점이 나오면 CLI가 죽는다. `Math.round(fps * seconds)`로 감싸는 습관.
**관련**: 같은 컴포넌트를 다른 props로 여러 번 등록하고 싶으면 `Composition`을 여러 개 두면 된다 — 영상별로 ID가 달라야 한다.

## Sequence — 시간축의 슬라이스

**언제**: "이 컴포넌트를 1초부터 3초까지만 보여라" 같이 일부 시간 동안만 자식을 마운트할 때.

```tsx
<Sequence from={30} durationInFrames={60}>
  {/* frame 30~89 동안만 렌더되고, 자식의 useCurrentFrame()은 0부터 시작 */}
  <Title text="안녕" />
</Sequence>
```

`from`과 `durationInFrames`만 기억하면 끝이다. 자식 컴포넌트의 `useCurrentFrame()`은 상대 프레임을 반환하므로 애니메이션 코드를 재사용하기 좋다.

**함정**: `Sequence`는 `display: none`이 아니라 "마운트/언마운트"다. 무거운 컴포넌트는 `Sequence` 진입 직전에 갑자기 비싸진다 — 폰트·이미지 로드는 `delayRender`로 미리.

## Series — 순차 배치 헬퍼

**언제**: `Sequence`를 일렬로 줄세울 때. `from`을 직접 계산하기 귀찮을 때 쓴다.

```tsx
<Series>
  <Series.Sequence durationInFrames={60}>
    <Intro />
  </Series.Sequence>
  <Series.Sequence durationInFrames={120} offset={-15}>
    {/* 앞 시퀀스와 15프레임 겹쳐서 시작 (크로스페이드용) */}
    <Body />
  </Series.Sequence>
</Series>
```

**함정**: 전체 길이를 부모 `Composition`의 `durationInFrames`에 수동으로 합산해 맞춰야 한다. 어긋나면 잘리거나 끝에 검은 화면이 남는다.

## AbsoluteFill — 무지성 풀스크린 div

**언제**: 거의 모든 레이어. `position: absolute; top:0; left:0; right:0; bottom:0; display:flex` + 자식 중앙 정렬 옵션을 미리 갖춘 컨테이너.

```tsx
<AbsoluteFill style={{ backgroundColor: "#000", justifyContent: "center", alignItems: "center" }}>
  <h1 style={{ color: "white", fontSize: 96 }}>제목</h1>
</AbsoluteFill>
```

**함정**: `style`로 `position`을 덮어쓰면 `Sequence` 합성이 깨진다. 위치 조정은 `transform`으로.

## useCurrentFrame — 시간을 숫자로 받아오기

**언제**: 모든 시간 기반 변화. 0부터 시작해 매 프레임 1씩 증가.

```tsx
const frame = useCurrentFrame();
return <div style={{ opacity: frame / 30 }}>{frame}</div>;
```

`Sequence` 안에서 호출하면 그 시퀀스의 시작 프레임을 0으로 본다 — 부모 컴포지션의 절대 프레임이 아님.

**함정**: 컴포넌트 본문 밖(예: 모듈 최상단)에서 호출하면 React 훅 규칙 위반이다. 항상 컴포넌트 함수 내부에서.

## useVideoConfig — fps·width·height 가져오기

**언제**: 컴포넌트가 어떤 컴포지션 안에 들어갈지 모를 때. 보통 `spring` 호출에 `fps`를 넣을 때 쓴다.

```tsx
const { fps, width, height, durationInFrames } = useVideoConfig();
const progress = spring({ frame, fps, config: { damping: 15 } });
```

**함정**: `Composition`의 `defaultProps`로 받은 값과는 별개다. `useVideoConfig`는 항상 컴포지션 메타데이터, props는 데이터.

## interpolate — 두 숫자 사이를 매핑

**언제**: 가장 자주 쓰는 함수. "frame 0~30 동안 opacity 0→1" 같은 선형 변환.

```tsx
const opacity = interpolate(frame, [0, 30], [0, 1], {
  extrapolateLeft: "clamp",   // frame < 0이면 0으로 고정
  extrapolateRight: "clamp",  // frame > 30이면 1로 고정
  easing: Easing.out(Easing.ease), // 이징 함수
});
```

`inputRange`와 `outputRange` 길이가 같아야 한다. 다단계 변환도 가능 — `[0, 30, 60]` → `[0, 1, 0]`은 페이드인-아웃.

**함정**: `extrapolate*` 옵션을 안 주면 기본값은 `extend` — 범위 밖에서 음수나 1을 넘는 값이 튀어나온다. 90%의 버그가 여기서.

## spring — 자연스러운 진동

**언제**: 카드 등장, 버튼 누르기, 바운스 효과. `interpolate`보다 부드럽고 "물리적으로" 느껴진다.

```tsx
const { fps } = useVideoConfig();
const progress = spring({
  frame,
  fps,
  config: { damping: 12, stiffness: 100, mass: 1 },
  durationInFrames: 30, // 옵션. 안 주면 자연스럽게 수렴할 때까지
});
return <div style={{ transform: `scale(${progress})` }} />;
```

**튜닝 가이드**:
- `damping` 낮을수록 출렁임. 8 이하면 트램펄린, 20 이상이면 거의 선형
- `stiffness` 높을수록 빠르게 도달. 50~150 사이가 무난
- 결과가 0~1 범위로 정규화되어 나오므로 `interpolate`로 다시 풀어 쓰기 좋다

**함정**: `frame`만 넣고 `fps`를 빠뜨리면 같은 코드가 30fps와 60fps에서 다르게 움직인다.

---

## 한 줄 치트시트

| 하고 싶은 것 | 쓰는 API |
|---|---|
| 영상 한 편 정의 | `<Composition>` |
| 시간 슬라이스 | `<Sequence from durationInFrames>` |
| 줄세우기 | `<Series>` |
| 풀스크린 컨테이너 | `<AbsoluteFill>` |
| 현재 시간 | `useCurrentFrame()` |
| fps/해상도 | `useVideoConfig()` |
| 선형 매핑 | `interpolate(x, [a,b], [c,d])` |
| 자연 곡선 | `spring({ frame, fps })` |

다음으로 — 애니메이션을 더 깊이 파려면 [`docs/06-animation.md`](./06-animation.md), 데이터 가져오기는 [`docs/07-data-fetching.md`](./07-data-fetching.md).
