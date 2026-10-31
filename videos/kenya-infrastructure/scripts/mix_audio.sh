#!/usr/bin/env bash
# Mix voiceover segments (offsets from src/beatmap.json) with the ambient bed.
# Output: public/audio/mix.mp3 (+ mix.wav master)
set -euo pipefail
cd "$(dirname "$0")/.."

python3 - << 'PY'
import json
bm = json.load(open("src/beatmap.json"))
print(" ".join(str(round(o * 1000)) for o in bm["offsets"]))
PY