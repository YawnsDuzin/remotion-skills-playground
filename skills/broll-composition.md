---
name: broll-composition
description: Remotion 데이터 씬 사이에 외부 B-roll(Veo/Pexels)을 끼워 넣는 하이브리드 컴포지션 패턴
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition]
---

# B-roll Composition 스킬

## 목적

차트/숫자/타이포 같은 **정확성이 중요한 정보**는 Remotion이 코드로 그리고, **분위기 연출용 영상**(스카이라인, 트레이딩 플로어, 도시 풍경)은 외부 mp4로 임포트한다.
이 두 레이어를 합성해 "프로덕션 퀄리티 파이낸스/리포트 영상"을 자동 생성한다.

## 원칙

1. **데이터는 코드, B-roll은 파일** — 차트·숫자·타이포는 `<svg>`나 `<div>`로, B-roll만 `<OffthreadVideo>`로 임포트
2. **B-roll은 항상 배경** — 데이터 위에 B-roll 절대 금지. 데이터 가독성을 해친다
3. **B-roll에는 dim 오버레이** — `rgba(0,0,0,0.4~0.7)` 마스크로 명도 낮춰 텍스트 가독성 확보
4. **3초 이상 B-roll**은 `<OffthreadVideo>`, 3초 미만은 `<Video>` (성능 이유 — `docs/16-images-video.md` 참고)
5. **자산 없을 때 폴백** — `USE_MOCK_BROLL=true` 환경변수나 파일 누락 시 그라데이션 플레이스홀더로 대체

## 파일 구조

```
src/
  Root.tsx
  <Composition>.tsx     # Series로 (B-roll → 데이터 오버레이) 반복
  scenes/
    BrollClip.tsx       # OffthreadVideo + 폴백 컴포넌트
    DataCard.tsx        # 데이터 오버레이 (배경 투명)
  data/
    broll.ts            # BROLL_CLIPS 매니페스트
    env.ts              # brollFileExists, isMockMode
public/
  broll/
    MANIFEST.md         # 자산 가이드
    <id>.mp4            # gitignore (직접 추가)
```

## BrollClip 컴포넌트 템플릿

```tsx
import { AbsoluteFill, OffthreadVideo, staticFile } from "remotion";

type Props = {
  clipId: string;
  children?: React.ReactNode;  // 있으면 데이터 오버레이
  forceMock?: boolean;
};

export const BrollClip = ({ clipId, children, forceMock }: Props) => {
  const clip = getBrollClip(clipId);
  const useMock = forceMock || process.env.USE_MOCK_BROLL === "true" || !clip;

  if (useMock) return <PlaceholderBackground tag={clipId}>{children}</PlaceholderBackground>;

  return (
    <AbsoluteFill>
      <OffthreadVideo src={staticFile(`broll/${clip.file}`)} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
      <AbsoluteFill style={{ backgroundColor: `rgba(0,0,0,${clip.recommendedDim})` }} />
      {children ? <AbsoluteFill>{children}</AbsoluteFill> : null}
    </AbsoluteFill>
  );
};
```

`PlaceholderBackground`는 애니메이션 그라데이션 + 클립 ID 라벨로 구성. 본 저장소 [`examples/finance-broll/src/scenes/BrollClip.tsx`](../examples/finance-broll/src/scenes/BrollClip.tsx) 참고.

## 매니페스트 형식

```ts
export type BrollClip = {
  id: string;
  file: string;            // public/broll/<file>
  tags: string[];          // 검색/선택용
  durationSec: number;     // 원본 길이
  recommendedDim: number;  // 0~1, 텍스트 위에 깔 때 어둡기
  source: string;          // Veo prompt 또는 Pexels URL
};
```

`tags`는 에이전트가 "야경" 요청 시 `night`, `skyline` 태그가 있는 클립을 자동 선택할 때 사용.

## 합성 패턴 — Series로 교대 배치

```tsx
<Series>
  <Series.Sequence durationInFrames={sec(3)}><Opening /></Series.Sequence>
  <Series.Sequence durationInFrames={sec(3)}><BrollClip clipId="skyline-day" /></Series.Sequence>
  <Series.Sequence durationInFrames={sec(6)}>
    <BrollClip clipId="skyline-day"><KospiCard {...kospi} /></BrollClip>
  </Series.Sequence>
  {/* 같은 B-roll이 "단독 → 데이터 오버레이" 순으로 두 번 등장 — 시청자가 시각적 연속성 느낌 */}
</Series>
```

## 행동 지침 — 에이전트가 따를 것

- 사용자가 "데이터 + 분위기 영상" / "B-roll 끼워넣은 리포트" 요청 → 이 스킬 적용
- B-roll 클립 ID는 사용자가 지정하지 않으면 `BROLL_CLIPS`에서 `tags` 매칭으로 자동 선택
- 같은 B-roll을 단독 컷 + 데이터 오버레이로 연속 두 번 사용해 시각적 연결감 만들기
- 데이터 카드는 배경 투명, 텍스트에 `textShadow: "0 2px 12px rgba(0,0,0,0.5)"` 추가 (B-roll 위 가독성)
- 새 클립이 필요하면 `MANIFEST.md`에 Veo 프롬프트 또는 Pexels 링크 추가 후 사용자에게 다운로드 안내

## 금지 사항

- B-roll에 데이터 텍스트 직접 그리기 (예: ffmpeg `drawtext`로 사전 합성) — Remotion 결정성 깨짐
- 같은 컴포지션 안에서 5초 이상 B-roll 4개 초과 — 렌더 시간 폭증, 메모리 부족
- `<Video>`로 30초 이상 클립 사용 — 매 프레임 디코딩으로 렌더 5~10배 느려짐
- 원격 URL을 `<OffthreadVideo>`에 직접 사용 (CORS 미해결 도메인) — Lambda에서 깨짐
- B-roll 위에 dim 없이 텍스트 얹기 — 가독성 0

## 환경 변수

- `USE_MOCK_BROLL=true` — 모든 B-roll을 그라데이션 폴백으로 (CI / 자산 없는 환경)

## 참고 예제

[`examples/finance-broll/`](../examples/finance-broll) — 본 스킬의 완성 구현체. 30초 세로 KOSPI/환율 리포트 + 3개 B-roll 합성.
