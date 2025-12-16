// src/lib/blog/getBlogPostBySlug.ts
import { getBlogPosts } from "./getBlogPosts";
import { BlogPost } from "./types";

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
