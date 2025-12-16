// src/lib/blog/getBlogPosts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { BlogPost } from "./types";

const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

/**
 * Obtiene todos los posts del blog ordenados por fecha (más reciente primero)
 */
export function getBlogPosts(): BlogPost[] {
  // 1. Leemos todas las carpetas de años (2024, 2025, etc.)
  const years = fs
    .readdirSync(BLOG_DIR)
    .filter((item) => {
      const fullPath = path.join(BLOG_DIR, item);
      return fs.statSync(fullPath).isDirectory();
    });

  const posts: BlogPost[] = [];

  // 2. Recorremos cada año y cada archivo .md / .mdx
  for (const year of years) {
    const yearPath = path.join(BLOG_DIR, year);
    const files = fs.readdirSync(yearPath);

    for (const file of files) {
      if (!/\.mdx?$/.test(file)) continue; // solo archivos markdown

      const fullPath = path.join(yearPath, file);
      const rawContent = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(rawContent);

      // Nombre del archivo sin extensión (por si no tiene slug en frontmatter)
      const fileNameWithoutExt = path.basename(file, path.extname(file));

      // ¡RECOMENDADO! Usa siempre el slug del frontmatter.
      // Si no existe, cae al nombre del archivo (como antes).
      const slug = data.slug?.trim() || fileNameWithoutExt;

      const post: BlogPost = {
        title: data.title ?? "Sin título",
        description: data.description ?? "",
        date: data.date ?? new Date().toISOString().split("T")[0],
        category: data.category ?? "general",
        tags: Array.isArray(data.tags) ? data.tags : [],
        slug,                                   // ← slug fiable
        image: data.image ?? null,
        featured: !!data.featured,
        content,
        year: year,                             // opcional: útil para filtros o URLs con año
      };

      posts.push(post);
    }
  }

  // 3. Ordenamos por fecha descendente (el más nuevo primero)
  posts.sort((a, b) => +new Date(b.date) - +new Date(a.date));

  return posts;
}

/**
 * Función auxiliar: obtener un post por su slug
 * Muy útil para la página [slug].tsx
 */
export function getPostBySlug(slug: string): BlogPost | undefined {
  const allPosts = getBlogPosts();
  return allPosts.find((post) => post.slug === slug);
}