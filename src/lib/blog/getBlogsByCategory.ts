// src/lib/blog/getBlogsByCategory.ts
import { getBlogPosts } from "./getBlogPosts";
import type { BlogPost } from "@/lib/blog/types";
;

export async function getBlogsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.category === category);
}
