#!/usr/bin/env bash
# CLAUDE.md의 번역체 금지 규칙을 자동 검사한다.
# 코드 블록(```), 인라인 코드(`...`), HTML 주석(<!-- -->)은 제외한다 — 예시로 언급된 경우 허용.

set -euo pipefail

PATTERN='을 통해서|를 통해서|에 대해서|에 있어서|을 가지다|를 가지다|되어집니다|되어진다'

check_file() {
  local file="$1"
  # awk로 코드 블록 플래그 관리 + 인라인 코드 치환
  awk '
    BEGIN { in_code = 0 }
    /^[[:space:]]*```/ { in_code = !in_code; next }
    in_code { next }
    {
      # 인라인 코드 `...`를 공백으로 치환
      gsub(/`[^`]*`/, " ")
      print NR ":" $0
    }
  ' "$file" | grep -En "$PATTERN" || true
}

echo "== 번역체 검사 =="

TARGETS=(
  "CLAUDE.md"
  "CONTRIBUTING.md"
  "README.md"
  "ROADMAP.md"
  "CHANGELOG.md"
  "SECURITY.md"
)

found=0

for target in "${TARGETS[@]}"; do
  if [ -f "$target" ]; then
    out=$(check_file "$target")
    if [ -n "$out" ]; then
      echo "=== $target ==="
      echo "$out"
      found=1
    fi
  fi
done

for dir in docs skills; do
  if [ -d "$dir" ]; then
    for md in "$dir"/*.md; do
      if [ -f "$md" ]; then
        out=$(check_file "$md")
        if [ -n "$out" ]; then
          echo "=== $md ==="
          echo "$out"
          found=1
        fi
      fi
    done
  fi
done

for readme in examples/*/README.md; do
  if [ -f "$readme" ]; then
    out=$(check_file "$readme")
    if [ -n "$out" ]; then
      echo "=== $readme ==="
      echo "$out"
      found=1
    fi
  fi
done

if [ $found -eq 1 ]; then
  echo ""
  echo "❌ 번역체 표현 발견. CLAUDE.md 톤 규칙 참고:"
  echo "   ~을 통해서 → ~로/~으로"
  echo "   ~에 대해서 → 생략 또는 ~의/~을"
  echo "   ~에 있어서 → ~에서/~의 경우"
  echo "   ~을 가지다 → ~이 있다/~을 포함하다"
  echo "   ~되어집니다 → ~됩니다/~된다"
  echo ""
  echo "예시로 언급하는 것이면 백틱(\`)으로 감쌀 것."
  exit 1
fi

echo "✅ 번역체 없음 (검사 대상: docs/ skills/ examples/*/README.md + 루트 MD)"
