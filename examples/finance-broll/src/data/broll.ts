/**
 * B-roll 클립 매니페스트.
 *
 * 새 클립 추가 절차:
 * 1. mp4를 public/broll/<id>.mp4로 저장
 * 2. 아래 BROLL_CLIPS 배열에 메타데이터 추가
 * 3. schema.ts의 brollIds 기본값 또는 props로 사용
 */

export type BrollClip = {
  id: string;
  file: string;
  tags: string[];
  durationSec: number;
  /** 메인 데이터 위에 오버레이 시 추천 dim 강도 (0=원본, 1=완전 검정) */
  recommendedDim: number;
  /** 라이선스 / 출처 */
  source: string;
};

export const BROLL_CLIPS: BrollClip[] = [
  {
    id: "skyline-day",
    file: "skyline-day.mp4",
    tags: ["skyline", "day", "city", "neutral"],
    durationSec: 8,
    recommendedDim: 0.55,
    source: "예시 — Pexels CC0 또는 Veo prompt: 'aerial view of Seoul financial district at noon, cinematic, slow zoom'",
  },
  {
    id: "trading-floor",
    file: "trading-floor.mp4",
    tags: ["interior", "screens", "energy"],
    durationSec: 6,
    recommendedDim: 0.7,
    source: "예시 — Veo prompt: 'modern trading floor with multiple monitors, blue tones, no people'",
  },
  {
    id: "skyline-night",
    file: "skyline-night.mp4",
    tags: ["skyline", "night", "city"],
    durationSec: 8,
    recommendedDim: 0.4,
    source: "예시 — Pexels CC0 또는 Veo prompt: 'Seoul skyline at night with light trails, cinematic'",
  },
];

export function getBrollClip(id: string): BrollClip | null {
  return BROLL_CLIPS.find((c) => c.id === id) ?? null;
}

export function getBrollFilePath(clip: BrollClip): string {
  return `broll/${clip.file}`;
}
