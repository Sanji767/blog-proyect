import { NextResponse, type NextRequest } from "next/server";

// Spanish-speaking countries (ISO 3166-1 alpha-2). Visitors from these
// countries are offered Spanish; everyone else is offered English.
const SPANISH_SPEAKING_COUNTRIES = new Set([
  "ES",
  "MX",
  "AR",
  "CO",
  "CL",
  "PE",
  "VE",
  "EC",
  "GT",
  "CU",
  "BO",
  "DO",
  "HN",
  "PY",
  "SV",
  "NI",
  "CR",
  "PA",
  "UY",
  "PR",
  "GQ",
]);

const BOT_PATTERN =
  /bot|crawler|spider|slurp|facebookexternal|twitterbot|linkedinbot|whatsapp|telegram|googlebot|bingbot|duckduckbot|baiduspider|yandex|semrush|ahrefs|screaming[ -]?frog|applebot|ia_archiver|gptbot|claudebot|perplexitybot/i;

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Crawlers never get the language prompt.
  const userAgent = request.headers.get("user-agent") ?? "";
  if (BOT_PATTERN.test(userAgent)) return response;

  // A recorded language choice suppresses the suggestion entirely.
  if (request.cookies.has("feu-locale-choice")) return response;

  // Country from Vercel's geo header; Accept-Language as fallback (local dev,
  // non-Vercel previews, or a missing header).
  const country = request.headers
    .get("x-vercel-ip-country")
    ?.toUpperCase();
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const primaryLang = acceptLanguage
    .split(",")[0]
    ?.trim()
    .toLowerCase();

  const isSpanishCountry =
    !!country && SPANISH_SPEAKING_COUNTRIES.has(country);
  const isSpanishLanguage = !!primaryLang && primaryLang.startsWith("es");

  const suggest = isSpanishCountry || isSpanishLanguage ? "es" : "en";

  // Avoid re-setting the same cookie on every request.
  if (request.cookies.get("feu-suggest")?.value === suggest) return response;

  response.cookies.set("feu-suggest", suggest, {
    path: "/",
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|api|favicon.ico|sitemap.xml|robots.txt|studio).*)",
  ],
};
