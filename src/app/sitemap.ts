import type { MetadataRoute } from "next";

import { banks } from "@/lib/banks";
import { getAllPostPreviews, getCategories, getTags } from "@/lib/blog";
import { ebooks } from "@/lib/ebooks-data";
import { type Locale, withLocale } from "@/lib/i18n";
import { vlogPreviews } from "@/lib/vlogs";

const BASE_URL = "https://finanzaseu.com";
const LOCALES: Locale[] = ["es", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticPaths = [
    "/",
    "/bancos",
    "/ventajas",
    "/faq",
    "/contacto",
    "/comparativa",
    "/iban",
    "/rss.xml",
    "/herramientas",
    "/herramientas/interes-compuesto",
    "/herramientas/inflacion",
    "/herramientas/objetivo-ahorro",
    "/herramientas/regla-4",
    "/herramientas/tae",
    "/blog",
    "/ebooks",
    "/vlogs",
    "/sobre",
    "/terminos",
    "/privacidad",
    "/cookies",
    "/aviso-afiliados",
  ];

  const urls: MetadataRoute.Sitemap = [];

  for (const basePath of staticPaths) {
    const esPath = withLocale(basePath, "es");
    const enPath = withLocale(basePath, "en");

    const alternates = {
      languages: {
        es: toUrl(esPath),
        en: toUrl(enPath),
      },
    } satisfies NonNullable<MetadataRoute.Sitemap[number]["alternates"]>;

    for (const locale of LOCALES) {
      const localizedPath = withLocale(basePath, locale);
      urls.push({
        url: toUrl(localizedPath),
        lastModified: now,
        alternates,
      });
    }
  }

  const postsEs = await getAllPostPreviews("es");
  const postsEn = await getAllPostPreviews("en");
  const postSlugsEs = new Set(postsEs.map((p) => p.slug));
  const postSlugsEn = new Set(postsEn.map((p) => p.slug));

  for (const post of postsEs) {
    const hasEn = postSlugsEn.has(post.slug);
    urls.push({
      url: toUrl(`/blog/${post.slug}`),
      lastModified: safeDate(post.date, now),
      alternates: hasEn
        ? {
            languages: {
              es: toUrl(`/blog/${post.slug}`),
              en: toUrl(`/en/blog/${post.slug}`),
            },
          }
        : undefined,
    });
  }

  for (const post of postsEn) {
    const hasEs = postSlugsEs.has(post.slug);
    urls.push({
      url: toUrl(`/en/blog/${post.slug}`),
      lastModified: safeDate(post.date, now),
      alternates: hasEs
        ? {
            languages: {
              es: toUrl(`/blog/${post.slug}`),
              en: toUrl(`/en/blog/${post.slug}`),
            },
          }
        : undefined,
    });
  }

  const categoriesEs = await getCategories("es");
  const categoriesEn = await getCategories("en");
  const categorySlugsEs = new Set(categoriesEs.map((c) => c.slug));
  const categorySlugsEn = new Set(categoriesEn.map((c) => c.slug));

  urls.push(
    ...categoriesEs.map((cat) => {
      const hasEn = categorySlugsEn.has(cat.slug);
      const encoded = encodeURIComponent(cat.slug);
      return {
        url: toUrl(`/blog/categoria/${encoded}`),
        lastModified: now,
        alternates: hasEn
          ? {
              languages: {
                es: toUrl(`/blog/categoria/${encoded}`),
                en: toUrl(`/en/blog/categoria/${encoded}`),
              },
            }
          : undefined,
      };
    }),
  );

  urls.push(
    ...categoriesEn.map((cat) => {
      const hasEs = categorySlugsEs.has(cat.slug);
      const encoded = encodeURIComponent(cat.slug);
      return {
        url: toUrl(`/en/blog/categoria/${encoded}`),
        lastModified: now,
        alternates: hasEs
          ? {
              languages: {
                es: toUrl(`/blog/categoria/${encoded}`),
                en: toUrl(`/en/blog/categoria/${encoded}`),
              },
            }
          : undefined,
      };
    }),
  );

  const tagsEs = await getTags("es");
  const tagsEn = await getTags("en");
  const tagSlugsEs = new Set(tagsEs.map((t) => t.slug));
  const tagSlugsEn = new Set(tagsEn.map((t) => t.slug));

  urls.push(
    ...tagsEs.map((tag) => {
      const hasEn = tagSlugsEn.has(tag.slug);
      const encoded = encodeURIComponent(tag.slug);
      return {
        url: toUrl(`/blog/tag/${encoded}`),
        lastModified: now,
        alternates: hasEn
          ? {
              languages: {
                es: toUrl(`/blog/tag/${encoded}`),
                en: toUrl(`/en/blog/tag/${encoded}`),
              },
            }
          : undefined,
      };
    }),
  );

  urls.push(
    ...tagsEn.map((tag) => {
      const hasEs = tagSlugsEs.has(tag.slug);
      const encoded = encodeURIComponent(tag.slug);
      return {
        url: toUrl(`/en/blog/tag/${encoded}`),
        lastModified: now,
        alternates: hasEs
          ? {
              languages: {
                es: toUrl(`/blog/tag/${encoded}`),
                en: toUrl(`/en/blog/tag/${encoded}`),
              },
            }
          : undefined,
      };
    }),
  );

  urls.push(
    ...banks
      .filter((bank) => bank._status !== "draft")
      .flatMap((bank) => {
        const esPath = `/programas/${bank.slug}`;
        const enPath = `/en/programas/${bank.slug}`;
        const alternates = {
          languages: {
            es: toUrl(esPath),
            en: toUrl(enPath),
          },
        } satisfies NonNullable<MetadataRoute.Sitemap[number]["alternates"]>;

        return [
          { url: toUrl(esPath), lastModified: now, alternates },
          { url: toUrl(enPath), lastModified: now, alternates },
        ];
      }),
  );

  urls.push(
    ...vlogPreviews.flatMap((vlog) => {
      const esPath = `/vlogs/${vlog.slug}`;
      const enPath = `/en/vlogs/${vlog.slug}`;
      const alternates = {
        languages: {
          es: toUrl(esPath),
          en: toUrl(enPath),
        },
      } satisfies NonNullable<MetadataRoute.Sitemap[number]["alternates"]>;

      return [
        { url: toUrl(esPath), lastModified: safeDate(vlog.date, now), alternates },
        { url: toUrl(enPath), lastModified: safeDate(vlog.date, now), alternates },
      ];
    }),
  );

  urls.push(
    ...ebooks.flatMap((ebook) => {
      const encoded = encodeURIComponent(ebook.id);
      const esPath = `/ebooks/${encoded}`;
      const enPath = `/en/ebooks/${encoded}`;
      const alternates = {
        languages: {
          es: toUrl(esPath),
          en: toUrl(enPath),
        },
      } satisfies NonNullable<MetadataRoute.Sitemap[number]["alternates"]>;

      return [
        { url: toUrl(esPath), lastModified: now, alternates },
        { url: toUrl(enPath), lastModified: now, alternates },
      ];
    }),
  );

  return urls;
}

function safeDate(value: string, fallback: Date): Date {
  const ms = Date.parse(value);
  return Number.isNaN(ms) ? fallback : new Date(ms);
}

function toUrl(pathname: string): string {
  if (!pathname || pathname === "/") return BASE_URL;
  return `${BASE_URL}${pathname}`;
}
