// src/lib/blog/posts.ts
import type { StaticImageData } from "next/image";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;                 // "2025-11-16"
  image?: string | StaticImageData;
  tags?: string[];
  readingTime?: string;
  youtubeId?: string;
  views?: number;
  featured?: boolean;
  content: string;
};

const posts: BlogPost[] = [
  {
    slug: "mejores-bancos-digitales-europa-2025",
    title: "Los 4 mejores bancos digitales de Europa en 2025",
    description: "Guía clara y práctica de los bancos digitales más interesantes de Europa en 2025: N26, Revolut, Wise y Bunq.",
    date: "2025-11-16",
    image: "/images/blog/bancos-europa-2025.jpg",
    tags: ["bancos", "europa", "comparativa", "n26", "revolut", "wise", "bunq"],
    readingTime: "15 min",
    youtubeId: "dQw4w9WgXcQ",
    views: 28491,
    featured: true,
    content: `# Título del post

Tu contenido en markdown aquí...`,
  },
  // Añade más posts aquí
];

export const blogPosts = posts.sort((a, b) => 
  new Date(b.date).getTime() - new Date(a.date).getTime()
);

export const getPostBySlug = (slug: string) => 
  blogPosts.find(p => p.slug === slug);

export const featuredPosts = blogPosts.filter(p => p.featured);