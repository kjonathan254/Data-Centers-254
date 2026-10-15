import { NextRequest, NextResponse } from "next/server";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import {
  isSameOriginRequest,
  originRejectedResponse,
} from "@/lib/api-guards";
import {
  saveEnquiry,
  enquiryReference,
  storageConfigured,
  BUYER_TYPES,
  PREFERRED_FORMATS,
  type BuyerType,
  type PreferredFormat,
} from "@/lib/opportunity-brief-store";

/**
 * POST /api/opportunity-brief/inquiry
 *
 * Buyer enquiry capture for the Kenya Data Centre Opportunity Brief
 * (/opportunity-brief). Phase 1 of the 2026-10-15 product blueprint: no
 * checkout, no accounts - a qualified enquiry lands in persistent storage
 * and a human follows up.
 *
 * Fail-closed by design (audit D01 lineage): this is a *commercial* pipeline,
 * so when Upstash is not configured or unreachable the route answers 503 and
 * the form tells the buyer to email instead. A buyer enquiry must never
 * disappear into a serverless instance's memory during a redeploy.
 *
 * Guards: same-origin, 5 enquiries/min/IP, 10 KB body ceiling, honeypot,
 * email validation, allow-listed buyer type + format, required consent,
 * sanitised free text, privacy-version + referrer/UA recorded.
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT = 5;
const WINDOW_MS = 60_000;
const MAX_BODY_BYTES = 10_000;

const FIELD_LIMITS = {
  name: 100,
  organisation: 120,
  role: 80,
  question: 2000,
} as const;

function clean(raw: unknown, max: number): string {
  return typeof raw === "string"
    ? raw.replace(/[<>]/g, "").trim().slice(0, max)
    : "";
}

export async function POST(req: NextRequest) {
  // CSRF guard: reject cross-site form posts before any limiter/store spend.
  if (!isSameOriginRequest(req)) return originRejectedResponse();

  const ip = clientIp(req);
  if ((await rateLimit("ob-inquiry", ip, RATE_LIMIT, WINDOW_MS)).limited) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute." },
      { status: 429 }
    );
  }

  // Fail closed before parsing when the persistent backend is absent, so a
  // misconfigured deployment can never accept enquiries it would lose.
  if (!storageConfigured()) {
    console.error(
      "[ob-inquiry] UPSTASH_REDIS_REST_URL/TOKEN not configured - enquiry rejected (fail closed). Configure persistent storage and redeploy."
    );
    return NextResponse.json(
      {
        error:
          "The enquiry service is temporarily unavailable. Please try again shortly, or email elmaccommunicationslimited@gmail.com.",
      },
      { status: 503 }
    );
  }

  const declared = Number(req.headers.get("content-length") ?? "0");
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  try {
    const body = await req.json().catch(() => null);

    // Honeypot: pretend success, record nothing.
    if (typeof body?.website === "string" && body.website.trim() !== "") {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    const name = clean(body?.name, FIELD_LIMITS.name);
    const emailRaw =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
    const organisation = clean(body?.organisation, FIELD_LIMITS.organisation);
    const role = clean(body?.role, FIELD_LIMITS.role);
    const question = clean(body?.question, FIELD_LIMITS.question);
    const buyerType = String(body?.buyerType ?? "") as BuyerType;
    const preferredFormat = String(body?.preferredFormat ?? "") as PreferredFormat;
    const consent = body?.consent === true;

    if (!name || !emailRaw) {
      return NextResponse.json(
        { error: "Name and work email are required." },
        { status: 400 }
      );
    }
    if (emailRaw.length > 254 || !EMAIL_REGEX.test(emailRaw)) {
      return NextResponse.json(
        { error: "Enter a valid email address." },
        { status: 400 }
      );
    }
    if (!question) {
      return NextResponse.json(
        { error: "Tell us the decision you are trying to make." },
        { status: 400 }
      );
    }
    if (!BUYER_TYPES.includes(buyerType)) {
      return NextResponse.json(
        { error: "Choose the option that best describes your organisation." },
        { status: 400 }
      );
    }
    if (!PREFERRED_FORMATS.includes(preferredFormat)) {
      return NextResponse.json(
        { error: "Choose what you are interested in." },
        { status: 400 }
      );
    }
    if (!consent) {
      return NextResponse.json(
        { error: "We need your consent to reply before you can submit." },
        { status: 400 }
      );
    }

    const record = await saveEnquiry({
      name,
      email: emailRaw,
      organisation,
      role,
      buyerType,
      question,
      preferredFormat,
      privacyVersion: "2026-10-15",
      consent: true,
      referrer: clean(req.headers.get("referer") ?? "", 300),
      userAgent: clean(req.headers.get("user-agent") ?? "", 300),
    });

    return NextResponse.json(
      { ok: true, reference: enquiryReference(record.id) },
      { status: 201 }
    );
  } catch (err) {
    // Storage unreachable: fail closed (503), never pretend success.
    console.error("[ob-inquiry] enquiry not stored:", err);
    return NextResponse.json(
      {
        error:
          "The enquiry service is temporarily unavailable. Please try again shortly, or email elmaccommunicationslimited@gmail.com.",
      },
      { status: 503 }
    );
  }
}
