import fs from "node:fs/promises";
import path from "node:path";

export async function brollFileExists(file: string, cwd = process.cwd()): Promise<boolean> {
  try {
    await fs.access(path.join(cwd, "public", "broll", file));
    return true;
  } catch {
    return false;
  }
}

export function isMockMode(): boolean {
  return process.env.USE_MOCK_BROLL === "true";
}
