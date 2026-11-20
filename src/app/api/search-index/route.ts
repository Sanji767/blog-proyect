// src/app/api/search-index/route.ts
//
// Search index for the on-site search (audit finding A22).
//
// Serves a small JSON index of every article (MDX + Sanity, ES + EN) built
// server-side from the existing getAllPostPreviews() helper, which already
// merges local MDX with Sanity (Sanity wins on slug collision) and applies
// the language filter. The response is cached for 1 hour (route-level
// revalidation + CDN s-maxage), so a new article becomes searchable at most
// an hour after deploy — no build step, no extra dependency.
//
// Why a route handler instead of a build-time public/search-index.json:
// - It reuses lib/blog.ts as-is (a prebuild script would have to duplicate
//   the MDX parsing + Sanity query logic outside Next.js).
// - Sanity content can change without a redeploy; the hourly revalidation
//   picks it up, while a build-time file would go stale until the next build.
// - At ~90 posts the payload is ~30 KB, cheap to serve and to cache.
//
// Index entries carry the article's real URL (/blog/<slug> or
// /en/blog/<slug>), so the client never has to reconstruct routes.
import { NextResponse } from "next/server";

import { getAllPostPreviews } from "@/lib/blog";
import type { BlogPostPreview } from "@/lib/blog/types";
import { withLocale, type Locale } from "@/lib/i18n";
import type { SearchIndex, SearchIndexPost } from "@/lib/search";

export const runtime = "nodejs";
export const revalidate = 3600;

const REVALIDATE_SECONDS = 3600;

function toEntry(post: BlogPostPreview, locale: Locale): SearchIndexPost {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description ?? "",
    category: post.category ?? "general",
    tags: post.tags ?? [],
    date: post.date,
    locale,
    url: withLocale(`/blog/${post.slug}`, locale),
  };
}

export async function GET() {
  const [esPosts, enPosts] = await Promise.all([
    getAllPostPreviews("es"),
    getAllPostPreviews("en"),
  ]);

  const byUrl = new Map<string, SearchIndexPost>();
  for (const post of esPosts) {
    const entry = toEntry(post, "es");
    byUrl.set(entry.url, entry);
  }
  for (const post of enPosts) {
    const entry = toEntry(post, "en");
    byUrl.set(entry.url, entry);
  }

  const posts = Array.from(byUrl.values()).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const index: SearchIndex = {
    generatedAt: new Date().toISOString(),
    count: posts.length,
    posts,
  };

  return NextResponse.json(index, {
    headers: {
      // Same caching pattern as /api/rates: edge/CDN cache + stale-while-revalidate.
      "Cache-Control": `public, max-age=0, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=86400`,
    },
  });
}
