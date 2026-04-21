import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const AUDIO_DIR = "public/audio";

export async function synthesize(script: string, voice = "nara"): Promise<{ file: string; full: string }> {
  const hash = crypto.createHash("sha256").update(`${voice}:${script}`).digest("hex").slice(0, 16);
  const filename = `${hash}.mp3`;
  const full = path.join(AUDIO_DIR, filename);

  try {
    await fs.access(full);
    return { file: `audio/${filename}`, full };
  } catch {
    /* miss */
  }

  await fs.mkdir(AUDIO_DIR, { recursive: true });

  if (process.env.USE_MOCK_TTS === "true") {
    // 1초 무음 mp3 (최소 헤더만, 실제 재생 시 무음으로 처리됨)
    const silentMp3 = Buffer.from("//uQRAAAAAAAAAAAAAAAAAAAAAAAAAA", "base64");
    await fs.writeFile(full, silentMp3);
    return { file: `audio/${filename}`, full };
  }

  const buf = await callClova(script, voice);
  await fs.writeFile(full, buf);
  return { file: `audio/${filename}`, full };
}

async function callClova(text: string, voice: string): Promise<Buffer> {
  const id = process.env.CLOVA_VOICE_ID;
  const secret = process.env.CLOVA_VOICE_SECRET;
  if (!id || !secret) throw new Error("CLOVA_VOICE_ID/SECRET missing. Set USE_MOCK_TTS=true to use silent placeholder.");

  const res = await fetch("https://naveropenapi.apigw.ntruss.com/tts-premium/v1/tts", {
    method: "POST",
    headers: {
      "X-NCP-APIGW-API-KEY-ID": id,
      "X-NCP-APIGW-API-KEY": secret,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ speaker: voice, text, format: "mp3", speed: "0", pitch: "0", volume: "0" }).toString(),
  });
  if (!res.ok) throw new Error(`CLOVA ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}
