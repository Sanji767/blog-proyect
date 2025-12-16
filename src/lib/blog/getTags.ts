// src/lib/blog/getTags.ts
import { blogPosts } from "./posts";

export type Tag = {
  slug: string;
  title: string;
  count: number;
};

export function getTags(): Tag[] {
  const tagMap = new Map<string, number>();

  blogPosts.forEach((post) => {
    post.tags?.forEach((tag) => {
      const normalized = tag.toLowerCase().trim();
      tagMap.set(normalized, (tagMap.get(normalized) || 0) + 1);
    });
  });

  return Array.from(tagMap.entries())
    .map(([slug, count]) => ({
      slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}