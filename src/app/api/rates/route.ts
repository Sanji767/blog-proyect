import { NextResponse } from "next/server";

export const runtime = "nodejs";

const PROVIDER_URL = "https://api.frankfurter.app/latest";
const REVALIDATE_SECONDS = 60 * 60; // 1h
const FETCH_TIMEOUT_MS = 4500;

function sanitizeCurrency(value: string | null): string | null {
  const upper = String(value ?? "").trim().toUpperCase();
  return /^[A-Z]{3}$/.test(upper) ? upper : null;
}

function sanitizeSymbols(value: string | null): string[] {
  const raw = String(value ?? "");
  const parts = raw
    .split(",")
    .map((p) => p.trim().toUpperCase())
    .filter(Boolean);

  const unique: string[] = [];
  for (const code of parts) {
    if (!/^[A-Z]{3}$/.test(code)) continue;
    if (unique.includes(code)) continue;
    unique.push(code);
    if (unique.length >= 10) break;
  }

  return unique;
}

type FrankfurterResponse = {
  amount?: number;
  base?: string;
  date?: string;
  rates?: Record<string, number>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const base = sanitizeCurrency(searchParams.get("base")) ?? "EUR";
  const symbols =
    sanitizeSymbols(searchParams.get("symbols")).join(",") || "USD,GBP,CHF,PLN";

  const url = new URL(PROVIDER_URL);
  url.searchParams.set("from", base);
  url.searchParams.set("to", symbols);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const upstream = await fetch(url.toString(), {
      signal: controller.signal,
      next: { revalidate: REVALIDATE_SECONDS },
      headers: {
        "User-Agent": "FinanzasEU/1.0 (+https://finanzaseu.com)",
        Accept: "application/json",
      },
    });

    if (!upstream.ok) {
      const errorText = await upstream.text().catch(() => "");
      console.error(
        "Rates upstream error:",
        upstream.status,
        upstream.statusText,
        errorText.slice(0, 400),
      );
      return NextResponse.json(
        { ok: false, error: "Upstream error" },
        { status: 502 },
      );
    }

    const data = (await upstream.json().catch(() => null)) as FrankfurterResponse | null;
    const rates = data?.rates ?? {};
    const date = String(data?.date ?? "").trim();
    const resolvedBase = sanitizeCurrency(String(data?.base ?? "")) ?? base;

    return NextResponse.json(
      {
        ok: true,
        provider: "frankfurter.app",
        base: resolvedBase,
        date: date || null,
        rates,
      },
      {
        headers: {
          // Keep API responses cacheable at the edge/CDN too.
          "Cache-Control": `public, max-age=0, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
        },
      },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Rates fetch failed:", message);
    return NextResponse.json(
      { ok: false, error: "Fetch failed" },
      { status: 502 },
    );
  } finally {
    clearTimeout(timeout);
  }
}

