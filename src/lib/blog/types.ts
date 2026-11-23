// src/lib/blog/types.ts
import type { StaticImageData } from "next/image";
import type { PortableTextBlock } from "@portabletext/types";

export type BlogPost = {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  content: string | PortableTextBlock[];
  coverImage?: string;
  image?: string | StaticImageData;
  imageCredit?: string; // e.g. "Ken Teegardin / Wikimedia Commons (CC BY-SA 2.0)"
  imageCreditUrl?: string; // link to the source file page
  date: string;
  lastReviewed?: string;
  category: string;
  tags: string[];
  readingTime?: string;
  author?: string;
  youtubeId?: string;
  views?: number;
  featured?: boolean;
  year?: string; // opcional: útil para filtros o URLs por año
};

// Para cards / listados (evita enviar `content` al cliente en componentes "use client").
export type BlogPostPreview = Omit<BlogPost, "content">;

export type Category = {
  slug: string;
  title: string;
  count: number;
  description?: string;
};

export type Tag = {
  slug: string;
  title: string;
  count: number;
};
