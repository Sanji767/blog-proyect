// src/lib/blog/types.ts
import type { StaticImageData } from "next/image";

export type BlogPost = {
  slug: string;
  title: string;
  description?: string;
  excerpt?: string;
  content: string;
  coverImage?: string;
  image?: string | StaticImageData;
  date: string;
  category: string;
  tags: string[];
  readingTime?: string;
  author?: string;
  youtubeId?: string;
  views?: number;
  featured?: boolean;
  year?: string; // opcional: útil para filtros o URLs por año
};

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
