---
name: title-card
description: 가장 단순한 5초 타이틀 카드 영상. Remotion 입문용.
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition, motion]
---

# Title Card 스킬

## 목적

"제목 + 부제목"만 들어간 5초짜리 인트로 영상. 가장 단순하지만 자주 쓰임 — 유튜브 인트로, SNS 공유 카드, 영상 챕터 마커 등.

## 스펙

- 해상도 1920×1080 (가로) 또는 1080×1920 (세로). props로 분기
- 길이 5초 / 30fps / 150 frames
- 구성: 페이드인(1초) → 유지(3초) → 페이드아웃(1초)
- 폰트 Pretendard Variable
- 배경 `#0F172A` (슬레이트), 텍스트 `#F8FAFC`

## Props 스키마

```ts
import { z } from "zod";

export const titleCardSchema = z.object({
  title: z.string().min(1).max(60),
  subtitle: z.string().max(120).optional(),
  orientation: z.enum(["landscape", "portrait"]).default("landscape"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#38BDF8"),
});

export type TitleCardProps = z.infer<typeof titleCardSchema>;
```

## 컴포넌트 템플릿

```tsx
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from "remotion";
import { enterFromBottom, fadeOut } from "../motion/presets";
import type { TitleCardProps } from "./schema";

export const TitleCard = ({ title, subtitle, accentColor }: TitleCardProps) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const titleStyle = enterFromBottom({ frame, fps }, 60);
  const subtitleStyle = enterFromBottom({ frame: frame - 10, fps }, 40);
  const fadeStyle = fadeOut({ frame }, durationInFrames, 30);

  return (
    <AbsoluteFill style={{
      backgroundColor: "#0F172A",
      justifyContent: "center",
      alignItems: "center",
      fontFamily: "Pretendard",
      ...fadeStyle,
    }}>
      <div style={{
        ...titleStyle,
        fontSize: 120,
        fontWeight: 800,
        color: "#F8FAFC",
        textAlign: "center",
        padding: "0 80px",
      }}>{title}</div>
      {subtitle && (
        <div style={{
          ...subtitleStyle,
          fontSize: 48,
          color: accentColor,
          marginTop: 32,
          fontWeight: 500,
        }}>{subtitle}</div>
      )}
    </AbsoluteFill>
  );
};
```

## Composition 등록

```tsx
import { Composition } from "remotion";

<Composition
  id="TitleCardLandscape"
  component={TitleCard}
  durationInFrames={150}
  fps={30}
  width={1920}
  height={1080}
  schema={titleCardSchema}
  defaultProps={{
    title: "안녕, 리모션",
    subtitle: "Remotion + Claude Code 한국어 가이드",
    orientation: "landscape",
    accentColor: "#38BDF8",
  }}
/>

<Composition
  id="TitleCardPortrait"
  component={TitleCard}
  durationInFrames={150}
  fps={30}
  width={1080}
  height={1920}
  schema={titleCardSchema}
  defaultProps={{
    title: "안녕, 리모션",
    orientation: "portrait",
    accentColor: "#38BDF8",
  }}
/>
```

## 렌더 명령

```bash
npx remotion render src/index.ts TitleCardLandscape out/title.mp4 \
  --props='{"title":"오늘의 핵심","subtitle":"3분 안에 읽는다","accentColor":"#FB923C"}'
```

## 에이전트 행동 지침

- 사용자가 "인트로 만들어줘" / "타이틀 카드" / "오프닝" 요청 → 이 스킬 사용
- `title`이 60자 초과 → 폰트 사이즈를 80으로 자동 축소
- `subtitle` 없으면 그냥 생략 (조건부 렌더)
- `accentColor`는 사용자 지정 우선, 없으면 기본값
- 가로/세로 둘 다 필요하면 두 컴포지션 모두 생성

## 금지 사항

- 5초보다 긴 영상으로 확장 (별도 스킬로 분리)
- `<Img>`, `<Video>` 추가 (제목 카드 본질에서 벗어남)
- 폰트 색상을 props로 받기 (`accentColor`만으로 충분)
- BGM 추가 (음성/음악 필요하면 `tts-korean` 스킬 조합)
