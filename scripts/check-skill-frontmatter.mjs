#!/usr/bin/env node
// skills/*.md의 frontmatter에 필수 필드가 모두 있는지 검사한다.

import fs from "node:fs/promises";
import path from "node:path";

const REQUIRED = ["name", "description", "install_to", "version"];
const SKILLS_DIR = "skills";

async function main() {
  const entries = await fs.readdir(SKILLS_DIR);
  const skillFiles = entries
    .filter((f) => f.endsWith(".md") && f !== "README.md");

  let failed = 0;

  for (const file of skillFiles) {
    const fullPath = path.join(SKILLS_DIR, file);
    const content = await fs.readFile(fullPath, "utf-8");
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
      console.error(`❌ ${file}: frontmatter 없음`);
      failed++;
      continue;
    }

    const body = match[1];
    const missing = REQUIRED.filter((key) => !new RegExp(`^${key}:\\s*\\S`, "m").test(body));
    if (missing.length > 0) {
      console.error(`❌ ${file}: 필수 필드 누락 [${missing.join(", ")}]`);
      failed++;
      continue;
    }

    const nameMatch = body.match(/^name:\s*(\S+)/m);
    const expected = file.replace(/\.md$/, "");
    if (nameMatch && nameMatch[1] !== expected) {
      console.error(`❌ ${file}: name("${nameMatch[1]}") !== 파일명("${expected}")`);
      failed++;
      continue;
    }

    const versionMatch = body.match(/^version:\s*(\S+)/m);
    if (versionMatch && !/^\d+\.\d+\.\d+$/.test(versionMatch[1])) {
      console.error(`❌ ${file}: version "${versionMatch[1]}"이 semver 아님`);
      failed++;
      continue;
    }

    console.log(`✅ ${file}`);
  }

  if (failed > 0) {
    console.error(`\n${failed}개 스킬이 규칙 위반. docs/11-skills-authoring.md 참고`);
    process.exit(1);
  }
}

await main();
