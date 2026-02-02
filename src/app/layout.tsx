// src/app/layout.tsx

import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Manrope } from "next/font/google";
import { ThemeProvider } from "next-themes";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CookieBanner from "@/components/CookieBanner";

// 🚀 Importamos el nuevo componente
import StickyPromo from "@/components/layout/StickyPromo"; 

import "./globals.css";

// Fuente principal
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finanzaseu.com"),

  title: {
    default: "Los 7 Mejores Bancos Digitales con IBAN Europeo en 2025 y 2026",
    template: "%s • FinanzasEU",
  },

  description:
    "Ranking actualizado noviembre 2025: bancos con IBAN europeo real, 0 comisiones y tarjeta gratis. Comparativa real sin patrocinio.",

  keywords: [
    "mejores bancos 2025",
    "mejores bancos 2026",
    "banco con iban europeo",
    "cuentas sin comisiones",
    "mejor banco online",
    "revolut vs n26",
    "banco europeo españa",
  ],

  openGraph: {
    title: "Los 7 Mejores Bancos con IBAN Europeo en 2025-2026",
    description: "Ranking real y actualizado. Descubre cuál es el mejor banco ahora mismo.",
    url: "https://finanzaseu.com",
    siteName: "FinanzasEU",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-escalada.png",
        width: 1200,
        height: 630,
        alt: "Comparativa bancos digitales 2025",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Los 7 Mejores Bancos Europeos 2025",
    description: "Comparativa real, sin patrocinio.",
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
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${manrope.className} ${manrope.variable} antialiased bg-background text-foreground`}
      >
        {/* Cambia G-XXXXXXX por tu GA4 real */}
        <GoogleAnalytics gaId="G-XXXXXXX" />

        {/* Tema claro/oscuro */}
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="pt-20 md:pt-24">{children}</main>
          <Footer />

          {/* 🚀 StickyPromo integrado aquí: Flotará sobre todas las páginas */}
          <StickyPromo />
        </ThemeProvider>

        {/* Banner de Cookies */}
        <CookieBanner />

        {/* Schema.org — mejora marca en Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
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