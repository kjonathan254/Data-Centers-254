/**
 * Best-effort Resend contact sync for the subscription lifecycle.
 *
 * The local newsletter store (see @/lib/newsletter-store) is the source of
 * truth for the media-kit numbers and the consent state. Resend is the
 * delivery vendor: contacts are added only after a subscriber confirms
 * (double opt-in, see /api/subscribe/verify) and removed on unsubscribe,
 * erasure, or hard bounce.
 *
 * Every function here is non-fatal by design: vendor outages or missing
 * configuration must never break the visitor-facing flow, they log instead.
 *
 * Environment variables:
 *   RESEND_API_KEY                    (optional) enables all Resend calls
 *   RESEND_SEGMENT_ID / RESEND_AUDIENCE_ID  (optional) target segment for
 *                                     newly confirmed contacts
 */

import { Resend } from "resend";

/** Never log a full subscriber address, PII belongs out of logs. */
export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "<redacted>";
  return `${local.slice(0, 2)}***@${domain.slice(0, 2)}***`;
}

export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

/** Add a confirmed subscriber as a contact. Idempotent on duplicates. */
export async function addContactToAudience(email: string): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  try {
    const segmentId =
      process.env.RESEND_SEGMENT_ID || process.env.RESEND_AUDIENCE_ID;
    const { error } = await resend.contacts.create({
      email,
      unsubscribed: false,
      ...(segmentId ? { segments: [{ id: segmentId }] } : {}),
    });
    if (error) {
      const message = (error.message || "").toLowerCase();
      if (!message.includes("already exists") && !message.includes("duplicate")) {
        console.error("[resend-audience] contact create failed:", error.message ?? error);
      }
    }
  } catch (err) {
    console.error(
      "[resend-audience] contact create threw (non-fatal):",
      err instanceof Error ? err.message : err
    );
  }
}

/**
 * Remove a contact from Resend entirely (unsubscribe / erasure / hard
 * bounce). Removal by email is idempotent; a missing contact just errors
 * and is logged. Never throws.
 */
export async function removeContactFromAudience(email: string): Promise<void> {
  const resend = getResendClient();
  if (!resend) return;
  try {
    const { error } = await resend.contacts.remove({ email });
    if (error) {
      console.error(
        "[resend-audience] contact removal failed:",
        error.message ?? error
      );
    }
  } catch (err) {
    console.error(
      "[resend-audience] contact removal threw (non-fatal):",
      err instanceof Error ? err.message : err
    );
  }
}
