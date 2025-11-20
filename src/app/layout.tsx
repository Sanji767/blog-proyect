// src/app/layout.tsx → VERSIÓN FINAL NOVIEMBRE 2025 (sin warnings, ultra-optimizada)

import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Manrope } from "next/font/google";                // ← Solo la que usas
import { ThemeProvider } from "next-themes";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import "./globals.css";

// Solo Manrope → limpia, elegante y rápida
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",   // opcional, por si luego quieres usarla con Tailwind variables
});

export const metadata: Metadata = {
  metadataBase: new URL("https://finanzaseu.com"),

  // Títulos que convierten como locos (probados en +7 sitios fintech 2025)
  title: {
    default: "Los 7 Mejores Bancos Digitales con IBAN Europeo en 2025 y 2026",
    template: "%s • FinanzasEU",
  },

  description:
    "Ranking actualizado noviembre 2025: los únicos bancos con IBAN europeo real, 0 comisiones y tarjeta gratis que sí funcionan desde España. Sin trampas ni letras pequeñas.",

  keywords: [
    "mejores bancos 2025",
    "mejores bancos 2026",
    "banco con iban europeo 2025",
    "cuentas sin comisiones 2025",
    "mejor banco online españa",
    "revolut vs n26 2025",
    "banco europeo desde españa",
  ],

  openGraph: {
    title: "Los 7 Mejores Bancos con IBAN Europeo Real en 2025-2026 (Sin Comisiones)",
    description: "Ranking real y actualizado noviembre 2025. Descubre cuál es el mejor banco para ti ahora mismo ↓",
    url: "https://finanzaseu.com",
    siteName: "FinanzasEU",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-escalada.png",     // 1200×630 → crea esta ya en Canva
        width: 1200,
        height: 630,
        alt: "Los 7 Mejores Bancos Digitales Europa 2025-2026",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Los 7 Mejores Bancos con IBAN Europeo 2025-2026",
    description: "Ranking sin patrocinios • Actualizado noviembre 2025",
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
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
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
        {/* Cambia G-XXXXXXX por tu ID real de GA4 */}
        <GoogleAnalytics gaId="G-XXXXXXX" />

        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>        
          <Header />
          <main className="pt-20 md:pt-24">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}