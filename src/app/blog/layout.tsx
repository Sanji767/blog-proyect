// src/app/blog/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import Container from "@/components/layout/Container";

export const metadata: Metadata = {
  title: "Blog de bancos digitales, IBAN y comisiones (2026) | FinanzasEU",
  description:
    "Guías prácticas sobre bancos digitales, IBAN europeo, comisiones, multidivisa y finanzas para vivir o trabajar en Europa. Actualizado en 2026.",
  openGraph: {
    title: "Blog FinanzasEU — Guías, bancos y consejos (2026)",
    description: "Artículos reales y comparativas sobre bancos en Europa.",
    url: "https://finanzaseu.com/blog",
    siteName: "FinanzasEU",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-escalada.png",
        width: 1200,
        height: 630,
        alt: "Blog FinanzasEU",
      },
    ],
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-6xl">{children}</Container>
    </div>
  );
}

