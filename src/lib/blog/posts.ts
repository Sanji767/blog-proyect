// src/lib/blog/posts.ts

import type { BlogPost } from "./types";

const posts: BlogPost[] = [
  // (vacío a propósito: la única entrada, la guía 2025 de bancos digitales,
  // se eliminó el 21 nov 2026 junto con su MDX; la guía vigente es la de 2026)
  // Add other posts with the same required/optional fields
];

export const blogPosts = posts.sort((a, b) =>
  new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const featuredPosts = blogPosts.filter((p) => p.featured);

export const getPostBySlug = (slug: string): BlogPost | undefined =>
  blogPosts.find((p) => p.slug === slug);

// If you have getAllPosts / getFeaturedPosts here or in another file, make sure they return BlogPost[]
export const getAllPosts = (): BlogPost[] => blogPosts;
export const getFeaturedPosts = (): BlogPost[] => featuredPosts;
