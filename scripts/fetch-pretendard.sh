#!/usr/bin/env bash
# 모든 예제 public/fonts/에 PretendardVariable.woff2를 다운로드한다.
# 사용: bash scripts/fetch-pretendard.sh

set -euo pipefail

URL="https://github.com/orioncactus/pretendard/raw/main/packages/pretendard/dist/web/variable/woff2/PretendardVariable.woff2"

for dir in examples/*/public/fonts; do
  if [ -d "$dir" ]; then
    target="$dir/PretendardVariable.woff2"
    if [ -f "$target" ]; then
      echo "skip (exists): $target"
      continue
    fi
    echo "download → $target"
    curl -sSL -o "$target" "$URL"
  fi
done

echo "done."
