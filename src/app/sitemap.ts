import type { MetadataRoute } from "next";

import { banks } from "@/lib/banks";
import { getAllPostPreviews, getCategories, getTags } from "@/lib/blog";
import { ebooks } from "@/lib/ebooks-data";
import { vlogPreviews } from "@/lib/vlogs";

const BASE_URL = "https://finanzaseu.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes = [
    "",
    "/bancos",
    "/ventajas",
    "/faq",
    "/contacto",
    "/comparativa",
    "/iban",
    "/blog",
    "/ebooks",
    "/vlogs",
    "/terminos",
    "/privacidad",
    "/cookies",
    "/aviso-afiliados",
  ];

  const urls: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: now,
  }));

  const posts = await getAllPostPreviews();
  urls.push(
    ...posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: safeDate(post.date, now),
    }))
  );

  const categories = await getCategories();
  urls.push(
    ...categories.map((cat) => ({
      url: `${BASE_URL}/blog/categoria/${encodeURIComponent(cat.slug)}`,
      lastModified: now,
    }))
  );

  const tags = await getTags();
  urls.push(
    ...tags.map((tag) => ({
      url: `${BASE_URL}/blog/tag/${encodeURIComponent(tag.slug)}`,
      lastModified: now,
    }))
  );

  urls.push(
    ...banks.map((bank) => ({
      url: `${BASE_URL}/programas/${bank.slug}`,
      lastModified: now,
    }))
  );

  urls.push(
    ...vlogPreviews.map((vlog) => ({
      url: `${BASE_URL}/vlogs/${vlog.slug}`,
      lastModified: safeDate(vlog.date, now),
    }))
  );

  urls.push(
    ...ebooks.map((ebook) => ({
      url: `${BASE_URL}/ebooks/${encodeURIComponent(ebook.id)}`,
      lastModified: now,
    }))
  );

  return urls;
}

function safeDate(value: string, fallback: Date): Date {
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? fallback : new Date(ms);
}
