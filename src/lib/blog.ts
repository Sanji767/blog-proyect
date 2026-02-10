import "server-only";

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { cache } from "react";

import type { BlogPost, BlogPostPreview, Category, Tag } from "./blog/types";
import { sanityConfigured } from "@/sanity/env";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  allPostPreviewsQuery,
  allPostSlugsQuery,
  postBySlugQuery,
  postsByCategoryQuery,
  postsByTagQuery,
} from "@/sanity/lib/queries";
import { stripLeadingMarkdownH1 } from "@/lib/blog/markdown";

const POSTS_DIR = path.join(process.cwd(), "src/content/blog/posts");

type SanityPostPreview = Omit<BlogPostPreview, "image"> & {
  image?: string | null;
  coverImage?: string | null;
  category?: string | null;
  tags?: Array<string | null> | null;
  views?: number | null;
};

type SanityPost = SanityPostPreview & {
  content: BlogPost["content"];
};

function humanizeSlug(value: string): string {
  const normalized = value.trim().replace(/-/g, " ");
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : value;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((t) => String(t ?? "").toLowerCase().trim())
    .filter(Boolean);
}

function normalizeCategory(value: unknown): string {
  const normalized = String(value ?? "general").toLowerCase().trim();
  return normalized || "general";
}

function normalizePreview(post: SanityPostPreview): BlogPostPreview {
  return {
    slug: String(post.slug ?? "").toLowerCase().trim(),
    title: post.title ?? "Sin título",
    description: post.description ?? "",
    excerpt: post.excerpt ?? post.description ?? "",
    date: post.date ?? new Date().toISOString(),
    category: normalizeCategory(post.category),
    tags: normalizeTags(post.tags),
    image: post.image ?? undefined,
    coverImage: post.coverImage ?? undefined,
    featured: Boolean(post.featured),
    readingTime: post.readingTime ?? undefined,
    author: post.author ?? undefined,
    youtubeId: post.youtubeId ?? undefined,
    views: typeof post.views === "number" ? post.views : 0,
  };
}

function normalizePost(post: SanityPost): BlogPost {
  return {
    ...normalizePreview(post),
    content: post.content ?? [],
  };
}

function cleanMarkdownSnippet(value: string): string {
  let text = value;

  text = text.replace(/```[\s\S]*?```/g, " ");
  text = text.replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1");
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1");
  text = text.replace(/^\s*>\s?/gm, "");
  text = text.replace(/^\s*#{1,6}\s+/gm, "");
  text = text.replace(/^\s*[-*+]\s+/gm, "");
  text = text.replace(/^\s*\d+\.\s+/gm, "");
  text = text.replace(/[`*_~]/g, "");
  text = text.replace(/<[^>]+>/g, "");
  text = text.replace(/\s+/g, " ").trim();
  return text;
}

function deriveExcerptFromMarkdown(markdown: string): string {
  const normalized = stripLeadingMarkdownH1(markdown).replace(/\r\n/g, "\n");
  const blocks = normalized.split(/\n\s*\n/);

  for (const block of blocks) {
    const snippet = cleanMarkdownSnippet(block);
    if (!snippet) continue;

    const max = 180;
    if (snippet.length <= max) return snippet;
    return `${snippet.slice(0, max - 1).trimEnd()}…`;
  }

  return "";
}

function readLocalPosts(): BlogPost[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const years = fs
    .readdirSync(POSTS_DIR)
    .filter((item) => {
      if (item.startsWith("_")) return false;
      const fullPath = path.join(POSTS_DIR, item);
      return fs.statSync(fullPath).isDirectory();
    })
    .sort();

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
      const slug = String(data.slug?.trim() || fileName)
        .toLowerCase()
        .replace(/\s+/g, "-");

      const description = String(data.description ?? "").trim();
      const excerpt = String(data.excerpt ?? "").trim();
      const derivedExcerpt = excerpt || description || deriveExcerptFromMarkdown(content);

      posts.push({
        slug,
        title: data.title ?? "Sin título",
        description: description || derivedExcerpt,
        excerpt: derivedExcerpt,
        date: data.date ?? `${year}-01-01`,
        category: normalizeCategory(data.category),
        tags: normalizeTags(data.tags),
        image: typeof data.image === "string" ? data.image : undefined,
        coverImage: typeof data.coverImage === "string" ? data.coverImage : undefined,
        featured: Boolean(data.featured),
        readingTime: data.readingTime,
        youtubeId: data.youtubeId,
        views: data.views ?? 0,
        author: data.author,
        content,
        year,
      });
    }
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

const getLocalPosts = cache(() => readLocalPosts());

function toPreview(post: BlogPost): BlogPostPreview {
  const { content, ...rest } = post;
  void content;
  return rest;
}

export const getAllPostPreviews = cache(async (): Promise<BlogPostPreview[]> => {
  if (!sanityConfigured) return getLocalPosts().map(toPreview);

  const posts = await sanityFetch<SanityPostPreview[]>(
    allPostPreviewsQuery,
    {},
    { revalidate: 60, tags: ["blog"] },
  );

  return posts.map(normalizePreview).filter((p) => Boolean(p.slug));
});

export const getPostsByTag = cache(async (tag: string): Promise<BlogPostPreview[]> => {
  const tagSlug = decodeURIComponent(tag).toLowerCase().trim();
  if (!tagSlug) return [];

  if (!sanityConfigured) {
    return (await getAllPostPreviews()).filter((p) => p.tags?.includes(tagSlug));
  }

  const posts = await sanityFetch<SanityPostPreview[]>(
    postsByTagQuery,
    { tag: tagSlug },
    { revalidate: 60, tags: ["blog", `tag:${tagSlug}`] },
  );

  return posts.map(normalizePreview).filter((p) => Boolean(p.slug));
});

export const getPostsByCategory = cache(
  async (category: string): Promise<BlogPostPreview[]> => {
    const categorySlug = decodeURIComponent(category).toLowerCase().trim();
    if (!categorySlug) return [];

    if (!sanityConfigured) {
      return (await getAllPostPreviews()).filter((p) => p.category === categorySlug);
    }

    const posts = await sanityFetch<SanityPostPreview[]>(
      postsByCategoryQuery,
      { category: categorySlug },
      { revalidate: 60, tags: ["blog", `category:${categorySlug}`] },
    );

    return posts.map(normalizePreview).filter((p) => Boolean(p.slug));
  },
);

export const getPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const slugValue = decodeURIComponent(slug).toLowerCase().trim();
  if (!slugValue) return null;

  if (!sanityConfigured) {
    const post = getLocalPosts().find((p) => p.slug === slugValue);
    return post ?? null;
  }

  const post = await sanityFetch<SanityPost | null>(
    postBySlugQuery,
    { slug: slugValue },
    { revalidate: 60, tags: ["blog", `post:${slugValue}`] },
  );

  if (!post) return null;
  const normalized = normalizePost(post);
  return normalized.slug ? normalized : null;
});

export const getAllPostSlugs = cache(async (): Promise<string[]> => {
  if (!sanityConfigured) return getLocalPosts().map((p) => p.slug);

  const rows = await sanityFetch<Array<{ slug?: string | null }>>(
    allPostSlugsQuery,
    {},
    { revalidate: 60, tags: ["blog"] },
  );

  return rows
    .map((r) => String(r.slug ?? "").toLowerCase().trim())
    .filter(Boolean);
});

export const getCategories = cache(async (): Promise<Category[]> => {
  const posts = await getAllPostPreviews();
  const map = new Map<string, number>();

  for (const post of posts) {
    const cat = normalizeCategory(post.category);
    map.set(cat, (map.get(cat) || 0) + 1);
  }

  return Array.from(map.entries())
    .map(([slug, count]) => ({
      slug,
      title: humanizeSlug(slug),
      count,
    }))
    .sort((a, b) => b.count - a.count);
});

export const getTags = cache(async (): Promise<Tag[]> => {
  const posts = await getAllPostPreviews();
  const map = new Map<string, number>();

  for (const post of posts) {
    for (const tag of post.tags ?? []) {
      const tagSlug = String(tag ?? "").toLowerCase().trim();
      if (!tagSlug) continue;
      map.set(tagSlug, (map.get(tagSlug) || 0) + 1);
    }
  }

  return Array.from(map.entries())
    .map(([slug, count]) => ({
      slug,
      title: humanizeSlug(slug),
      count,
    }))
    .sort((a, b) => b.count - a.count);
});
