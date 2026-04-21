---
name: tts-korean
description: 한국어 음성합성을 calculateMetadata에서 호출해 public/audio/에 저장
install_to: .claude/skills/
version: 0.1.0
depends_on: [remotion-composition, data-fetch]
---

# Korean TTS 스킬

## 목적

스크립트(텍스트)를 받아 한국어 음성 mp3로 합성하고 컴포지션에 주입한다. 호출은 `calculateMetadata`에서, 결과는 `public/audio/`에 저장.

## 지원 백엔드

| Provider | env 키 | 추천 voice |
|---|---|---|
| Naver CLOVA Voice | `CLOVA_VOICE_ID`, `CLOVA_VOICE_SECRET` | `nara` (여성), `jinho` (남성) |
| Typecast | `TYPECAST_API_KEY` | `tc_default_kr_ko_female_a` |

기본은 CLOVA. 다른 백엔드는 `provider` props로 분기.

## 파일 구조

```
src/
  fetch/
    tts.ts            # synthesize() — provider 분기
  compositions/
    Narrator.tsx      # <Audio> + 자막
public/
  audio/
    <hash>.mp3        # 캐시된 음성 파일
```

## 호출 템플릿

```ts
// src/fetch/tts.ts
import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const AUDIO_DIR = "public/audio";

export async function synthesize(script: string, voice = "nara"): Promise<string> {
  const hash = crypto.createHash("sha256").update(`${voice}:${script}`).digest("hex").slice(0, 16);
  const filename = `${hash}.mp3`;
  const filepath = path.join(AUDIO_DIR, filename);

  try {
    await fs.access(filepath);
    return `audio/${filename}`; // 이미 있으면 재사용
  } catch { /* miss */ }

  const buf = await callClova(script, voice);
  await fs.mkdir(AUDIO_DIR, { recursive: true });
  await fs.writeFile(filepath, buf);
  return `audio/${filename}`;
}

async function callClova(text: string, voice: string): Promise<Buffer> {
  const id = process.env.CLOVA_VOICE_ID;
  const secret = process.env.CLOVA_VOICE_SECRET;
  if (!id || !secret) throw new Error("CLOVA_VOICE_ID/SECRET missing");

  const res = await fetch("https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts", {
    method: "POST",
    headers: {
      "X-NCP-APIGW-API-KEY-ID": id,
      "X-NCP-APIGW-API-KEY": secret,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      speaker: voice,
      text,
      volume: "0",
      speed: "0",
      pitch: "0",
      format: "mp3",
    }).toString(),
  });
  if (!res.ok) throw new Error(`CLOVA TTS ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}
```

## calculateMetadata 통합

```ts
import { getAudioDurationInSeconds } from "@remotion/media-utils";
import { synthesize } from "./fetch/tts";

const calc: CalculateMetadataFunction<Props> = async ({ props }) => {
  const audioFile = await synthesize(props.script);
  const duration = await getAudioDurationInSeconds(`public/${audioFile}`);
  return {
    props: { ...props, audioFile },
    durationInFrames: Math.ceil(duration * 30) + 30, // 끝에 1초 여백
  };
};
```

## 컴포넌트에서 사용

```tsx
import { AbsoluteFill, Audio, staticFile } from "remotion";

export const Narrator = ({ audioFile, script }: { audioFile: string; script: string }) => (
  <AbsoluteFill style={{ backgroundColor: "#000", color: "#fff", justifyContent: "center" }}>
    <Audio src={staticFile(audioFile)} />
    <h1 style={{ textAlign: "center", padding: 80, fontSize: 64 }}>{script}</h1>
  </AbsoluteFill>
);
```

## 발음 가이드

CLOVA·Typecast 모두 한자/영문 발음이 들쭉날쭉. 안전하게:

- "Remotion" → "리모션"
- "API" → "에이피아이"
- "TypeScript" → "타입스크립트"
- "K-콘텐츠" → "케이 콘텐츠"
- 숫자 표기는 "100,000" → "십만" (한글로 풀어쓰기)

## 비용 절약

- 캐시 파일명을 `sha256(voice + script).slice(0,16)`로 생성 — script 한 글자만 바뀌어도 새 파일이지만, 같으면 0원
- 개발 중엔 `voice="default"` 등 짧은 voice로 테스트 → 최종 렌더 전에만 `nara` 등 프리미엄
- Studio에서 미리보기는 mock 음성(2초 무음)으로 → `getRemotionEnvironment().isStudio` 분기

## 금지 사항

- API 키를 코드에 하드코딩
- `public/audio/`를 git에 커밋 (cache 파일 누적, 용량 폭증)
- 캐시 키에 시간 포함 (매번 새로 호출됨)
- 컴포넌트 본문에서 TTS 호출
- 스크립트 검증 없이 사용자 입력 그대로 → 5,000자 초과 시 거부

## 환경 변수 명세

```
CLOVA_VOICE_ID=xxx
CLOVA_VOICE_SECRET=xxx
# 또는
TYPECAST_API_KEY=xxx
```

## .gitignore 추가 항목

```
public/audio/*.mp3
.cache/
```
