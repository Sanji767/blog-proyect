import Link from "next/link";
import { getCategories, getTags } from "@/lib/blog";
import type { Locale } from "@/lib/i18n";
import { withLocale } from "@/lib/i18n";

const COPY: Record<Locale, { summary: string; categories: string; tags: string }> = {
  es: {
    summary: "Explorar categorías y tags",
    categories: "Categorías",
    tags: "Tags",
  },
  en: {
    summary: "Explore categories and tags",
    categories: "Categories",
    tags: "Tags",
  },
};

export default async function BlogExplore({ locale = "es" }: { locale?: Locale } = {}) {
  const [categories, tags] = await Promise.all([getCategories(locale), getTags(locale)]);
  if (categories.length === 0 && tags.length === 0) return null;

  const copy = COPY[locale];

  return (
    <section className="mt-16">
      <details className="rounded-2xl border border-border/50 bg-background/60 p-6 backdrop-blur">
        <summary className="cursor-pointer text-sm font-semibold text-foreground/90">
          {copy.summary}
        </summary>

        <div className="mt-6 grid gap-10 md:grid-cols-2">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {copy.categories}
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {categories.map((cat) => (
                <li key={cat.slug}>
                  <Link
                    href={withLocale(
                      `/blog/categoria/${encodeURIComponent(cat.slug)}`,
                      locale,
                    )}
                    className="group inline-flex w-full items-center justify-between rounded-xl px-3 py-2 transition hover:bg-muted/60"
                  >
                    <span className="font-medium text-foreground/90 group-hover:text-foreground">
                      {cat.title}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {cat.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              {copy.tags}
            </h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.slice(0, 24).map((tag) => (
                <Link
                  key={tag.slug}
                  href={withLocale(
                    `/blog/tag/${encodeURIComponent(tag.slug)}`,
                    locale,
                  )}
                  className="rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:border-border hover:text-foreground"
                >
                  #{tag.title}{" "}
                  <span className="opacity-60">({tag.count})</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}
