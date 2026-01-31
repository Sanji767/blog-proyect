// src/lib/blog/mergeRealPosts.ts
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { blogPosts } from "./posts";
import type { BlogPost } from "@/lib/blog/types";


const BLOG_DIR = path.join(process.cwd(), "src/content/blog");

// Esta función se ejecuta en build time / dev time y añade automáticamente
// todos los .mdx reales al array que ya usas en el resto del sitio
function mergePostsFromFilesystem() {
  if (!fs.existsSync(BLOG_DIR)) return;

  const years = fs.readdirSync(BLOG_DIR).filter(y => {
    return fs.statSync(path.join(BLOG_DIR, y)).isDirectory();
  });

  for (const year of years) {
    const yearPath = path.join(BLOG_DIR, year);
    const files = fs.readdirSync(yearPath);

    for (const file of files) {
      if (!/\.mdx?$/.test(file)) continue;

      const fullPath = path.join(yearPath, file);
      const raw = fs.readFileSync(fullPath, "utf-8");
      const { data, content } = matter(raw);

      const fileNameNoExt = path.basename(file, path.extname(file));
      const slug = (data.slug?.trim() || fileNameNoExt).toLowerCase();

      // Si el post ya existe en posts.ts → lo saltamos (así no hay duplicados)
      const alreadyExists = blogPosts.some(p => p.slug === slug);
      if (alreadyExists) continue;

      // Añadimos el post real al array global
const newPost: BlogPost = {
  slug,
  title: data.title ?? "Sin título",
  description: data.description ?? "",
  date: data.date ?? `${year}-01-01`,
  category: (data.category ?? "general").toLowerCase(), // <-- añadido
  image: data.image ?? undefined,
  tags: Array.isArray(data.tags)
    ? data.tags.map((t: unknown) => String(t).toLowerCase().trim())
    : [],
  readingTime: data.readingTime,
  youtubeId: data.youtubeId,
  views: data.views,
  featured: !!data.featured,
  content,
};

      // @ts-ignore – estamos modificando el array importado (funciona en Next.js)
      blogPosts.push(newPost);
    }
  }

  // Re-ordenamos por fecha después de añadir los nuevos
  blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Ejecutamos inmediatamente (tanto en dev como en build)
mergePostsFromFilesystem();