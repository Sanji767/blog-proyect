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

export default function EditorialPostRow({
  post,
  index = 0,
  dense = false,
  showDescription = true,
}: {
  post: BlogPostPreview;
  index?: number;
  dense?: boolean;
  showDescription?: boolean;
}) {
  const { locale } = useLocale();
  const href = `/blog/${post.slug}`;
  const dateLabel = formatDate(post.date, locale);
  const categoryLabel = humanizeSlug(post.category || "general");
  const description =
    (post.description ?? "").trim() ||
    (post.excerpt ?? "").trim() ||
    "";

  const featuredLabel = locale === "en" ? "Featured" : "Destacado";

  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay: index * 0.04, ease: "easeOut" }}
      className={[
        "group border-b border-border/50",
        dense ? "py-5" : "py-8 md:py-10",
      ].join(" ")}
    >
      <LocalizedLink href={href} className="block outline-none">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground">
          <time dateTime={post.date} className="font-medium">
            {dateLabel}
          </time>
          <span aria-hidden="true" className="text-border">
            /
          </span>
          <span className="font-medium uppercase tracking-[0.18em]">
            {categoryLabel}
          </span>
          {post.readingTime ? (
            <>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <span className="font-medium">{post.readingTime}</span>
            </>
          ) : null}
          {post.featured ? (
            <>
              <span aria-hidden="true" className="text-border">
                /
              </span>
              <span className="font-semibold text-primary">{featuredLabel}</span>
            </>
          ) : null}
        </div>

        <h2
          className={[
            "mt-3 text-balance font-semibold leading-tight tracking-tight transition-colors group-hover:text-primary",
            dense ? "text-lg md:text-xl" : "text-2xl md:text-3xl",
          ].join(" ")}
        >
          {post.title}
          <span className="ml-2 inline-block translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
            →
          </span>
        </h2>

        {showDescription && description ? (
          <p className="mt-3 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground line-clamp-2">
            {description}
          </p>
        ) : null}
      </LocalizedLink>
    </motion.li>
  );
}
