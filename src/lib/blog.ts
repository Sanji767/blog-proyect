// src/lib/blog.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");

// Tipo compatible con tu BlogCard actual (importante: image nunca es null)
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string; // "2025-11-22"
  category: string;
  tags: string[];
  image?: string | undefined;     // ← FIX: undefined, NO null
  featured?: boolean;
  readingTime?: string;
  youtubeId?: string;
  views?: number;
  content: string;
};

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
          ? data.tags.map((t: any) => String(t).toLowerCase().trim())
          : [],
        image: typeof data.image === "string" ? data.image : undefined, // ← FIX definitivo
        featured: !!data.featured,
        readingTime: data.readingTime,
        youtubeId: data.youtubeId,
        views: data.views ?? 0,
        content,
      });
    }
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// ---------------------------------------------------------------------
// 2–7. El resto de funciones (sin cambios, pero con el fix aplicado)
export function getPostBySlug(slug: string): BlogPost | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter((post) => post.category === category.toLowerCase());
}

export function getPostsByTag(tag: string): BlogPost[] {
  const lowerTag = tag.toLowerCase();
  return getAllPosts().filter((post) => post.tags.includes(lowerTag));
}

export function getFeaturedPosts(): BlogPost[] {
  return getAllPosts().filter((post) => post.featured);
}

export type Category = { slug: string; title: string; count: number };
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

export type Tag = { slug: string; title: string; count: number };
export function getTags(): Tag[] {
  const map = new Map<string, number>();

  getAllPosts().forEach((post) => {
    post.tags.forEach((tag) => {
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
// CTA FINAL que tanto te mola 😎
console.log(`
╔══════════════════════════════════════════════════╗
║                                                  ║
║   🎉 BLOG 100% AUTOMÁTICO Y FUNCIONANDO 🎉      ║
║                                                  ║
║   → Crea un .mdx en src/content/blog/posts/      ║
║   → Aparece solo en todo el sitio                ║
║   → Sin tocar posts.ts nunca más                 ║
║                                                  ║
╚══════════════════════════════════════════════════╝
`);