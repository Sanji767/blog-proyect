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

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  country?: unknown;
  goal?: unknown;
  message?: unknown;
  website?: unknown; // honeypot
};

export async function POST(request: Request) {
  let payload: ContactPayload;
  try {
    payload = (await request.json()) as ContactPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const honeypot = String(payload.website ?? "").trim();
  if (honeypot) {
    return NextResponse.json({ ok: true });
  }

  const name = String(payload.name ?? "").trim();
  const email = String(payload.email ?? "").trim();
  const country = String(payload.country ?? "").trim() || "No indicado";
  const goal = String(payload.goal ?? "").trim() || "No indicado";
  const message = String(payload.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Nombre, email y mensaje son obligatorios" },
      { status: 400 },
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email inválido" }, { status: 400 });
  }

  if (message.length > 8000) {
    return NextResponse.json(
      { error: "El mensaje es demasiado largo" },
      { status: 400 },
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail =
    process.env.CONTACT_FROM_EMAIL ?? "FinanzasEU <onboarding@resend.dev>";

  if (!resendApiKey || !toEmail) {
    return NextResponse.json(
      { error: "Email no configurado en el servidor" },
      { status: 500 },
    );
  }

  const subject = `[FinanzasEU] Nuevo mensaje de ${name}`;

  const html = `
    <div style="font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; line-height:1.5">
      <h2>Nuevo mensaje de contacto</h2>
      <p><strong>Nombre:</strong> ${escapeHtml(name)}</p>
      <p><strong>Email:</strong> ${escapeHtml(email)}</p>
      <p><strong>País:</strong> ${escapeHtml(country)}</p>
      <p><strong>Objetivo:</strong> ${escapeHtml(goal)}</p>
      <hr />
      <p style="white-space:pre-wrap"><strong>Mensaje:</strong><br />${escapeHtml(message)}</p>
    </div>
  `.trim();

  const text = [
    "Nuevo mensaje de contacto",
    "",
    `Nombre: ${name}`,
    `Email: ${email}`,
    `País: ${country}`,
    `Objetivo: ${goal}`,
    "",
    "Mensaje:",
    message,
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
      { error: "No se pudo enviar el mensaje. Inténtalo de nuevo." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}

