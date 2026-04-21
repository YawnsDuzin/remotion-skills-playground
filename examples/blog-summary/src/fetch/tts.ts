import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const AUDIO_DIR = "public/audio";
const MOCK_SILENT_PATH = path.join("public", "audio", "_silent.mp3");

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
    const silent = await loadOrCreateSilentMp3();
    await fs.copyFile(silent, full);
    return { file: `audio/${filename}`, full };
  }

  const buf = await callClova(script, voice);
  await fs.writeFile(full, buf);
  return { file: `audio/${filename}`, full };
}

async function loadOrCreateSilentMp3(): Promise<string> {
  try {
    await fs.access(MOCK_SILENT_PATH);
    return MOCK_SILENT_PATH;
  } catch {
    throw new Error(
      "Silent mock MP3 missing. Run: ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t 5 -q:a 9 -acodec libmp3lame public/audio/_silent.mp3"
    );
  }
}

async function callClova(text: string, voice: string): Promise<Buffer> {
  const id = process.env.CLOVA_VOICE_ID;
  const secret = process.env.CLOVA_VOICE_SECRET;
  if (!id || !secret) {
    throw new Error("CLOVA_VOICE_ID/SECRET missing. Set USE_MOCK_TTS=true to use silent placeholder.");
  }

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
      format: "mp3",
      speed: "0",
      pitch: "0",
      volume: "0",
    }).toString(),
  });
  if (!res.ok) throw new Error(`CLOVA ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}
