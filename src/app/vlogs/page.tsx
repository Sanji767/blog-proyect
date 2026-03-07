// src/app/vlogs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import VlogCard from "@/components/vlogs/VlogCard";
import { Button } from "@/components/ui/button";
import { vlogPreviews } from "@/lib/vlogs";

export const metadata: Metadata = {
  title: "Vlogs | FinanzasEU",
  description:
    "Vídeos y guías prácticas sobre banca digital, IBAN, comisiones y vida financiera en Europa.",
  alternates: {
    canonical: "/vlogs",
  },
};

type Props = {
  searchParams?: {
    tag?: string | string[];
  };
};

export default function VlogsPage({ searchParams }: Props) {
  const rawTag = Array.isArray(searchParams?.tag)
    ? searchParams?.tag[0]
    : searchParams?.tag;
  const activeTag = rawTag ? decodeURIComponent(rawTag).toLowerCase().trim() : null;

  const tagMap = new Map<string, number>();
  vlogPreviews.forEach((v) => {
    v.tags?.forEach((t) => {
      const slug = t.toLowerCase().trim();
      tagMap.set(slug, (tagMap.get(slug) || 0) + 1);
    });
  });

  const tags = Array.from(tagMap.entries())
    .map(([slug, count]) => ({ slug, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 12);

  const filtered = activeTag
    ? vlogPreviews.filter((v) => v.tags?.includes(activeTag))
    : vlogPreviews;

  const featured = !activeTag ? filtered.find((v) => v.featured) : undefined;
  const rest = featured
    ? filtered.filter((v) => v.slug !== featured.slug)
    : filtered;

  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <header className="mx-auto max-w-4xl space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Vlogs
          </p>

          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Vídeos y guías para elegir banco{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              sin perder tiempo
            </span>
            .
          </h1>

          <p className="mx-auto max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Resúmenes claros, ejemplos reales y comparativas sin humo. Filtra por
            tema y encuentra el vlog que encaja con tu situación.
          </p>

          {tags.length > 0 ? (
            <nav className="flex flex-wrap justify-center gap-2 pt-2">
              <Button
                asChild
                size="sm"
                variant={!activeTag ? "default" : "outline"}
                className="rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
              >
                <Link href="/vlogs">Todos</Link>
              </Button>

              {tags.map((t) => (
                <Button
                  key={t.slug}
                  asChild
                  size="sm"
                  variant={activeTag === t.slug ? "default" : "outline"}
                  className="rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
                >
                  <Link href={`/vlogs?tag=${encodeURIComponent(t.slug)}`}>
                    #{t.slug} ({t.count})
                  </Link>
                </Button>
              ))}
            </nav>
          ) : null}
        </header>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-border bg-card p-10 text-center shadow-soft">
            <p className="text-lg font-black">No hay vlogs para este tag.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba con otro filtro o vuelve a ver todos.
            </p>
            <div className="mt-6">
              <Button
                asChild
                className="rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
              >
                <Link href="/vlogs">Ver todos los vlogs</Link>
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {featured ? <VlogCard vlog={featured} variant="featured" /> : null}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((v, i) => (
                <VlogCard key={v.slug} vlog={v} index={i} />
              ))}
            </div>
          </div>
        )}

        <p className="mx-auto max-w-3xl text-center text-xs text-muted-foreground">
          ¿Quieres que analice un banco o un tema concreto?{" "}
          <Link
            href="/contacto"
            className="text-foreground underline-offset-4 hover:underline"
          >
            Escríbeme
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}

