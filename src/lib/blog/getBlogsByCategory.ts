// src/lib/blog/getBlogsByCategory.ts
import { getBlogPosts } from "./getBlogPosts";
import { BlogPost } from "./types";

export async function getBlogsByCategory(category: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.category === category);
}
