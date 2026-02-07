// src/app/blog/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { getCategories, getTags } from "@/lib/blog";
import Container from "@/components/layout/Container";
import BlogAside from "@/components/blog/BlogAside";

export const metadata: Metadata = {
  title: "Blog de Bancos Digitales, Comisiones y Guías 2025 | FinanzasEU",
  description:
    "Guías prácticas sobre bancos digitales, IBAN europeo, comisiones, multidivisa y finanzas para vivir o trabajar en Europa. Actualizado a noviembre 2025.",
  openGraph: {
    title: "Blog FinanzasEU — Guías, Bancos y Consejos 2025",
    description:
      "Artículos reales y comparativas sobre los mejores bancos digitales de Europa.",
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
  const categories = getCategories();
  const tags = getTags();

  return (
    <Container className="py-12 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        {/* CONTENIDO PRINCIPAL */}
        <div className="space-y-12 min-w-0">
          {children}
        </div>

        <BlogAside categories={categories} tags={tags} />
      </div>
    </Container>
  );
}
