// src/components/blog/LatestNewsRail.tsx
"use client";

import { useMemo, useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

import type { BlogPostPreview } from "@/lib/blog/types";
import NewsPostCard from "@/components/blog/NewsPostCard";
import { useLocale } from "@/components/i18n/LocaleProvider";

export default function LatestNewsRail({
  posts,
  title,
  subtitle,
}: {
  posts: BlogPostPreview[];
  title?: string;
  subtitle?: string;
}) {
  const { locale } = useLocale();
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  const copy =
    locale === "en"
      ? {
          defaultTitle: "Latest reads",
          defaultSubtitle: "Editorial pieces: clear, direct and distraction-free.",
          prev: "Previous",
          next: "Next",
        }
      : {
          defaultTitle: "Últimas lecturas",
          defaultSubtitle: "Piezas editoriales: claras, directas y sin distracciones.",
          prev: "Anterior",
          next: "Siguiente",
        };

  const resolvedTitle = title ?? copy.defaultTitle;
  const resolvedSubtitle = subtitle ?? copy.defaultSubtitle;

  const canScroll = useMemo(() => posts.length > 2, [posts.length]);

  const scrollByAmount = (direction: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;

    const amount = Math.max(240, Math.round(el.clientWidth * 0.85));
    el.scrollBy({ left: direction * amount, behavior: "smooth" });
  };

  if (posts.length === 0) return null;

  return (
    <section className="mt-12 space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h2 className="text-balance text-2xl font-black tracking-tight md:text-3xl">
            {resolvedTitle}
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {resolvedSubtitle}
          </p>
        </div>

        {canScroll ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByAmount(-1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-card text-foreground shadow-soft transition-colors hover:bg-muted"
              aria-label={copy.prev}
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => scrollByAmount(1)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-card text-foreground shadow-soft transition-colors hover:bg-muted"
              aria-label={copy.next}
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        ) : null}
      </header>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {posts.map((post, idx) => (
          <div
            key={post.slug}
            className="w-[320px] shrink-0 snap-start sm:w-[380px]"
          >
            <NewsPostCard post={post} index={idx} />
          </div>
        ))}
      </div>
    </section>
  );
}
