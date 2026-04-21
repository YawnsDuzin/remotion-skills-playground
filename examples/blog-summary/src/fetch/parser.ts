import fs from "node:fs/promises";

export async function parseMarkdown(filepath: string): Promise<{ title: string; sentences: string[] }> {
  const text = await fs.readFile(filepath, "utf-8");
  const lines = text.split("\n");
  const title = lines.find((l) => l.startsWith("# "))?.slice(2).trim() ?? "Untitled";

  const body = lines
    .filter((l) => !l.startsWith("#") && l.trim().length > 0)
    .join(" ")
    .replace(/\s+/g, " ");

  const sentences = body
    .split(/(?<=[.!?。])\s+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 5);

  return { title, sentences };
}

export function buildScript(title: string, sentences: string[]): string {
  return `${title}. ${sentences.join(" ")}`;
}
