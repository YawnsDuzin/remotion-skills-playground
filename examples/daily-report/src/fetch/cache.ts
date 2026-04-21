import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";

const CACHE_DIR = ".cache";

export async function cached<T>(key: object, fn: () => Promise<T>, ttlMs = 3_600_000): Promise<T> {
  const hash = crypto.createHash("sha256").update(JSON.stringify(key)).digest("hex");
  const file = path.join(CACHE_DIR, `${hash}.json`);
  try {
    const stat = await fs.stat(file);
    if (Date.now() - stat.mtimeMs < ttlMs) {
      return JSON.parse(await fs.readFile(file, "utf-8"));
    }
  } catch {
    /* miss */
  }
  const fresh = await fn();
  await fs.mkdir(CACHE_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(fresh));
  return fresh;
}
