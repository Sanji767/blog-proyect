// src/app/layout.tsx
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Manrope, Source_Sans_3 } from "next/font/google";
import { ThemeProvider } from "next-themes";

import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteDetails } from "@/data/siteDetails";

import "./globals.css";

const manrope = Manrope({ subsets: ["latin"] });
const sourceSans = Source_Sans_3({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: siteDetails.metadata.title,
  description: siteDetails.metadata.description,
  openGraph: {
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    url: siteDetails.siteUrl,
    type: "website",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 675,
        alt: siteDetails.siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteDetails.metadata.title,
    description: siteDetails.metadata.description,
    images: ["/images/twitter-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${manrope.className} ${sourceSans.className} antialiased bg-background text-foreground`}
      >
        {siteDetails.googleAnalyticsId && (
          <GoogleAnalytics gaId={siteDetails.googleAnalyticsId} />
        )}

        {/* Muy importante para que useTheme del Header funcione */}
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Header />
          {/* padding para no quedar tapado por el header fijo */}
          <main className="pt-20 md:pt-24">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
