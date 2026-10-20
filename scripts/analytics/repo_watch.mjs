#!/usr/bin/env node
/**
 * DC254 Repo Watch - weekly audience data sheet for the product repo (brick #4).
 *
 * Watches kjonathan254/posthog-trust-kit (configurable): stars/forks/watchers
 * with week-over-week deltas, GitHub traffic (views/clones, last 7 days),
 * top referrers (the social attribution line: x.com / linkedin.com / HN show
 * up here when the launch posts land), popular paths, new stargazers with
 * names, and open issues/PRs. Same division of labor as the Trust Brief:
 * the script is the robot's hands, the agent is the brain.
 *
 * Deltas need a place to remember last week. Snapshot lives in Upstash Redis
 * via its REST API (WATCH_SNAPSHOT_URL + WATCH_SNAPSHOT_TOKEN); without it the
 * sheet still renders, minus the delta column.
 *
 * Traffic data needs a token with PUSH access to the watched repo (GitHub
 * traffic API rule). Stars/issues/refs work with any read token. If the token
 * lacks access, those sections degrade to "n/a" instead of failing the run.
 *
 * Usage:
 *   export GH_PAT=github_pat_...            # push access to WATCH_REPO
 *   export WATCH_SNAPSHOT_URL=...           # optional, Upstash REST url
 *   export WATCH_SNAPSHOT_TOKEN=...         # optional, Upstash REST token
 *   node scripts/analytics/repo_watch.mjs                  # sheet to stdout
 *   node scripts/analytics/repo_watch.mjs --out watch.md   # also write file
 *   node scripts/analytics/repo_watch.mjs --out watch.md --quiet  # file only
 *
 * Env: WATCH_REPO (default kjonathan254/posthog-trust-kit).
 */

const REPO = process.env.WATCH_REPO || "kjonathan254/posthog-trust-kit";
const GH = "https://api.github.com";
const SNAPSHOT_URL = (process.env.WATCH_SNAPSHOT_URL || "").replace(/\/+$/, "");
const SNAPSHOT_TOKEN = process.env.WATCH_SNAPSHOT_TOKEN || "";

if (!process.env.GH_PAT) {
  console.error("GH_PAT is not set (token needs push access to " + REPO + " for traffic data)");
  process.exit(1);
}

function fail(context, status, body) {
  console.error(`FAIL ${context}: HTTP ${status}`);
  try { console.error(JSON.stringify(body).slice(0, 400)); } catch { console.error(String(body).slice(0, 400)); }
  process.exit(1);
}

async function api(path, opts = {}) {
  // GitHub also hiccups (429 secondary rate limit, 5xx). Same medicine the
  // Trust Brief learned live from PostHog 503s: retry 429/502/503/504 x4.
  const url = path.startsWith("http") ? path : `${GH}${path}`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      ...opts,
      headers: {
        Authorization: `Bearer ${process.env.GH_PAT}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "dc254-repo-watch",
        ...(opts.headers || {}),
      },
    });
    if (res.ok) {
      const text = await res.text();
      try { return JSON.parse(text); } catch { return {}; }
    }
    const json = await res.json().catch(() => ({}));
    if ([429, 502, 503, 504].includes(res.status) && attempt < 4) {
      await new Promise((r) => setTimeout(r, attempt * 4000));
      continue;
    }
    if (opts.allowMissing && res.status === 404) return null;
    fail((opts.method || "GET") + " " + path, res.status, json);
  }
}

// Traffic endpoints 403 without push access - degrade, don't die.
async function traffic(path) {
  const url = `${GH}/repos/${REPO}${path}`;
  for (let attempt = 1; attempt <= 4; attempt++) {
    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.GH_PAT}`,
        Accept: "application/vnd.github+json",
        "User-Agent": "dc254-repo-watch",
      },
    });
    if (res.ok) {
      const text = await res.text();
      try { return JSON.parse(text); } catch { return null; }
    }
    if ([429, 502, 503, 504].includes(res.status) && attempt < 4) {
      await new Promise((r) => setTimeout(r, attempt * 4000));
      continue;
    }
    if (res.status === 403 || res.status === 404) return null;
    const json = await res.json().catch(() => ({}));
    fail("GET traffic" + path, res.status, json);
  }
}

// ---- snapshot store (Upstash REST) --------------------------------------
async function snapshotGet(key) {
  if (!SNAPSHOT_URL || !SNAPSHOT_TOKEN) return null;
  try {
    const res = await fetch(`${SNAPSHOT_URL}/get/${key}`, {
      headers: { Authorization: `Bearer ${SNAPSHOT_TOKEN}` },
    });
    if (!res.ok) return null;
    const j = await res.json();
    if (!j.result) return null;
    return JSON.parse(j.result);
  } catch { return null; }
}

async function snapshotSet(key, value) {
  if (!SNAPSHOT_URL || !SNAPSHOT_TOKEN) return;
  try {
    await fetch(`${SNAPSHOT_URL}/set/${key}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${SNAPSHOT_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify(value),
    });
  } catch { /* sheet still renders without the store */ }
}

// ---- helpers -------------------------------------------------------------
const fmtInt = (n) => (n == null ? "n/a" : String(n));
function fmtDelta(now, prev) {
  if (now == null) return "n/a";
  if (prev == null) return "first run";
  const d = now - prev;
  if (d === 0) return "±0";
  return d > 0 ? `+${d}` : `${d}`;
}
const dayISO = (d) => d.toISOString().slice(0, 10);
const NOW = new Date();
const WEEK_AGO = new Date(NOW.getTime() - 7 * 24 * 3600 * 1000);

function sumLast7(days) {
  if (!days || !days.length) return null;
  const rows = days.filter((r) => new Date(r.timestamp) >= WEEK_AGO);
  return {
    count: rows.reduce((s, r) => s + r.count, 0),
    uniques: rows.reduce((s, r) => s + r.uniques, 0),
  };
}

// ---- collect -------------------------------------------------------------
const repo = await api(`/repos/${REPO}`);
const views = await traffic("/traffic/views");
const clones = await traffic("/traffic/clones");
const referrers = await traffic("/traffic/popular/referrers");
const paths = await traffic("/traffic/popular/paths");
const stargazers = await api(`/repos/${REPO}/stargazers?per_page=100`, {
  headers: { Accept: "application/vnd.github.star+json" },
});
const openIssues = await api(`/repos/${REPO}/issues?state=open&sort=created&direction=desc&per_page=10`);
const latestRelease = await api(`/repos/${REPO}/releases/latest`, { allowMissing: true });

const views7 = sumLast7(views?.views);
const clones7 = sumLast7(clones?.clones);
const newStars = (stargazers || []).filter((s) => new Date(s.starred_at) >= WEEK_AGO);
const openPRs = (openIssues || []).filter((i) => i.pull_request);
const openIssuesOnly = (openIssues || []).filter((i) => !i.pull_request);

// ---- deltas from last week's snapshot ------------------------------------
// Upstash REST maps URL path segments to command arguments, so the key must
// never contain "/" (owner/repo would split into two args and 400 out).
const snapKey = `watch:${REPO.replace(/\//g, ":")}`;
const prev = await snapshotGet(snapKey);
const current = {
  ts: NOW.toISOString(),
  stars: repo.stargazers_count,
  forks: repo.forks_count,
  watchers: repo.subscribers_count,
  open: repo.open_issues_count,
  views7: views7?.count ?? null,
  clones7: clones7?.count ?? null,
};
await snapshotSet(snapKey, current);

// ---- render --------------------------------------------------------------
const lines = [];
lines.push(`# Repo Watch - ${REPO}`);
lines.push("");
lines.push(`Week of ${dayISO(NOW)} (traffic window: last 7 days, UTC). Generated ${NOW.toISOString()}.`);
lines.push("");

lines.push("## Pulse");
lines.push("");
lines.push("| Metric | Now | Last week | Delta |");
lines.push("|---|---|---|---|");
lines.push(`| Stars | ${fmtInt(repo.stargazers_count)} | ${fmtInt(prev?.stars)} | ${fmtDelta(repo.stargazers_count, prev?.stars)} |`);
lines.push(`| Forks | ${fmtInt(repo.forks_count)} | ${fmtInt(prev?.forks)} | ${fmtDelta(repo.forks_count, prev?.forks)} |`);
lines.push(`| Watchers | ${fmtInt(repo.subscribers_count)} | ${fmtInt(prev?.watchers)} | ${fmtDelta(repo.subscribers_count, prev?.watchers)} |`);
lines.push(`| Open issues + PRs | ${fmtInt(repo.open_issues_count)} | ${fmtInt(prev?.open)} | ${fmtDelta(repo.open_issues_count, prev?.open)} |`);
lines.push(`| Latest release | ${latestRelease ? latestRelease.tag_name : "none"} | | |`);
lines.push("");

lines.push("## Traffic, last 7 days");
lines.push("");
if (views7 == null && clones7 == null) {
  lines.push("n/a - token lacks push access to the watched repo (GitHub traffic API rule).");
} else {
  lines.push(`| Views | Unique viewers | Clones | Unique cloners |`);
  lines.push(`|---|---|---|---|`);
  lines.push(`| ${fmtInt(views7?.count)} | ${fmtInt(views7?.uniques)} | ${fmtInt(clones7?.count)} | ${fmtInt(clones7?.uniques)} |`);
  if (prev) {
    lines.push("");
    lines.push(`Vs last week: views ${fmtDelta(views7?.count, prev.views7)}, clones ${fmtDelta(clones7?.count, prev.clones7)}.`);
  }
}
lines.push("");

lines.push("## Where they came from (top referrers)");
lines.push("");
if (referrers == null) {
  lines.push("n/a (needs push-access token).");
} else if (!referrers.length) {
  lines.push("No referrer traffic in the window yet.");
} else {
  lines.push("| Referrer | Views | Uniques |");
  lines.push("|---|---|---|");
  for (const r of referrers.slice(0, 10)) lines.push(`| ${r.referrer} | ${r.count} | ${r.uniques} |`);
}
lines.push("");

lines.push("## What they opened (top paths)");
lines.push("");
if (paths == null) {
  lines.push("n/a (needs push-access token).");
} else if (!paths.length) {
  lines.push("No path traffic in the window yet.");
} else {
  lines.push("| Path | Views | Uniques |");
  lines.push("|---|---|---|");
  for (const p of paths.slice(0, 5)) lines.push(`| \`${p.path}\` | ${p.count} | ${p.uniques} |`);
}
lines.push("");

lines.push("## New stargazers this week");
lines.push("");
if (newStars.length === 0) {
  lines.push("None yet.");
} else {
  for (const s of newStars) lines.push(`- @${s.user.login} (${dayISO(new Date(s.starred_at))})`);
  lines.push("");
  lines.push("_detection window covers the most recent 100 stargazers_");
}
lines.push("");

lines.push("## Open issues & PRs (newest first)");
lines.push("");
if (!openIssues || !openIssues.length) {
  lines.push("None. Quiet board.");
} else {
  for (const i of openIssues) {
    const kind = i.pull_request ? "PR" : "issue";
    lines.push(`- #${i.number} [${kind}] ${i.title} (@${i.user.login}, ${dayISO(new Date(i.created_at))})`);
  }
}
lines.push("");

lines.push("## Coverage notes");
lines.push("");
lines.push("- Traffic API is a rolling 14-day window; a weekly run always captures the last 7 days fully.");
lines.push("- Referrers collapse by domain; t.co shows as t.co / twitter-family, LinkedIn as linkedin.com.");
lines.push(prev ? "- Deltas compare against the snapshot stored last run (" + prev.ts.slice(0, 10) + ")." : "- First run: no snapshot baseline, deltas show 'first run'. From next week, deltas are live.");
lines.push("");

const report = lines.join("\n");

const outIdx = process.argv.indexOf("--out");
const outPath = outIdx >= 0 ? process.argv[outIdx + 1] : null;
if (outPath) {
  const fs = await import("node:fs");
  fs.writeFileSync(outPath, report);
}
if (!process.argv.includes("--quiet")) {
  console.log(report);
}
if (outPath) console.error(`repo watch sheet written: ${outPath}`);
