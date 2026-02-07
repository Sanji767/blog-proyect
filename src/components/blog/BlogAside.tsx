// src/components/blog/BlogAside.tsx
"use client";

import Link from "next/link";
import { useSelectedLayoutSegment } from "next/navigation";
import TableOfContents from "@/components/blog/TableOfContents";

type Category = {
  slug: string;
  title: string;
  count: number;
};

type Tag = {
  slug: string;
  title: string;
  count: number;
};

export default function BlogAside({
  categories,
  tags,
}: {
  categories: Category[];
  tags: Tag[];
}) {
  const segment = useSelectedLayoutSegment();

  // /blog                 -> segment === null
  // /blog/tag/[tag]       -> segment === "tag"
  // /blog/categoria/...   -> segment === "categoria"
  // /blog/[slug]          -> segment === "<slug>"
  const isArticle =
    segment !== null && segment !== "tag" && segment !== "categoria";

  if (isArticle) {
    return (
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-8">
          <TableOfContents
            title="En este artículo"
            className="max-h-[calc(100vh-18rem)] overflow-auto"
          />

          <div className="rounded-3xl border bg-card p-6 shadow-sm">
            <h3 className="text-lg font-black tracking-tight">
              ¿Quieres una recomendación rápida?
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Dime tu país y para qué lo quieres (nómina, viajar, freelance) y te
              digo qué bancos mirar primero.
            </p>
            <div className="mt-5 grid gap-3">
              <Link
                href="/comparativa"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-3 text-sm font-black text-white shadow-lg hover:shadow-xl transition"
              >
                Ver comparativa
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-5 py-3 text-sm font-black text-foreground hover:bg-muted transition"
              >
                Hablar conmigo
              </Link>
            </div>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="space-y-10">
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
  );
}
