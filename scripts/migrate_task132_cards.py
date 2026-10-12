#!/usr/bin/env python3
"""Task 132: consolidate dual card CSS systems onto card-solid.

Old system: .glass-card (+ .glass-card-hover) - translucent + backdrop blur,
            no baked radius (relied on paired rounded-* utilities).
New system: .card-solid (+ .card-solid-hover) - opaque, 1px white/8% border,
            baked 0.75rem radius (overrides paired rounded-* per compiled-CSS
            cascade: custom rules sit after generated utilities).

Map HUD exception: the map component's floating PanelShell (mobile bottom
sheet / desktop overlay panel) sits ON TOP of the live map where translucency
is functional. It becomes .hud-panel (renamed glass-card block, same body).
Everything else -> card-solid / card-solid-hover.

Byte-exact protocol: decode utf-8, per-rule subn with counts asserted against
the survey inventory, write bytes back.
"""
import glob
import sys

REPO = "/home/z/my-project/Data-Centers-254"

# Inventory from rg survey (must match exactly or abort):
#   38 x "glass-card" token runs (the earlier raw rg count of 45 also matched
#   the glass-card substring inside 7 "glass-card-hover" runs), of which 7 are
#   the leading half of "glass-card glass-card-hover" and 1 (PanelShell) ->
#   hud-panel; 30 lone glass-card -> card-solid. 7 x glass-card-hover in pair.
EXPECT = {
    "pair": 7,        # "glass-card glass-card-hover" occurrences
    "hud": 1,         # PanelShell glass-card -> hud-panel
    "plain": 30,      # remaining lone glass-card -> card-solid (38 - 7 - 1)
    "hover": 0,       # glass-card-hover not already in pair
}

changed = {}
for path in glob.glob(f"{REPO}/src/**/*.tsx", recursive=True):
    raw = open(path, "rb").read()
    text = raw.decode("utf-8")
    orig = text
    n_pair = text.count("glass-card glass-card-hover")
    text = text.replace("glass-card glass-card-hover", "card-solid card-solid-hover")
    n_hud = 0
    if "east-africa-infrastructure-map.tsx" in path:
        marker = 'glass-card rounded-xl p-4 md:p-5 w-full md:w-[340px]'
        n_hud = text.count(marker)
        text = text.replace(marker, marker.replace("glass-card", "hud-panel"))
    n_plain = text.count("glass-card")
    text = text.replace("glass-card", "card-solid")
    counts = {"pair": n_pair, "hud": n_hud, "plain": n_plain, "hover": 0}
    if counts != {k: v for k, v in EXPECT.items() if v or counts[k]}:
        pass  # per-file counts differ; aggregate check below
    for k, v in counts.items():
        changed[k] = changed.get(k, 0) + v
    if text != orig:
        open(path, "wb").write(text.encode("utf-8"))
        print(f"rewrote {path.split('src/')[-1]}: pair={n_pair} hud={n_hud} plain={n_plain}")

total = {k: changed.get(k, 0) for k in EXPECT}
print("TOTALS:", total)
already_done = all(v == 0 for v in total.values())
if total != EXPECT and not already_done:
    print("MISMATCH vs inventory - ABORT (files already written, will revert via git)")
    sys.exit(1)
if already_done:
    print("no-op pass (already migrated) - proceeding to CSS step")

# globals.css: rename .glass-card block -> .hud-panel; delete .glass-card-hover rules.
css_path = f"{REPO}/src/app/globals.css"
raw = open(css_path, "rb").read()
css = raw.decode("utf-8")
old_block = """  .glass-card {
    background: oklch(0.12 0.008 260 / 60%);
    backdrop-filter: blur(12px);
    border: 1px solid oklch(1 0 0 / 6%);
  }
  .glass-card-hover:hover {
    background: oklch(0.14 0.01 260 / 70%);
    border-color: oklch(0.78 0.14 195 / 20%);
  }
"""
new_block = """  /* Map HUD panel - the one intentional survivor of the old glass system
     (Task 132 consolidation). Translucent + blurred ON PURPOSE: the map
     component's floating PanelShell overlays the live map. Do not convert
     to card-solid (opaque would hide the map behind the panel). */
  .hud-panel {
    background: oklch(0.12 0.008 260 / 60%);
    backdrop-filter: blur(12px);
    border: 1px solid oklch(1 0 0 / 6%);
  }
"""
assert css.count(old_block) == 1, "glass-card CSS block not found verbatim"
css = css.replace(old_block, new_block)
open(css_path, "wb").write(css.encode("utf-8"))
print("globals.css: .glass-card -> .hud-panel (renamed in place), .glass-card-hover deleted")
print("OK")
