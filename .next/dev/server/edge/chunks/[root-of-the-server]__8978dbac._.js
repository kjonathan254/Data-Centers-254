(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__8978dbac._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/src/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
;
// Simple in-memory rate limiter (resets per deployment on Vercel serverless)
const rateLimitMap = new Map();
const RATE_LIMIT = 60; // requests per window
const WINDOW_MS = 60_000; // 1 minute window
function getRateLimitKey(req) {
    // Use CF-Connecting-IP (Cloudflare/Vercel) or fallback to X-Forwarded-For
    const ip = req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    return ip;
}
function middleware(req) {
    // Only rate-limit API routes (except the root /api health check)
    const { pathname } = req.nextUrl;
    if (!pathname.startsWith('/api/') || pathname === '/api') {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const key = getRateLimitKey(req);
    const now = Date.now();
    let entry = rateLimitMap.get(key);
    if (!entry || now > entry.resetAt) {
        entry = {
            count: 0,
            resetAt: now + WINDOW_MS
        };
        rateLimitMap.set(key, entry);
    }
    entry.count++;
    const remaining = Math.max(0, RATE_LIMIT - entry.count);
    const resetAt = Math.ceil(entry.resetAt / 1000);
    const res = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT));
    res.headers.set('X-RateLimit-Remaining', String(remaining));
    res.headers.set('X-RateLimit-Reset', String(resetAt));
    if (entry.count > RATE_LIMIT) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Too many requests. Please wait a moment.'
        }, {
            status: 429,
            headers: {
                'Retry-After': String(Math.ceil((entry.resetAt - now) / 1000)),
                'X-RateLimit-Limit': String(RATE_LIMIT),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': String(resetAt)
            }
        });
    }
    return res;
}
const config = {
    matcher: '/api/:path*'
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__8978dbac._.js.map