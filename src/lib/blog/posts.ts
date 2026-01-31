// src/lib/blog/posts.ts

import type { BlogPost } from "./types";
import type { StaticImageData } from "next/image";   // keep if used, or remove if unused

const posts: BlogPost[] = [
  {
    slug: "mejores-bancos-digitales-europa-2025",
    title: "Los 4 mejores bancos digitales de Europa en 2025",
    description: "Guía clara y práctica de los bancos digitales más interesantes de Europa en 2025: N26, Revolut, Wise y Bunq.",
    date: "2025-11-16",
    excerpt: "Comparativa actualizada 2025: N26 vs Revolut vs Wise vs Bunq – comisiones, IBAN español, tarjetas, cripto y seguridad.",
    coverImage: "/images/blog/bancos-europa-2025.jpg",
    image: "/images/blog/bancos-europa-2025.jpg",
    tags: ["bancos", "europa", "comparativa", "n26", "revolut", "wise", "bunq"],
    readingTime: "15 min",           // ← present here, but type is now optional → ok
    youtubeId: "dQw4w9WgXcQ",
    views: 28491,
    featured: true,
    content: `# Los 4 mejores bancos digitales de Europa en 2025\n\n...`,
    category: "Bancos",
    author: "FinWise Team",
  },
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