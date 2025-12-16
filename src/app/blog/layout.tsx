// src/app/blog/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";

import { getCategories } from "@/lib/blog/getCategories";
import { getTags, type Tag } from "@/lib/blog/getTags";
import Container from "@/components/layout/Container";

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
  const tags: Tag[] = getTags();

  return (
    <Container className="py-12 md:py-20">
      <div className="grid gap-12 lg:grid-cols-[1fr_300px]">
        {/* CONTENIDO PRINCIPAL */}
        <div className="space-y-12 min-w-0">
          {children}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-10">
          {/* Categorías */}
          <section className="rounded-3xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Categorías</h3>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={`/blog/categoria/${cat.slug}`}
                    className="flex items-center justify-between rounded-lg px-4 py-3 text-sm font-medium hover:bg-muted transition"
                  >
                    <span>{cat.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {cat.count} artículos
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* Tags */}
          <section className="rounded-3xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-bold mb-4">Tags populares</h3>
            <div className="flex flex-wrap gap-2">
              {tags.slice(0, 12).map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/blog/tag/${tag.slug}`}
                  className="rounded-full bg-primary/10 px-4 py-2 text-xs font-medium text-primary hover:bg-primary/20 transition"
                >
                  #{tag.title} ({tag.count})
                </Link>
              ))}
            </div>
          </section>

          {/* CTA Sidebar */}
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-white shadow-xl">
            <h3 className="text-xl font-bold mb-3">
              ¿Necesitas ayuda personalizada?
            </h3>
            <p className="mb-6 opacity-90">
              Te digo en 2 minutos qué bancos mirar según tu situación real.
            </p>
            <Link
              href="/contacto"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-primary shadow-lg hover:scale-105 transition"
            >
              Hablar conmigo gratis
            </Link>
          </div>
        </aside>
      </div>
    </Container>
  );
}
