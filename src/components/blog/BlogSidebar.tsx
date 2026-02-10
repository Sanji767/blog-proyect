// src/components/blog/BlogSidebar.tsx
import Link from "next/link";
import { getCategories, getTags } from "@/lib/blog";

export default async function BlogSidebar() {
  const [categories, tags] = await Promise.all([getCategories(), getTags()]);

  return (
    <aside className="space-y-8 lg:sticky lg:top-24">
      {/* Categorías */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-5 text-foreground">
          Categorías
        </h3>
        <nav className="space-y-1">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/categoria/${cat.slug}`}
              className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-muted"
            >
              <span>{cat.title}</span>
              <span className="text-xs text-muted-foreground">
                ({cat.count})
              </span>
            </Link>
          ))}
        </nav>
      </section>

      {/* Tags populares */}
      <section className="rounded-3xl border bg-card p-6 shadow-sm">
        <h3 className="text-lg font-bold mb-5 text-foreground">
          Tags más usados
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.slice(0, 20).map((tag) => (
            <Link
              key={tag.slug}
              href={`/blog/tag/${tag.slug}`}
              className="rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20"
            >
              #{tag.title} ({tag.count})
            </Link>
          ))}
        </div>
      </section>

      {/* CTA bonito */}
      <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center text-white shadow-xl">
        <h3 className="text-xl font-bold mb-3">¿No encuentras lo que buscas?</h3>
        <p className="mb-6 opacity-90">
          Dime qué tema te interesa y escribo un artículo personalizado.
        </p>
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-bold text-primary shadow-lg hover:scale-105 transition"
        >
          Pídeme un artículo
        </Link>
      </div>
    </aside>
  );
}
