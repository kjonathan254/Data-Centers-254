#!/usr/bin/env bash
# ============================================================
# DC254 auto-checkpoint watcher (gap-1 fix: mid-session respawns)
#
# A tripwire at session start cannot catch a rollback an hour
# into the session. This watcher runs for the lifetime of the
# container and every CHECK_INTERVAL seconds:
#   1. compares local HEAD vs origin/main (desync = possible
#      mid-session rollback) -> ALERTS, never auto-resets
#   2. if the tree is dirty -> auto-commits "wip: auto-checkpoint"
#   3. pushes unpushed commits if DC254_PUSH_TOKEN is set
#
# The token lives ONLY in this process environment (in memory).
# It is never written to disk, .git/config, or this file. The
# watcher dies with the container, so the token dies with it.
#
# NOTE (verified 2026-09-15): this sandbox reaps background
# processes at tool-call boundaries, and tool shells do not
# source rc files. Daemon mode therefore does NOT persist
# between calls. Primary usage is --once, run by the agent
# between work chunks: one cycle = desync check + auto-commit
# + push. This keeps respawn exposure to a single work chunk.
#
# USAGE:
#   DC254_PUSH_TOKEN=<token> bash scripts/auto_checkpoint.sh --once
#   (daemon mode below still works where long-lived shells exist)
#
# Logs: /home/z/my-project/checkpoint.log
# Alert flag: /tmp/DC254_ROLLBACK_ALERT (checked by session_check.sh)
# ============================================================
set -u
REPO="/home/z/my-project/data-centers-audit/repo"
LOG="/home/z/my-project/checkpoint.log"
PIDFILE="/tmp/.dc254_watcher.pid"
ONCE=0
[ "${1:-}" = "--once" ] && ONCE=1
INTERVAL="${CHECK_INTERVAL:-600}"

log() { echo "[$(date -u '+%Y-%m-%d %H:%M:%S UTC')] $*" >> "$LOG"; }

# single-instance guard (skip for --once test runs)
if [ "$ONCE" -eq 0 ] && [ -f "$PIDFILE" ]; then
  OLDPID="$(cat "$PIDFILE" 2>/dev/null)"
  if [ -n "$OLDPID" ] && kill -0 "$OLDPID" 2>/dev/null; then
    echo "watcher already running (pid $OLDPID)"
    exit 0
  fi
fi
echo $$ > "$PIDFILE"
if [ -n "${DC254_PUSH_TOKEN:-}" ]; then TSTAT="set"; else TSTAT="unset"; fi
if [ "$ONCE" -eq 1 ]; then MODE="(once mode) "; else MODE=""; fi
log "watcher ${MODE}started pid=$$ interval=${INTERVAL}s token=$TSTAT"

while :; do
  cd "$REPO" 2>/dev/null || { log "FATAL: repo directory missing"; exit 1; }

  # 1. desync detection (possible mid-session rollback)
  git fetch --quiet origin main 2>/dev/null
  LOCAL="$(git rev-parse HEAD 2>/dev/null || echo NONE)"
  REMOTE="$(git rev-parse origin/main 2>/dev/null || echo NONE)"
  if [ "$LOCAL" != "NONE" ] && [ "$REMOTE" != "NONE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    BEHIND="$(git rev-list --count "${LOCAL}..${REMOTE}" 2>/dev/null || echo '?')"
    if [ "$BEHIND" != "0" ]; then
      log "ALERT DESYNC: local=${LOCAL:0:9} origin=${REMOTE:0:9} behind=$BEHIND. Possible mid-session rollback. STOP writing files; agent must assess (reset --hard origin/main or rebase) before continuing."
      touch /tmp/DC254_ROLLBACK_ALERT 2>/dev/null
    fi
  fi

  # 2. auto-commit dirty tree (label clearly as machine checkpoint)
  if [ -n "$(git status --porcelain 2>/dev/null)" ]; then
    N_FILES="$(git status --porcelain 2>/dev/null | wc -l)"
    if git add -A 2>>"$LOG" && git commit -m "wip: auto-checkpoint $(date -u '+%Y-%m-%dT%H:%M:%SZ') (${N_FILES} files)" --quiet 2>>"$LOG"; then
      log "committed auto-checkpoint (${N_FILES} files)"
    fi
  fi

  # 3. push unpushed commits
  UNPUSHED="$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)"
  if [ "$UNPUSHED" -gt 0 ]; then
    if [ -n "${DC254_PUSH_TOKEN:-}" ]; then
      if git push "https://${DC254_PUSH_TOKEN}@github.com/kjonathan254/Data-Centers-254.git" main --quiet 2>>"$LOG"; then
        log "pushed $UNPUSHED commit(s) to origin/main"
      else
        log "WARN: push failed ($UNPUSHED commit(s) unpushed; token invalid/expired or network issue)"
      fi
    else
      log "INFO: $UNPUSHED commit(s) unpushed; DC254_PUSH_TOKEN not set - agent must push"
    fi
  fi

  [ "$ONCE" -eq 1 ] && break
  sleep "$INTERVAL"
done
