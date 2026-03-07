// src/components/blog/NewsPostCard.tsx
"use client";

import { motion } from "framer-motion";

import type { BlogPostPreview } from "@/lib/blog/types";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";

function humanizeSlug(value: string): string {
  const normalized = value.trim().replace(/-/g, " ");
  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : value;
}

function formatDate(value: string, locale: "es" | "en"): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function NewsPostCard({
  post,
  index = 0,
  showDescription = false,
}: {
  post: BlogPostPreview;
  index?: number;
  showDescription?: boolean;
}) {
  const { locale } = useLocale();
  const href = `/blog/${post.slug}`;
  const dateLabel = formatDate(post.date, locale);
  const categoryLabel = humanizeSlug(post.category || "general");
  const description =
    (post.description ?? "").trim() || (post.excerpt ?? "").trim() || "";

  const featuredLabel = locale === "en" ? "Featured" : "Destacado";

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: "easeOut" }}
      whileHover={{ y: -6 }}
      className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent"
    >
      <div className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />

      <LocalizedLink
        href={href}
        className="block p-7 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
      >
        <div className="flex items-center justify-between gap-4 text-xs">
          <p className="font-semibold uppercase tracking-[0.22em] text-primary">
            {categoryLabel}
          </p>
          <time dateTime={post.date} className="text-secondary-foreground/75">
            {dateLabel}
          </time>
        </div>

        <h3 className="mt-5 text-balance text-2xl font-black leading-tight text-accent md:text-3xl">
          {post.title}
          <span className="ml-2 inline-block translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            →
          </span>
        </h3>

        {showDescription && description ? (
          <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-secondary-foreground/80">
            {description}
          </p>
        ) : null}

        <div className="mt-6 text-xs text-secondary-foreground/70">
          {post.readingTime ? <span>{post.readingTime}</span> : null}
          {post.featured ? (
            <>
              {post.readingTime ? (
                <span aria-hidden="true" className="mx-2 opacity-40">
                  /
                </span>
              ) : null}
              <span className="font-semibold text-accent-foreground">
                {featuredLabel}
              </span>
            </>
          ) : null}
        </div>
      </LocalizedLink>
    </motion.article>
  );
}
