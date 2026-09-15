#!/usr/bin/env bash
# ============================================================
# DC254 session-start tripwire
#
# WHY: the sandbox workspace is an ephemeral Kata Containers
# overlay rootfs (verified 2026-09-15: rootfs = volatile overlay,
# /home/z/my-project is NOT durable; only /upload is OSS-backed).
# Container respawns have reverted the workspace to stale
# snapshots 10 times, including .git itself.
#
# RULE: origin/main is the only source of truth.
# Run this BEFORE any work in a new session:
#   bash scripts/session_check.sh
#
# Exit 0 = SAFE to proceed
# Exit 1 = CRITICAL: stop, restore (git fetch origin && git
#          reset --hard origin/main), investigate before work.
#
# MAINTENANCE: update EXPECTED_* below when the site grows,
# and commit this change together with the content change.
# ============================================================
set -u
REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO"

CRITICAL=0

# --- Expected values (update + commit when site changes) ---
EXPECTED_ARTICLES=77        # content/articles/*.md
EXPECTED_FACILITIES=27      # status: " markers in src/lib/directory-data.ts
EXPECTED_SITEMAP_URLS=134   # URLs in src/app/sitemap.ts output

EM=$(printf '\xe2\x80\x94')  # em dash byte sequence (avoids literal in this file)

echo "=== DC254 tripwire $(date -u '+%Y-%m-%d %H:%M:%S UTC') ==="

# 1. Git sync state (repo is public: ls-remote needs no token)
LOCAL="$(git rev-parse HEAD 2>/dev/null || echo NONE)"
REMOTE="$(git ls-remote https://github.com/kjonathan254/Data-Centers-254.git refs/heads/main 2>/dev/null | cut -f1)"
LAST="$(git log -1 --format='%h %ad %s' --date=short 2>/dev/null || echo 'no history')"
echo "local HEAD : ${LOCAL:0:9} ($LAST)"
if [ -z "${REMOTE:-}" ]; then
  echo "[WARN]  cannot reach GitHub; sync state UNKNOWN. Investigate before writing code."
else
  echo "origin/main: ${REMOTE:0:9}"
  if [ "$LOCAL" = "$REMOTE" ]; then
    echo "[OK]    local == origin/main"
  else
    BEHIND="$(git rev-list --count "$LOCAL..$REMOTE" 2>/dev/null || echo '?')"
    AHEAD="$(git rev-list --count "$REMOTE..$LOCAL" 2>/dev/null || echo '?')"
    echo "[CRIT]  local != origin/main (behind: $BEHIND, ahead: $AHEAD)"
    echo "        -> workspace may be stale. Restore: git fetch origin && git reset --hard origin/main"
    CRITICAL=1
  fi
fi

# 2. Content integrity (catches silent rollbacks with no visible tripwire)
ARTICLES="$(find content/articles -name '*.md' 2>/dev/null | wc -l)"
if [ "$ARTICLES" -eq "$EXPECTED_ARTICLES" ]; then
  echo "[OK]    articles: $ARTICLES"
else
  echo "[CRIT]  articles: $ARTICLES (expected $EXPECTED_ARTICLES) - workspace rollback suspected"
  CRITICAL=1
fi

FACILITIES="$(rg -c 'status: "' src/lib/directory-data.ts 2>/dev/null || echo 0)"
if [ "$FACILITIES" -eq "$EXPECTED_FACILITIES" ]; then
  echo "[OK]    facilities: $FACILITIES"
else
  echo "[CRIT]  facilities: $FACILITIES (expected $EXPECTED_FACILITIES)"
  CRITICAL=1
fi

# 3. Route-regression sentinels (a rollback to pre-1eb1bfd fails these)
if [ -f src/app/policy/page.tsx ]; then
  echo "[OK]    /policy hub present"
else
  echo "[CRIT]  src/app/policy/page.tsx missing (pre-orphan-fix workspace detected)"
  CRITICAL=1
fi
if [ -f src/app/internet/page.tsx ]; then
  echo "[CRIT]  src/app/internet/page.tsx exists again (should be deleted; 308 redirect only)"
  CRITICAL=1
else
  echo "[OK]    /internet route deleted (served via 308)"
fi
if rg -q 'source.*internet|internet.*destination' next.config.ts 2>/dev/null; then
  echo "[OK]    /internet 308 entry in next.config.ts"
else
  echo "[CRIT]  /internet 308 redirect missing from next.config.ts"
  CRITICAL=1
fi

# 4. Em-dash canary (house rule: none in rendered content; globals.css comments exempt)
EMDASH_FILES="$(rg -l "$EM" src content -g '!globals.css' 2>/dev/null | wc -l)"
if [ "$EMDASH_FILES" -eq 0 ]; then
  echo "[OK]    em-dash sweep clean"
else
  echo "[WARN]  em dash reappeared in $EMDASH_FILES file(s)"
fi

# 5. Hygiene
DIRTY="$(git status --porcelain 2>/dev/null | wc -l)"
echo "[INFO]  uncommitted changes: $DIRTY (should be 0 at session start: push after every change)"
if [ -d node_modules ]; then
  echo "[OK]    node_modules present"
else
  echo "[WARN]  node_modules missing (npm install before any build)"
fi

echo "=== RESULT: $( [ $CRITICAL -eq 0 ] && echo SAFE || echo CRITICAL ) ==="
exit $CRITICAL
