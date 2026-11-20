// src/lib/search.ts
//
// Shared types + pure search logic for the on-site search (audit finding A22).
// This module is importable from both server code (the /api/search-index
// route handler) and client code (the SearchBox component), so it must NOT
// import "server-only" or any server-only helper.

import type { Locale } from "@/lib/i18n";

export type SearchIndexPost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  date: string;
  locale: Locale;
  /** Full article URL, e.g. /blog/<slug> or /en/blog/<slug>. */
  url: string;
};

export type SearchIndex = {
  generatedAt: string;
  count: number;
  posts: SearchIndexPost[];
};

/** Lowercase + strip accents so "credito" matches "crédito", etc. */
export function normalizeSearchText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const TITLE_WEIGHT = 3;
const TAG_WEIGHT = 2;
const CATEGORY_WEIGHT = 2;
const DESCRIPTION_WEIGHT = 1;

/**
 * Rank posts for a query. Every query token must appear in at least one
 * searchable field (AND semantics). Results are ordered: current locale
 * first, then score, then newest date. Pure function — no I/O.
 */
export function searchPosts(
  posts: SearchIndexPost[],
  query: string,
  locale: Locale,
  limit = 8,
): SearchIndexPost[] {
  const tokens = normalizeSearchText(query)
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (tokens.length === 0) return [];

  const scored: Array<{ post: SearchIndexPost; score: number }> = [];

  for (const post of posts) {
    const title = normalizeSearchText(post.title);
    const description = normalizeSearchText(post.description);
    const category = normalizeSearchText(post.category);
    const tags = (post.tags ?? []).map((t) => normalizeSearchText(t));

    let score = 0;
    let allTokensMatch = true;

    for (const token of tokens) {
      let tokenScore = 0;
      if (title.includes(token)) tokenScore += TITLE_WEIGHT;
      if (tags.some((t) => t.includes(token))) tokenScore += TAG_WEIGHT;
      if (category.includes(token)) tokenScore += CATEGORY_WEIGHT;
      if (description.includes(token)) tokenScore += DESCRIPTION_WEIGHT;
      if (tokenScore === 0) {
        allTokensMatch = false;
        break;
      }
      score += tokenScore;
    }

    if (allTokensMatch) scored.push({ post, score });
  }

  return scored
    .sort((a, b) => {
      const localeDiff =
        Number(b.post.locale === locale) - Number(a.post.locale === locale);
      if (localeDiff !== 0) return localeDiff;
      if (b.score !== a.score) return b.score - a.score;
      return (
        new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
      );
    })
    .slice(0, limit)
    .map(({ post }) => post);
}
