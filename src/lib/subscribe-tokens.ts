/**
 * Signed, single-purpose links for the double opt-in subscription lifecycle
 * (verify + unsubscribe). HMAC-SHA256 over an action:email:expiry payload.
 *
 * Threat model: tokens travel in email links, so they must not be forgeable,
 * enumerable, or reusable past their lifetime. Signatures are compared
 * timing-safely and the secret never leaves the server.
 *
 * Environment variables:
 *   SUBSCRIBE_SECRET  (required in production, >= 32 chars)
 *                     generate with: openssl rand -base64 48
 *
 * Without it the confirmation flow is disabled (subscribe fails closed in
 * production, matching the contact-route pattern); dev falls back to a
 * fixed insecure secret so the flow can be exercised locally.
 */

import { createHmac, timingSafeEqual } from "crypto";

export type TokenAction = "verify" | "unsubscribe";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function signingSecret(): string {
  const s = process.env.SUBSCRIBE_SECRET;
  if (s && s.trim().length >= 32) return s.trim();
  if (process.env.NODE_ENV === "production") {
    console.error(
      "[subscribe-tokens] SUBSCRIBE_SECRET missing or too short in production - confirmation links cannot be issued/validated"
    );
    return "";
  }
  return "dev-only-insecure-secret-do-not-use-in-production";
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString("base64url");
}

export function signActionToken(
  email: string,
  action: TokenAction,
  ttlSeconds = 7 * 24 * 3600
): string | null {
  const key = signingSecret();
  if (!key) return null;
  const normalized = email.trim().toLowerCase();
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const payload = `${action}:${normalized}:${exp}`;
  const sig = createHmac("sha256", key).update(payload).digest("base64url");
  return `${b64url(payload)}.${sig}`;
}

/**
 * Validate a token for the given action. Returns the email it was issued
 * for, or null when the token is malformed, forged, expired, or for a
 * different action. Never throws.
 */
export function verifyActionToken(
  token: string | null | undefined,
  action: TokenAction
): { email: string } | null {
  const key = signingSecret();
  if (!key || !token) return null;

  const dot = token.indexOf(".");
  if (dot <= 0 || dot === token.length - 1) return null;

  let payload: string;
  let sig: string;
  try {
    payload = Buffer.from(token.slice(0, dot), "base64url").toString("utf8");
    sig = token.slice(dot + 1);
  } catch {
    return null;
  }

  const expected = createHmac("sha256", key).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  const parts = payload.split(":");
  if (parts.length !== 3) return null;

  const [act, email, expRaw] = parts;
  if (act !== action || !EMAIL_REGEX.test(email)) return null;

  const exp = Number(expRaw);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;

  return { email };
}
