/*
 * DC254 service worker.
 * GENERATED FILE — this template is compiled to public/sw.js by
 * scripts/pwa-prebuild.mjs at build time (__BUILD_STAMP__ replaced).
 *
 * Strategy:
 *  - Navigations (article/HTML): network-first. Always try the network so a
 *    deployed update is visible on the very first visit; fall back to the
 *    cached copy only when the network fails, then to the precached /offline
 *    fallback. (Stale-while-revalidate was rejected: it served one stale
 *    render per deploy, so freshly updated numbers looked wrong to anyone
 *    checking right after a release.)
 *  - Static assets (/_next/static, /images, fonts): cache-first. They are
 *    content-hashed or immutable within a build.
 *  - Next.js RSC payload requests, /api/* and cross-origin traffic: never
 *    intercepted.
 *  - Every build gets a new stamp, so the install/activate cycle purges the
 *    previous build's caches — readers can never hit a stale cached page
 *    that references purged JS/CSS chunks.
 */

const STAMP = "__BUILD_STAMP__";

const PAGE_CACHE = `dc254-pages-${STAMP}`;
const ASSET_CACHE = `dc254-assets-${STAMP}`;
const CORE_CACHE = "dc254-core-v1";
const OFFLINE_URL = "/offline";
const ASSET_CACHE_LIMIT = 400;

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE_CACHE);
      await cache.add(OFFLINE_URL);
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names
          .filter(
            (n) =>
              n.startsWith("dc254-") &&
              n !== PAGE_CACHE &&
              n !== ASSET_CACHE &&
              n !== CORE_CACHE
          )
          .map((n) => caches.delete(n))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/images/") ||
    url.pathname.startsWith("/icons/") ||
    url.pathname === "/favicon.ico" ||
    url.pathname === "/logo-icon.png" ||
    url.pathname === "/apple-touch-icon.png" ||
    /\.(?:png|jpe?g|webp|avif|gif|svg|ico|woff2?|ttf|css|js)$/i.test(
      url.pathname
    )
  );
}

// Keep the asset cache bounded (FIFO trim) so /_next/image variants,
// photo pools and JS chunks never grow unbounded on a reader's device.
async function trimAssetCache(cache) {
  const keys = await cache.keys();
  if (keys.length <= ASSET_CACHE_LIMIT) return;
  const excess = keys.length - ASSET_CACHE_LIMIT;
  for (let i = 0; i < excess; i++) await cache.delete(keys[i]);
}

async function cacheFirst(request, event) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok && fresh.type === "basic") {
      event.waitUntil(
        (async () => {
          await cache.put(request, fresh.clone());
          await trimAssetCache(cache);
        })()
      );
    }
    return fresh;
  } catch (err) {
    return new Response("", { status: 504, statusText: "Offline" });
  }
}

async function networkFirstPage(request, event) {
  const cache = await caches.open(PAGE_CACHE);

  try {
    const fresh = await fetch(request, { cache: "no-cache" });
    if (fresh && fresh.ok) {
      event.waitUntil(cache.put(request, fresh.clone()));
      return fresh;
    }
    // Server error (5xx/404): show whatever we have, else the offline page.
    const fallback =
      (await cache.match(request)) ||
      (await caches.open(CORE_CACHE)).match(OFFLINE_URL);
    return fallback || fresh;
  } catch (err) {
    // Network unreachable: cached copy keeps the site usable, else offline.
    const fallback =
      (await cache.match(request)) ||
      (await caches.open(CORE_CACHE)).match(OFFLINE_URL);
    return (
      fallback ||
      new Response("You are offline.", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      })
    );
  }
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return; // GA, Vercel analytics…
  if (url.pathname.startsWith("/api/")) return; // newsletter signup etc.
  // Next.js client-router (RSC) payloads must always come from the network —
  // serving cached flight data against fresh HTML breaks hydration.
  if (request.headers.get("RSC") || url.searchParams.has("_rsc")) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstPage(request, event));
    return;
  }
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, event));
  }
});
