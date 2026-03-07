// src/app/en/blog/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "FinanzasEU Blog — banks, IBAN & fees (2026)",
  description:
    "Practical guides about digital banks, European IBANs, fees, multi-currency accounts and finance for living or working in Europe. Updated in 2026.",
  openGraph: {
    title: "FinanzasEU Blog — Guides & comparisons (2026)",
    description: "Real articles and comparisons about banking in Europe.",
    url: "https://finanzaseu.com/en/blog",
    siteName: "FinanzasEU",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-escalada.png",
        width: 1200,
        height: 630,
        alt: "FinanzasEU Blog",
      },
    ],
  },
};

export default function BlogLayoutEn({ children }: { children: ReactNode }) {
  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-6xl">{children}</Container>
    </div>
  );
}

