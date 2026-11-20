// src/lib/curatedComparisons.ts
//
// Curated /comparar pairs (audit C5): the ONLY comparison pages that are
// indexed and listed in the sitemap. Everything else under /comparar —
// reverse-order pages (n26-vs-revolut) and pairs outside this set — stays
// reachable for visitors but carries `noindex` (see the [slug] templates).
//
// The 8 banks are the site's highest-profile names: the four flagship
// neobanks (Revolut, N26, Wise, bunq), the two largest Spanish banks
// (BBVA, Santander), the largest Dutch digital bank (ING) and the leading
// savings/broker hybrid (Trade Republic). 8 banks give 8×7/2 = 28
// unordered pairs — the "~30 most-searched pairs" the audit asked for.
// No per-pair search-volume data was available in the repo to rank pairs
// individually; refine this list later against Search Console queries.
//
// ORDER MATTERS: the banks are listed in the same order they appear in
// the `banks` array (src/lib/banks.ts), so the generated slugs match the
// canonical order the sitemap has always used (first bank in array order
// comes first in the slug, e.g. revolut-vs-n26, never n26-vs-revolut).
export const CURATED_COMPARISON_BANKS = [
  "revolut",
  "n26",
  "wise",
  "bunq",
  "santander",
  "bbva",
  "ing",
  "trade-republic",
] as const;

function buildCuratedSlugs(): string[] {
  const slugs: string[] = [];
  for (let i = 0; i < CURATED_COMPARISON_BANKS.length; i++) {
    for (let j = i + 1; j < CURATED_COMPARISON_BANKS.length; j++) {
      slugs.push(`${CURATED_COMPARISON_BANKS[i]}-vs-${CURATED_COMPARISON_BANKS[j]}`);
    }
  }
  return slugs;
}

/** The 28 canonical-order slugs of the curated pairs, in sitemap order. */
export const CURATED_COMPARISON_SLUGS: readonly string[] = buildCuratedSlugs();

const CURATED_COMPARISON_SLUG_SET = new Set(CURATED_COMPARISON_SLUGS);

/**
 * True only for a curated pair in canonical order. Reverse-order slugs
 * (n26-vs-revolut) and non-curated pairs (revolut-vs-dkb) return false.
 */
export function isCuratedComparisonSlug(slug: string): boolean {
  return CURATED_COMPARISON_SLUG_SET.has(slug.toLowerCase());
}
