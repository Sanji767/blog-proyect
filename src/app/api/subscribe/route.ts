// src/app/api/subscribe/route.ts
//
// Newsletter subscription endpoint (audit finding A16).
//
// Stores the subscriber in a Resend Audience via the Resend Contacts REST
// API (POST /audiences/{audience_id}/contacts). The repo does NOT install
// the `resend` SDK, so — like /api/lead and /api/contact — this route calls
// the REST API directly with fetch.
//
// Behaviour:
// - RESEND_AUDIENCE_ID configured  -> contact is created in that audience.
//   Response: { ok: true, stored: "audience" }.
// - RESEND_AUDIENCE_ID missing     -> graceful fallback: the owner is emailed
//   (same pattern as /api/lead) so the subscriber is not lost and can be
//   added manually. Response: { ok: true, stored: "email" }.
//   The UI shows different, honest copy for each case and NEVER claims the
//   subscription succeeded when nothing was stored.
// - Neither path available (no RESEND_API_KEY / no recipient) or the Resend
//   call fails -> 5xx with a generic message; the UI shows an error and the
//   user can retry. No silent success.
//
// A duplicate email (already in the audience) is treated as success:
// subscribing twice must be idempotent.
import { NextResponse } from "next/server";

import { getClientIp, isRateLimited } from "@/lib/rateLimit";

export const runtime = "nodejs";

const RESEND_API_BASE = "https://api.resend.com";
const RESEND_EMAILS_ENDPOINT = `${RESEND_API_BASE}/emails`;

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type SubscribePayload = {
  email?: unknown;
  locale?: unknown;
  source?: unknown;
  website?: unknown; // honeypot
};

type ResendErrorBody = {
  message?: unknown;
  error?: unknown;
};

/** Resend reports an already-subscribed email as an error; treat it as success. */
function isDuplicateContactError(body: unknown): boolean {
  if (!body || typeof body !== "object") return false;
  const { message, error } = body as ResendErrorBody;
  const text = [message, error]
    .map((v) => (typeof v === "string" ? v : ""))
    .join(" ")
    .toLowerCase();
  return text.includes("already exist");
}

async function addToAudience(
  resendApiKey: string,
  audienceId: string,
  email: string,
): Promise<{ ok: boolean; duplicate: boolean }> {
  const response = await fetch(
    `${RESEND_API_BASE}/audiences/${encodeURIComponent(audienceId)}/contacts`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    },
  );

  if (response.ok) return { ok: true, duplicate: false };

  const body = (await response.json().catch(() => null)) as unknown;
  if (isDuplicateContactError(body)) return { ok: true, duplicate: true };

  console.error(
    "Resend contacts error:",
    response.status,
    response.statusText,
    JSON.stringify(body)?.slice(0, 400),
  );
  return { ok: false, duplicate: false };
}

async function emailOwnerFallback(
  resendApiKey: string,
  fromEmail: string,
  toEmail: string,
  email: string,
  locale: string,
  source: string,
): Promise<boolean> {
  const subject =
    locale === "en"
      ? `[FinanzasEU] New newsletter subscriber (no audience configured)`
      : `[FinanzasEU] Nuevo suscriptor del boletín (sin audiencia configurada)`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.5">
      <h2>New newsletter subscriber</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Locale:</strong> ${escapeHtml(locale)}</p>
      <p><strong>Source:</strong> ${escapeHtml(source)}</p>
      <p><em>RESEND_AUDIENCE_ID is not configured, so this subscriber was NOT
      added to any list. Add them manually in Resend, or set
      RESEND_AUDIENCE_ID in Vercel so future signups are stored
      automatically.</em></p>
    </div>
  `.trim();

  const text = [
    "New newsletter subscriber",
    "",
    `Email: ${email}`,
    `Locale: ${locale}`,
    `Source: ${source}`,
    "",
    "RESEND_AUDIENCE_ID is not configured, so this subscriber was NOT added to any list. Add them manually in Resend, or set RESEND_AUDIENCE_ID in Vercel.",
  ].join("\n");

  const response = await fetch(RESEND_EMAILS_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      subject,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    console.error(
      "Resend error (subscribe fallback):",
      response.status,
      response.statusText,
      errorText.slice(0, 400),
    );
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  let payload: SubscribePayload;
  try {
    payload = (await request.json()) as SubscribePayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (isRateLimited(getClientIp(request))) {
    return NextResponse.json(
      { error: "Demasiadas peticiones. Inténtalo más tarde." },
      { status: 429 },
    );
  }

  const honeypot = String(payload.website ?? "").trim();
  if (honeypot) return NextResponse.json({ ok: true });

  const email = String(payload.email ?? "").trim();
  if (!email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  const localeRaw = String(payload.locale ?? "").toLowerCase().trim();
  const locale = localeRaw === "en" ? "en" : "es";

  const source = String(payload.source ?? "").trim().slice(0, 200) || "unknown";

  const resendApiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID?.trim();
  const toEmail = process.env.LEAD_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "FinanzasEU <onboarding@resend.dev>";

  if (!resendApiKey) {
    // Generic message on purpose: do not leak server config state (see A17).
    return NextResponse.json(
      { error: "Could not subscribe. Please try again later." },
      { status: 500 },
    );
  }

  // Primary path: store the contact in the Resend Audience.
  if (audienceId) {
    const result = await addToAudience(resendApiKey, audienceId, email);
    if (!result.ok) {
      return NextResponse.json(
        { error: "Could not subscribe. Please try again." },
        { status: 502 },
      );
    }
    return NextResponse.json({ ok: true, stored: "audience" });
  }

  // Fallback path: no audience configured — email the owner so the
  // subscriber is not lost. The UI reports this honestly (stored: "email").
  if (!toEmail) {
    return NextResponse.json(
      { error: "Could not subscribe. Please try again later." },
      { status: 500 },
    );
  }

  const emailed = await emailOwnerFallback(
    resendApiKey,
    fromEmail,
    toEmail,
    email,
    locale,
    source,
  );

  if (!emailed) {
    return NextResponse.json(
      { error: "Could not subscribe. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, stored: "email" });
}
