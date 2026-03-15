import { NextResponse } from "next/server";

export const runtime = "nodejs";

const RESEND_ENDPOINT = "https://api.resend.com/emails";

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

type LeadPayload = {
  email?: unknown;
  locale?: unknown;
  source?: unknown;
  website?: unknown; // honeypot
};

export async function POST(request: Request) {
  let payload: LeadPayload;
  try {
    payload = (await request.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
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
  const toEmail = process.env.LEAD_TO_EMAIL ?? process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "FinanzasEU <onboarding@resend.dev>";

  if (!resendApiKey || !toEmail) {
    return NextResponse.json(
      { error: "Email is not configured on the server" },
      { status: 500 },
    );
  }

  const subject =
    locale === "en"
      ? `[FinanzasEU] New lead`
      : `[FinanzasEU] Nuevo lead`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.5">
      <h2>New lead</h2>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>Locale:</strong> ${escapeHtml(locale)}</p>
      <p><strong>Source:</strong> ${escapeHtml(source)}</p>
    </div>
  `.trim();

  const text = [
    "New lead",
    "",
    `Email: ${email}`,
    `Locale: ${locale}`,
    `Source: ${source}`,
  ].join("\n");

  const resendResponse = await fetch(RESEND_ENDPOINT, {
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

  if (!resendResponse.ok) {
    const errorText = await resendResponse.text().catch(() => "");
    console.error(
      "Resend error:",
      resendResponse.status,
      resendResponse.statusText,
      errorText,
    );
    return NextResponse.json(
      { error: "Could not send lead. Please try again." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

