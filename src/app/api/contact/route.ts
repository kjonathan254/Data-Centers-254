import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, clientIp } from "@/lib/rate-limit";

const CONTACT_EMAIL = "elmaccommunicationslimited@gmail.com";
const FROM_NAME = "Data Centre 254";

// Contact form is an abuse magnet (mail-bombing to the inbox + Resend quota
// burn): 5 sends per minute per IP, on top of the global proxy.ts limiter.
// Persistent (Upstash) when configured, see src/lib/rate-limit.ts.
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;

/** Escape a value for safe interpolation into the HTML email body. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function getFromAddress(): string {
  // If a verified custom domain is set, use it. Otherwise Resend provides onboarding@resend.dev
  return process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
}

function sanitize(str: string, maxLen: number): string {
  return str.replace(/[<>]/g, "").substring(0, maxLen);
}

export async function POST(req: NextRequest) {
  const ip = clientIp(req);
  if ((await rateLimit("contact", ip, RATE_LIMIT, WINDOW_MS)).limited) {
    return NextResponse.json(
      { error: "Too many messages. Please wait a minute." },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Sanitize inputs
    const cleanName = sanitize(name, 100);
    const cleanSubject = sanitize(subject, 200);
    const cleanMessage = sanitize(message, 5000);

    const resend = getResendClient();

    if (!resend) {
      // Security audit remediation: the old fallback logged the submitter's
      // name, email, subject and message preview to server logs AND still
      // returned success to the visitor — real messages were effectively
      // lost and personal data landed in logs with unknown retention.
      // Production now fails closed with a clear temporary-service error;
      // local dev keeps a PII-free line so the flow stays testable.
      if (process.env.NODE_ENV === 'production') {
        console.error(
          '[contact] RESEND_API_KEY is not configured — submission rejected (fail closed). Configure the key and redeploy.'
        );
        return NextResponse.json(
          {
            error:
              'The message service is temporarily unavailable. Please try again shortly or use the address listed on the contact page.',
          },
          { status: 503 }
        );
      }
      console.log(
        '[contact] dev fallback: submission accepted (email delivery not configured, contents not logged)'
      );
      return NextResponse.json({ success: true });
    }

    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${getFromAddress()}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[DC254 Contact] ${escapeHtml(cleanSubject)}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <div style="border-bottom: 2px solid #0ea5e9; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-size: 18px; color: #0ea5e9;">DC254 Contact Form</h2>
          </div>
          <table style="width: 100%; font-size: 14px; line-height: 1.6;">
            <tr><td style="color: #888; width: 100px; vertical-align: top;">Name</td><td style="font-weight: 500;">${escapeHtml(cleanName)}</td></tr>
            <tr><td style="color: #888; vertical-align: top;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color: #0ea5e9;">${escapeHtml(email)}</a></td></tr>
            <tr><td style="color: #888; vertical-align: top;">Subject</td><td style="font-weight: 500;">${escapeHtml(cleanSubject)}</td></tr>
            <tr><td style="color: #888; vertical-align: top;">Message</td><td>${escapeHtml(cleanMessage).replace(/\n/g, "<br>")}</td></tr>
          </table>
          <div style="margin-top: 32px; padding-top: 16px; border-top: 1px solid #222; font-size: 12px; color: #666;">
            Sent from Data Centre 254 contact form
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
