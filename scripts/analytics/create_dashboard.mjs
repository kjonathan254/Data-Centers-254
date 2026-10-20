#!/usr/bin/env node
/**
 * DC254 Trust Engine dashboard-as-code.
 *
 * Creates (or refreshes) the "DC254 Trust Engine" PostHog dashboard from the
 * spec below: the north-star funnel, weekly conversion signals, sponsor
 * interest, and the security guardrails, all grounded in the exact event
 * names the site emits (server conversions from src/lib/posthog-server.ts,
 * client events from the consent-gated posthog-js integration).
 *
 * Why dashboard-as-code: the dashboard is a product asset. Keeping the spec
 * in the repo means any agent can rebuild it exactly with one command, the
 * definition survives editor/key/sandbox changes, and the same loop can be
 * offered to other sites as a service later.
 *
 * Usage:
 *   export POSTHOG_PERSONAL_API_KEY=phx_...   # needs dashboard:write + insight:write
 *   node scripts/analytics/create_dashboard.mjs           # apply + verify
 *   node scripts/analytics/create_dashboard.mjs --verify  # read back only (read-only key OK)
 *
 * Env: POSTHOG_HOST (default https://us.posthog.com), POSTHOG_PROJECT_ID (default 674556).
 * The API key is read from the environment only - never hardcode it here.
 */

const HOST = (process.env.POSTHOG_HOST || "https://us.posthog.com").replace(/\/+$/, "");
const PROJECT = process.env.POSTHOG_PROJECT_ID || "674556";
const NAME = "DC254 Trust Engine";
const VERIFY_ONLY = process.argv.includes("--verify");

if (!process.env.POSTHOG_PERSONAL_API_KEY) {
  console.error("POSTHOG_PERSONAL_API_KEY is not set (source .secrets/posthog.env)");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Spec: tiles in reading order. Text tile first, then the loop, then guardrails.
// Event names are the contract with src/lib/posthog-server.ts - do not rename
// one side without the other.
// ---------------------------------------------------------------------------
const SPEC = {
  name: NAME,
  description:
    "The trust loop at a glance: attract (human pageviews) -> prove (tracker exports, sponsor clicks) -> convert (subscribe opt-ins), plus the guardrails (CSP tripwire, honeypot, rejected sponsor hosts). Dashboard-as-code: scripts/analytics/create_dashboard.mjs",
  tags: ["dc254", "trust-engine"],
  tiles: [
    {
      text: {
        body: [
          "**The trust loop, in one page:** attract -> prove -> convert.",
          "",
          "1. **Attract** - human pageviews (bots already filtered at capture time).",
          "2. **Prove** - tracker exports and sponsor clicks are professionals acting on our intel.",
          "3. **Convert** - subscribe opt-ins are trust made formal.",
          "",
          "Guardrails: CSP tripwire (browser blocks something = regression alarm), honeypot hits and rejected sponsor hosts (abuse attempts).",
          "",
          "*Dashboard-as-code: edit `scripts/analytics/create_dashboard.mjs`, re-run apply. Event names are the contract with `src/lib/posthog-server.ts`.*",
        ].join("\n"),
      },
    },
    {
      insight: {
        name: "The loop in one funnel: read -> engage -> opt-in",
        query: {
          kind: "FunnelsQuery",
          series: [
            { kind: "EventsNode", event: "$pageview", name: "Read an article" },
            { kind: "EventsNode", event: "export_interest", name: "Used the tracker" },
            { kind: "EventsNode", event: "subscribe_optin_started", name: "Started opt-in" },
          ],
          dateRange: { date_from: "-30d" },
          interval: "week",
          funnelsFilter: { funnelWindowInterval: 14, funnelWindowIntervalUnit: "day", funnelOrderType: "ordered" },
        },
      },
    },
    {
      insight: {
        name: "Conversion signals per week",
        query: {
          kind: "TrendsQuery",
          series: [
            { kind: "EventsNode", event: "subscribe_optin_started", name: "Opt-ins started" },
            { kind: "EventsNode", event: "export_interest", name: "Tracker exports" },
            { kind: "EventsNode", event: "contact_message_sent", name: "Contact messages" },
            { kind: "EventsNode", event: "sponsor_click", name: "Sponsor clicks" },
          ],
          dateRange: { date_from: "-30d" },
          interval: "week",
        },
      },
    },
    {
      insight: {
        name: "Sponsor interest by tenant slug",
        query: {
          kind: "TrendsQuery",
          series: [{ kind: "EventsNode", event: "sponsor_click", name: "Sponsor clicks" }],
          dateRange: { date_from: "-30d" },
          interval: "week",
          breakdownFilter: { breakdown: "slug", breakdown_type: "event" },
        },
      },
    },
    {
      insight: {
        name: "Guardrails tripped (honeypot + rejected sponsor hosts)",
        query: {
          kind: "TrendsQuery",
          series: [
            { kind: "EventsNode", event: "subscribe_honeypot_hit", name: "Honeypot hits" },
            { kind: "EventsNode", event: "sponsor_click_rejected", name: "Rejected sponsor clicks" },
          ],
          dateRange: { date_from: "-30d" },
          interval: "week",
        },
      },
    },
    {
      insight: {
        name: "CSP tripwire by directive",
        query: {
          kind: "TrendsQuery",
          series: [{ kind: "EventsNode", event: "csp_violation", name: "CSP violations" }],
          dateRange: { date_from: "-30d" },
          interval: "week",
          breakdownFilter: { breakdown: "directive", breakdown_type: "event" },
        },
      },
    },
    {
      insight: {
        name: "Human pageviews",
        query: {
          kind: "TrendsQuery",
          series: [{ kind: "EventsNode", event: "$pageview", name: "Pageviews" }],
          dateRange: { date_from: "-30d" },
          interval: "week",
        },
      },
    },
  ],
};

// ---------------------------------------------------------------------------
function fail(context, status, body) {
  console.error(`FAIL ${context}: HTTP ${status}`);
  try {
    console.error(JSON.stringify(body).slice(0, 400));
  } catch {
    console.error(String(body).slice(0, 400));
  }
  process.exit(1);
}

async function api(path, opts = {}) {
  const res = await fetch(`${HOST}/api/projects/${PROJECT}${path}`, {
    ...opts,
    headers: {
      Authorization: `Bearer ${process.env.POSTHOG_PERSONAL_API_KEY}`,
      "Content-Type": "application/json",
      ...(opts.headers || {}),
    },
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) fail(opts.method || "GET" + " " + path, res.status, json);
  return json;
}

async function main() {
  if (VERIFY_ONLY) return verify();

  // 1. soft-delete any dashboard carrying our name, then create fresh.
  //    (apply = recreate: the URL is printed at the end, the spec is the asset)
  const list = await api(`/dashboards/?limit=500`);
  for (const d of (list.results || []).filter((d) => d.name === NAME)) {
    await api(`/dashboards/${d.id}/`, { method: "PATCH", body: { deleted: true } });
    console.log(`deleted stale dashboard id=${d.id}`);
  }
  const dash = await api(`/dashboards/`, {
    method: "POST",
    body: { name: SPEC.name, description: SPEC.description, tags: SPEC.tags },
  });
  console.log(`created dashboard id=${dash.id}`);

  // 2. insight tiles: this API version has no /tiles/ sub-endpoint and PATCH
  //    with inline insights silently drops them. The supported route is
  //    POST /insights/ with dashboards:[id], which auto-creates the tiles.
  let n = 0;
  for (const tile of SPEC.tiles) {
    if (!tile.insight) continue;
    await api(`/insights/`, {
      method: "POST",
      body: { ...tile.insight, dashboards: [dash.id], saved: true },
    });
    n += 1;
    console.log(`  insight ${n}/${SPEC.tiles.filter((t) => t.insight).length} ok (${tile.insight.name})`);
  }

  // 3. text tiles: PATCH the dashboard with inline text tiles (append-only)
  const textTiles = SPEC.tiles.filter((t) => t.text).map((t) => ({ text: t.text }));
  if (textTiles.length) {
    await api(`/dashboards/${dash.id}/`, { method: "PATCH", body: { tiles: textTiles } });
    console.log(`  text tile ok`);
  }

  console.log(`\nApplied -> https://us.posthog.com/dashboard/${dash.id}`);
  return verify(dash.id);
}

// ---------------------------------------------------------------------------
async function verify(forcedId) {
  const found = (await api(`/dashboards/?limit=500`)).results.find((d) => d.name === NAME);
  if (!found) fail("verify", 404, { detail: `dashboard "${NAME}" not found` });
  const dash = await api(`/dashboards/${found.id}/`); // list omits tiles; detail carries them

  console.log(`\nVerify dashboard ${dash.id} "${dash.name}" (${dash.tiles?.length || 0} tiles)`);
  for (const tile of dash.tiles || []) {
    if (tile.text) {
      console.log(`  [text] ${tile.text.body.split("\n")[0].slice(0, 60)}`);
      continue;
    }
    const ins = tile.insight;
    if (!ins) continue;
    // fresh insights have no cached result; execute the stored query ad-hoc
    const out = await api(`/query/`, { method: "POST", body: { query: ins.query } });
    if (out.error) {
      console.log(`  [insight ${ins.id}] ${ins.name}\n           QUERY ERROR: ${out.error.slice(0, 200)}`);
      continue;
    }
    const res = out.results;
    let summary = "no result";
    if (Array.isArray(res) && res.length) {
      if (Array.isArray(res[0]?.count)) {
        summary = `funnel steps: ${res.map((s) => s.count).join(" -> ")}`;
      } else if (Array.isArray(res[0]?.data)) {
        summary = res.map((s) => `${s.label}: ${s.count ?? s.data.reduce((a, b) => a + b, 0)}`).join(", ");
      } else {
        summary = `${res.length} rows`;
      }
    }
    console.log(`  [insight ${ins.id}] ${ins.name}\n           ${summary}`);
  }
  console.log(`\nURL: https://us.posthog.com/dashboard/${dash.id}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
