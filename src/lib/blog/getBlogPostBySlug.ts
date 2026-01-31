// src/lib/blog/getBlogPostBySlug.ts
import { getBlogPosts } from "./getBlogPosts";
import type { BlogPost } from "@/lib/blog/types";


export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}
