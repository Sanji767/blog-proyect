import "server-only";

import { getSanityClient } from "@/sanity/lib/client";

type SanityFetchOptions = {
  tags?: string[];
  revalidate?: number;
};

export async function sanityFetch<T>(
  query: string,
  params: Record<string, unknown> = {},
  options: SanityFetchOptions = {},
): Promise<T> {
  const { tags, revalidate } = options;

  return getSanityClient().fetch<T>(
    query,
    params,
    // `next` is a Next.js-specific extension (supported by `next-sanity`).
    { next: { tags, revalidate } } as never,
  );
}
