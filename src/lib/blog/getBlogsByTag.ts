// src/lib/blog/getBlogsByTag.ts
import { getBlogPosts } from "./getBlogPosts";

export async function getBlogsByTag(tag: string) {
  const posts = await getBlogPosts();
  return posts.filter((p) => p.tags.includes(tag));
}
