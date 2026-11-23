import type { MetadataRoute } from "next";

import { banks } from "@/lib/banks";
import { getAllPostPreviews, getCategories } from "@/lib/blog";
import { CURATED_COMPARISON_SLUGS } from "@/lib/curatedComparisons";
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
    "/herramientas/hipoteca",
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
      lastModified: safeDate(post.lastReviewed ?? post.date, now),
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
      lastModified: safeDate(post.lastReviewed ?? post.date, now),
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

  // F-04: only indexable categories (>= 3 articles) go in the sitemap;
  // thin categories are noindex and excluded.
  const categoriesEs = (await getCategories("es")).filter(
    (cat) => cat.count >= 3,
  );
  const categoriesEn = (await getCategories("en")).filter(
    (cat) => cat.count >= 3,
  );
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

  // F-04: tag pages are noindex,follow, so they do not belong in the
  // sitemap. (All tag URLs were removed here.)

  urls.push(
    ...banks
      .filter((bank) => bank._status !== "draft")
      .flatMap((bank) => {
        const esPath = `/bancos/${bank.slug}`;
        const enPath = `/en/bancos/${bank.slug}`;
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

  // C5: only the 28 curated pairs go in the sitemap (was: all 820
  // unordered pairs × 2 locales = 1.640 comparar URLs). The remaining
  // pairs still exist for visitors but are noindex (see [slug] templates).
  for (const slug of CURATED_COMPARISON_SLUGS) {
    const esPath = `/comparar/${slug}`;
    const enPath = `/en/comparar/${slug}`;
    const alternates = {
      languages: {
        es: toUrl(esPath),
        en: toUrl(enPath),
      },
    } satisfies NonNullable<MetadataRoute.Sitemap[number]["alternates"]>;

    urls.push({ url: toUrl(esPath), lastModified: now, alternates });
    urls.push({ url: toUrl(enPath), lastModified: now, alternates });
  }

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
