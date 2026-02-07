// src/app/vlogs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import VlogCard from "@/components/vlogs/VlogCard";
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
        <header className="space-y-5 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-black uppercase tracking-wide text-primary">
            Vlogs FinanzasEU
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight">
            Vídeos y guías para elegir banco sin perder tiempo
          </h1>
          <p className="mx-auto max-w-3xl text-muted-foreground md:text-lg">
            Resúmenes claros, ejemplos reales y comparativas sin humo. Filtra por
            tema y encuentra el vlog que encaja con tu situación.
          </p>

          {tags.length > 0 && (
            <nav className="flex flex-wrap justify-center gap-2 pt-2">
              <Link
                href="/vlogs"
                className={[
                  "rounded-full px-4 py-2 text-xs font-bold transition",
                  activeTag
                    ? "border border-border bg-background hover:bg-muted/60"
                    : "bg-primary text-white",
                ].join(" ")}
              >
                Todos
              </Link>
              {tags.map((t) => (
                <Link
                  key={t.slug}
                  href={`/vlogs?tag=${encodeURIComponent(t.slug)}`}
                  className={[
                    "rounded-full border px-4 py-2 text-xs font-bold transition",
                    activeTag === t.slug
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border bg-background hover:bg-muted/60",
                  ].join(" ")}
                >
                  #{t.slug} ({t.count})
                </Link>
              ))}
            </nav>
          )}
        </header>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border bg-card p-10 text-center">
            <p className="text-lg font-semibold">No hay vlogs para este tag.</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Prueba con otro filtro o vuelve a ver todos.
            </p>
            <div className="mt-6">
              <Link
                href="/vlogs"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-black hover:brightness-105"
              >
                Ver todos los vlogs
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {featured && (
              <VlogCard vlog={featured} variant="featured" />
            )}

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {rest.map((v, i) => (
                <VlogCard key={v.slug} vlog={v} index={i} />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
}
