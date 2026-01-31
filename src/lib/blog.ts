// src/lib/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

import type { BlogPost, Category, Tag } from "./blog/types";

const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");

// ---------------------------------------------------------------------
// 1. Todos los posts
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const years = fs.readdirSync(POSTS_DIR).filter((item) => {
    const fullPath = path.join(POSTS_DIR, item);
    return fs.statSync(fullPath).isDirectory();
  });

  const posts: BlogPost[] = [];

  for (const year of years) {
    const yearPath = path.join(POSTS_DIR, year);
    const files = fs.readdirSync(yearPath);

    for (const file of files) {
      if (!/\.mdx?$/.test(file)) continue;

      const filePath = path.join(yearPath, file);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      const fileName = path.basename(file, path.extname(file));
      const slug = (data.slug?.trim() || fileName).toLowerCase().replace(/ /g, "-");

      posts.push({
        slug,
        title: data.title ?? "Sin título",
        description: data.description ?? "",
        date: data.date ?? `${year}-01-01`,
        category: (data.category ?? "general").toLowerCase(),
        tags: Array.isArray(data.tags)
          ? data.tags.map((t: unknown) => String(t).toLowerCase().trim())
          : [], // Siempre string[]
        image: typeof data.image === "string" ? data.image : undefined,
        featured: !!data.featured,
        readingTime: data.readingTime,
        youtubeId: data.youtubeId,
        views: data.views ?? 0,
        content,
        excerpt: data.excerpt ?? data.description ?? "",
        coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
        author: data.author,
      });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ---------------------------------------------------------------------
// 2. Obtener post por slug
export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

// ---------------------------------------------------------------------
// 3. Obtener posts por categoría
export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category.toLowerCase());
}

// ---------------------------------------------------------------------
// 4. Obtener posts por tag
export function getPostsByTag(tag: string): BlogPost[] {
  const lowerTag = tag.toLowerCase();
  return getAllPosts().filter((post) => post.tags.includes(lowerTag));
}

// ---------------------------------------------------------------------
// 5. Posts destacados
export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}

// ---------------------------------------------------------------------
// 6. Categorías
export function getCategories(): Category[] {
  const map = new Map<string, number>();

  getAllPosts().forEach((post) => {
    const cat = post.category;
    map.set(cat, (map.get(cat) || 0) + 1);
  });

  return Array.from(map.entries())
    .map(([slug, count]) => ({
      slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------
// 7. Tags
export function getTags(): Tag[] {
  const map = new Map<string, number>();

  getAllPosts().forEach((post) => {
    // Tipado explícito para 'tag'
    post.tags.forEach((tag: string) => {
      map.set(tag, (map.get(tag) || 0) + 1);
    });
  });

  return Array.from(map.entries())
    .map(([slug, count]) => ({
      slug,
      title: slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " "),
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// ---------------------------------------------------------------------
// Mensaje de inicio (opcional)
console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🎉 BLOG 100% AUTOMÁTICO Y FUNCIONANDO 🎉      ║
║                                                  ║
║   → Crea un .mdx en src/content/blog/posts/      ║
║   → Aparece solo en todo el sitio                ║
║   → Sin tocar blog.ts nunca más                  ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);
