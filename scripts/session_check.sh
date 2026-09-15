#!/usr/bin/env bash
# ============================================================
# DC254 session tripwire (v2)
#
# WHY: sandbox workspace = ephemeral Kata Containers overlay
# rootfs. Respawns have repeatedly replaced the workspace
# (including .git) with a frozen ~Aug 29/30 checkpoint,
# sometimes mid-task. Verified 2026-09-15.
#
# USAGE:
#   bash scripts/session_check.sh           full check. Agent: run at session
#                                           start AND before any file write
#                                           until it has passed this boot.
#   bash scripts/session_check.sh --hook    internal: rc-file hook, silent
#                                           unless CRITICAL, once per boot.
#   bash scripts/auto_checkpoint.sh         companion watcher (gap-1 fix):
#                                           10-min auto-commit + push + desync alert.
#
# v2: expected content counts are pulled from origin/main
# dynamically (no hardcoded 77/27 that rots as content grows).
# origin/main is the source of truth; local is compared to it.
#
# Exit 0 = SAFE. Exit 1 = CRITICAL (stop; recover with:
#   git fetch origin && git reset --hard origin/main
# then re-run this script).
# ============================================================
set -u
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# ---------- hook mode: silent once-per-boot run for rc-sourced shells ----------
if [ "${1:-}" = "--hook" ]; then
  BTIME="$(awk '/btime/ {print $2}' /proc/stat 2>/dev/null || echo 0)"
  MARKER="/tmp/.dc254_tripwire_${BTIME}"
  [ -f "$MARKER" ] && exit 0
  OUT="$(bash "${BASH_SOURCE[0]}" 2>&1)"
  RC=$?
  if [ "$RC" -ne 0 ]; then
    printf '%s\n' "$OUT" >&2   # speak only on CRITICAL
  fi
  mkdir -p /tmp 2>/dev/null
  touch "$MARKER"
  exit "$RC"
fi

cd "$REPO" || exit 1
CRITICAL=0
EM=$(printf '\xe2\x80\x94')  # em dash byte sequence (avoids literal in this file)

echo "=== DC254 tripwire $(date -u '+%Y-%m-%d %H:%M:%S UTC') ==="

# ---------- 1. sync state (public repo: fetch/ls-remote need no token) ----------
FETCHED=0
if git fetch --quiet origin main 2>/dev/null; then FETCHED=1; fi
LOCAL="$(git rev-parse HEAD 2>/dev/null || echo NONE)"
if [ "$FETCHED" -eq 1 ]; then
  REMOTE="$(git rev-parse origin/main 2>/dev/null || echo NONE)"
else
  REMOTE="$(git ls-remote https://github.com/kjonathan254/Data-Centers-254.git refs/heads/main 2>/dev/null | cut -f1)"
fi
LAST="$(git log -1 --format='%h %ad %s' --date=short 2>/dev/null || echo 'no history')"
echo "local HEAD : ${LOCAL:0:9} ($LAST)"
SYNCED=0; AHEAD_ONLY=0
if [ -z "${REMOTE:-}" ] || [ "$REMOTE" = "NONE" ]; then
  echo "[WARN]  cannot reach GitHub; sync state UNKNOWN. Investigate before writing files."
elif [ "$LOCAL" = "$REMOTE" ]; then
  echo "[OK]    local == origin/main"; SYNCED=1
else
  BEHIND="$(git rev-list --count "${LOCAL}..${REMOTE}" 2>/dev/null || echo '?')"
  AHEAD="$(git rev-list --count "${REMOTE}..${LOCAL}" 2>/dev/null || echo '?')"
  if [ "$BEHIND" = "0" ] && [ "$AHEAD" != "0" ]; then
    AHEAD_ONLY=1
    echo "[WARN]  local AHEAD of origin by $AHEAD commit(s): push your work (watcher will too)"
  else
    echo "[CRIT]  local != origin/main (behind: $BEHIND, ahead: $AHEAD)"
    echo "        -> stale workspace suspected (mid-session rollback?). Recover:"
    echo "           git fetch origin && git reset --hard origin/main"
    CRITICAL=1
  fi
fi

# ---------- 2. content integrity vs origin (dynamic; never rots) ----------
if [ "$SYNCED" -eq 1 ]; then
  ART_L="$(find content/articles -name '*.md' 2>/dev/null | wc -l)"
  ART_O="$(git ls-tree -r origin/main --name-only -- content/articles 2>/dev/null | grep -c '\.md$')"
  ART_O="${ART_O:-0}"
  FAC_L="$(grep -c 'status: "' src/lib/directory-data.ts 2>/dev/null)"
  FAC_L="${FAC_L:-0}"
  FAC_O="$(git show origin/main:src/lib/directory-data.ts 2>/dev/null | grep -c 'status: "')"
  FAC_O="${FAC_O:-0}"
  if [ "$ART_O" -gt 0 ] && [ "$ART_L" -eq "$ART_O" ]; then
    echo "[OK]    articles: $ART_L (matches origin)"
  else
    echo "[CRIT]  articles: local=$ART_L origin=$ART_O - content drift or corruption"
    CRITICAL=1
  fi
  if [ "$FAC_O" -gt 0 ] && [ "$FAC_L" -eq "$FAC_O" ]; then
    echo "[OK]    facilities: $FAC_L (matches origin)"
  else
    echo "[CRIT]  facilities: local=$FAC_L origin=$FAC_O - data drift or corruption"
    CRITICAL=1
  fi
else
  echo "[INFO]  content counts not compared (only meaningful when fully synced)"
fi

# ---------- 3. route-regression sentinels (guard origin too) ----------
# MAINTENANCE: update these three in the SAME commit as any legit route change.
if [ -f src/app/policy/page.tsx ]; then
  echo "[OK]    /policy hub present"
else
  echo "[CRIT]  src/app/policy/page.tsx missing (orphan-fix regression)"
  CRITICAL=1
fi
if [ -f src/app/internet/page.tsx ]; then
  echo "[CRIT]  src/app/internet/page.tsx exists again (should be deleted; 308 only)"
  CRITICAL=1
else
  echo "[OK]    /internet route deleted (served via 308)"
fi
if grep -qE 'source.*internet|internet.*destination' next.config.ts 2>/dev/null; then
  echo "[OK]    /internet 308 entry in next.config.ts"
else
  echo "[CRIT]  /internet 308 redirect missing from next.config.ts"
  CRITICAL=1
fi

# ---------- 4. em-dash canary (house rule; globals.css comments exempt) ----------
EMDASH_FILES="$(grep -rlF "$EM" src content 2>/dev/null | grep -v 'globals.css' | wc -l)"
if [ "$EMDASH_FILES" -eq 0 ]; then
  echo "[OK]    em-dash sweep clean"
else
  echo "[WARN]  em dash reappeared in $EMDASH_FILES file(s)"
fi

# ---------- 5. mid-session protections status ----------
if [ -f /tmp/DC254_ROLLBACK_ALERT ]; then
  echo "[CRIT]  watcher raised ROLLBACK ALERT earlier this boot (see /home/z/my-project/checkpoint.log)"
  CRITICAL=1
fi
if command -v pgrep >/dev/null 2>&1 && pgrep -f "auto_checkpoint.sh" >/dev/null 2>&1; then
  echo "[OK]    auto-checkpoint watcher running"
else
  echo "[WARN]  watcher NOT running: launch with"
  echo "        DC254_PUSH_TOKEN=<token> nohup bash scripts/auto_checkpoint.sh >/dev/null 2>&1 &"
fi

# ---------- 6. hygiene ----------
DIRTY="$(git status --porcelain 2>/dev/null | wc -l)"
echo "[INFO]  uncommitted changes: $DIRTY"
[ -d node_modules ] && echo "[OK]    node_modules present" || echo "[WARN]  node_modules missing (npm install before build)"

# ---------- 7. self-install rc hook (gap-2: no human memory needed) ----------
# Shell rc files sit on the same ephemeral layer, so this reinstalls on
# every session where the tripwire is run once by the agent.
HOOK_LINE='bash /home/z/my-project/data-centers-audit/repo/scripts/session_check.sh --hook >/dev/null 2>&1'
if ! grep -qF 'session_check.sh --hook' /home/z/.bashrc 2>/dev/null; then
  printf '\n# DC254 tripwire auto-run (installed by session_check.sh)\n%s\n' "$HOOK_LINE" >> /home/z/.bashrc 2>/dev/null
fi
[ -f /home/z/.profile ] && ! grep -qF 'session_check.sh --hook' /home/z/.profile 2>/dev/null && \
  printf '\n# DC254 tripwire auto-run\n%s\n' "$HOOK_LINE" >> /home/z/.profile 2>/dev/null

echo "=== RESULT: $( [ $CRITICAL -eq 0 ] && echo SAFE || echo CRITICAL ) ==="
exit $CRITICAL
