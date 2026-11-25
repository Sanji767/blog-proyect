// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

import GoogleAnalyticsLoader from "@/components/analytics/GoogleAnalyticsLoader";
import AppChrome from "@/components/layout/AppChrome";
import { DEFAULT_OG_IMAGE_URL, SITE_LOGO_URL, toJsonLd } from "@/lib/seo";

import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  adjustFontFallback: false,
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finanzaseu.com"),

  title: {
    default: "Comparativa de bancos digitales y validador IBAN (2026) | FinanzasEU",
    template: "%s • FinanzasEU",
  },

  description:
    "Guía independiente para elegir banco en Europa: comisiones, IBAN europeo, requisitos y enlaces oficiales. Comparativa y herramientas gratis.",

  openGraph: {
    title: "Comparativa de bancos digitales y validador IBAN (2026)",
    description:
      "Comisiones, IBAN, requisitos y enlaces oficiales para elegir banco con criterio. Actualizado en 2026.",
    url: "https://finanzaseu.com",
    siteName: "FinanzasEU",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: DEFAULT_OG_IMAGE_URL,
        width: 1376,
        height: 768,
        alt: "Comparativa de bancos digitales",
      },
    ],
  },

  // NOTE (A8): only `card` is set here on purpose. X/Twitter titles,
  // descriptions and images fall back to the per-page openGraph tags, which
  // are correct on every page; a root title/description would stamp the
  // homepage ES text on every article (including EN ones). The two homepages
  // keep their own page-specific twitter blocks.
  twitter: {
    card: "summary_large_image",
  },

  robots: {
    index: true,
    follow: true,
    "max-snippet": -1,
    "max-image-preview": "large",
    "max-video-preview": -1,
  },

  alternates: {
    canonical: "https://finanzaseu.com",
  },

  // Pinterest domain verification (added 25 Nov 2026 for the FinanzasEU
  // Pinterest business account claim).
  other: {
    "p:domain_verify": "6091eac9d53861e533bbe985c2e6ca7b",
  },

  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
    ],
    shortcut: "/favicon.svg",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        url: "/favicon.svg",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId =
    process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID ??
    process.env.GOOGLE_ANALYTICS_ID;

  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${inter.className} ${inter.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        {/* Google Analytics (GA4): opt-in — solo se carga si el usuario acepta las cookies de analítica */}
        {gaId ? (
          <Suspense fallback={null}>
            <GoogleAnalyticsLoader gaId={gaId} />
          </Suspense>
        ) : null}

        {/* Tema claro/oscuro (Modo día por defecto) */}
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AppChrome>{children}</AppChrome>
        </ThemeProvider>

        {/* Schema.org — mejora marca en Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "FinanzasEU",
              url: "https://finanzaseu.com",
              logo: SITE_LOGO_URL,
            }),
          }}
        />
      </body>
    </html>
  );
}
