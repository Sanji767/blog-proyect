// src/app/layout.tsx

import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";
import { Suspense } from "react";

import GoogleAnalyticsLoader from "@/components/analytics/GoogleAnalyticsLoader";
import AppChrome from "@/components/layout/AppChrome";
import { toJsonLd } from "@/lib/seo";

import "./globals.css";

// Fuente principal
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finanzaseu.com"),

  title: {
    default: "Comparativa de bancos digitales y validador IBAN (2026) | FinanzasEU",
    template: "%s • FinanzasEU",
  },

  description:
    "Guía independiente para elegir banco en Europa: comisiones, IBAN europeo, requisitos y enlaces oficiales. Comparativa y herramientas gratis (IBAN scanner). Actualizado en 2026.",

  keywords: [
    "mejores bancos 2026",
    "banco con iban europeo",
    "cuentas sin comisiones",
    "mejor banco online",
    "revolut vs n26",
    "banco europeo españa",
  ],

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
        url: "/og-escalada.png",
        width: 1200,
        height: 630,
        alt: "Comparativa de bancos digitales",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Comparativa de bancos digitales (2026)",
    description:
      "Guía independiente: comisiones, IBAN, requisitos y enlaces oficiales. Actualizado en 2026.",
    images: ["/og-escalada.png"],
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

  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        url: "/favicon.png",
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
        className={`${manrope.className} ${manrope.variable} antialiased bg-background text-foreground`}
      >
        {/* Google Analytics (GA4): se carga solo tras aceptar cookies */}
        {gaId ? (
          <Suspense fallback={null}>
            <GoogleAnalyticsLoader gaId={gaId} />
          </Suspense>
        ) : null}

        {/* Tema claro/oscuro */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
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
              logo: "https://finanzaseu.com/logo.png",
            }),
          }}
        />
      </body>
    </html>
  );
}
