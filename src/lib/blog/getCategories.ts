// src/lib/blog/getCategories.ts
import { blogPosts } from "./posts";

export type Category = {
  slug: string;
  title: string;
  count: number;
};

export function getCategories(): Category[] {
  const catMap = new Map<string, number>();

  blogPosts.forEach((post) => {
    // Si quieres categorías reales, añade un campo "category" a tus posts
    // Mientras tanto, usamos el primer tag como categoría (o puedes mapearlo)
    if (post.tags && post.tags.length > 0) {
      const mainTag = post.tags[0].toLowerCase();
      catMap.set(mainTag, (catMap.get(mainTag) || 0) + 1);
    }
  });

  return Array.from(catMap.entries())
    .map(([slug, count]) => ({
      slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}