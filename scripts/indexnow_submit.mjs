// IndexNow submission - submits new/changed URLs to api.indexnow.org.
// The key file is committed and public-by-design: it only proves control of
// the host, it is not a secret (editor approved committed-key storage).
//
// Usage:
//   node scripts/indexnow_submit.mjs          submit new/changed URLs since last run
//   node scripts/indexnow_submit.mjs --all    seed: submit every sitemap URL once
//
// Exit codes: 0 = submitted or nothing to do, 1 = failure (HTTP or parse).
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://data-centers-254.vercel.app';
const STATE_FILE = path.join(root, '.indexnow-state.json');

// 1. Locate the key file: a single hex-named .txt in public/ (name = key, so
//    rotating the key never requires a code change).
const candidates = readdirSync(path.join(root, 'public')).filter(f => /^[a-f0-9]{8,128}\.txt$/.test(f));
if (candidates.length !== 1) {
  console.error(`Expected exactly 1 IndexNow key file in public/, found ${candidates.length}: ${candidates.join(', ')}`);
  process.exit(1);
}
const key = candidates[0].replace(/\.txt$/, '');
const keyLocation = `${SITE}/${candidates[0]}`;

// 2. Fetch the live sitemap and extract (loc, lastmod) pairs. The sitemap is
//    our own machine-generated XML, so a regex parse is sufficient.
const sitemapRes = await fetch(`${SITE}/sitemap.xml`);
if (!sitemapRes.ok) {
  console.error(`sitemap fetch failed: HTTP ${sitemapRes.status}`);
  process.exit(1);
}
const xml = await sitemapRes.text();
const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>\s*(?:<lastmod>([^<]+)<\/lastmod>)?/g)]
  .map(m => ({ url: m[1], lastmod: m[2] ?? '' }));
if (urls.length === 0) {
  console.error('sitemap parsed to 0 URLs');
  process.exit(1);
}

// 3. Diff against the committed state: submit URLs that are new or whose
//    lastmod moved (anti-churn lastmods make this signal real).
const state = existsSync(STATE_FILE) ? JSON.parse(readFileSync(STATE_FILE, 'utf8')) : {};
const submitAll = process.argv.includes('--all');
const changed = submitAll ? urls : urls.filter(u => state[u.url] !== u.lastmod);
if (changed.length === 0) {
  console.log(`IndexNow: nothing to submit (${urls.length} URLs unchanged since last run).`);
  process.exit(0);
}

// 4. Submit to the aggregator endpoint (covers Bing, Yandex, Seznam, Naver).
const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host: new URL(SITE).host,
    key,
    keyLocation,
    urlList: changed.map(u => u.url),
  }),
});
console.log(`IndexNow: submitting ${changed.length}/${urls.length} URLs -> HTTP ${res.status} ${res.statusText}`);
if (!res.ok) {
  console.error(await res.text());
  process.exit(1);
}

// 5. Persist state only after a successful submission, so a failed run
//    retries the same URLs next time.
const next = { ...state };
for (const u of urls) next[u.url] = u.lastmod;
writeFileSync(STATE_FILE, JSON.stringify(next, null, 2) + '\n');
console.log(`IndexNow: state updated (${Object.keys(next).length} URLs tracked).`);
