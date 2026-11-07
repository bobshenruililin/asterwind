#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")"
SOURCE=../reference-v1/02-turn-or-pass-decision.webp
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT
rasterize() {
  local file="$1" output="$2" bg="$3"
  local draw
  draw=$(node -e 'const fs=require("fs"); const s=fs.readFileSync(process.argv[1],"utf8"); const paths=[...s.matchAll(/<path fill="([^"]+)" d="([^"]+)"/g)]; process.stdout.write(paths.map(m=>"fill "+m[1]+" path "+String.fromCharCode(39)+m[2]+String.fromCharCode(39)).join("\n"))' "$file")
  magick -size 1672x941 "xc:$bg" -draw "$draw" -colorspace Gray -depth 8 "$output"
}
for name in platter tray; do
  rasterize "masks/$name-object.svg" "$TMP/object.png" black
  rasterize "masks/$name-shadow.svg" "$TMP/shadow.png" black
  magick "$TMP/shadow.png" -blur 0x3 "$TMP/shadow.png"
  magick "$TMP/object.png" "$TMP/shadow.png" -compose Lighten -composite "$TMP/alpha.png"
  if [[ $name == platter ]]; then
    rasterize masks/platter-occlusion.svg "$TMP/occlusion.png" white
    magick "$TMP/alpha.png" "$TMP/occlusion.png" -compose Multiply -composite "$TMP/alpha.png"
  fi
  # Only alpha is copied. RGB is decoded source data, never resampled or painted.
  magick "$SOURCE" -alpha off "$TMP/alpha.png" -compose CopyOpacity -composite -background black -alpha background -depth 8 -define png:color-type=6 "$name-registered.png"
  magick "$name-registered.png" -trim +repage -define png:color-type=6 "$name-crop.png"
done
