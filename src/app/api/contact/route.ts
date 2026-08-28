import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const CONTACT_EMAIL = "elmaccommunicationslimited@gmail.com";
const FROM_NAME = "Data Centre 254";

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
      // No API key configured — fall back to console.log (dev mode)
      console.log("--- Contact Form Submission (no RESEND_API_KEY) ---");
      console.log(`Name: ${cleanName}`);
      console.log(`Email: ${email}`);
      console.log(`Subject: ${cleanSubject}`);
      console.log(`Message: ${cleanMessage.substring(0, 200)}${cleanMessage.length > 200 ? "..." : ""}`);
      console.log("-------------------------------------------");
      return NextResponse.json({ success: true });
    }

    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${getFromAddress()}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject: `[DC254 Contact] ${cleanSubject}`,
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 560px; margin: 0 auto; padding: 24px;">
          <div style="border-bottom: 2px solid #0ea5e9; padding-bottom: 16px; margin-bottom: 24px;">
            <h2 style="margin: 0; font-size: 18px; color: #0ea5e9;">DC254 Contact Form</h2>
          </div>
          <table style="width: 100%; font-size: 14px; line-height: 1.6;">
            <tr><td style="color: #888; width: 100px; vertical-align: top;">Name</td><td style="font-weight: 500;">${cleanName}</td></tr>
            <tr><td style="color: #888; vertical-align: top;">Email</td><td><a href="mailto:${email}" style="color: #0ea5e9;">${email}</a></td></tr>
            <tr><td style="color: #888; vertical-align: top;">Subject</td><td style="font-weight: 500;">${cleanSubject}</td></tr>
            <tr><td style="color: #888; vertical-align: top;">Message</td><td>${cleanMessage.replace(/\n/g, "<br>")}</td></tr>
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
