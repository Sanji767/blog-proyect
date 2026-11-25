import { getAllPostPreviews } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

// Google News sitemap: only articles published in the last 2 days,
// per Google's News sitemap guidelines.
const TWO_DAYS_MS = 2 * 24 * 60 * 60 * 1000;

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function toW3cDate(value: string): string | null {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return null;
  return new Date(ms).toISOString();
}

export async function GET() {
  const now = Date.now();
  const cutoff = now - TWO_DAYS_MS;

  const [postsEs, postsEn] = await Promise.all([
    getAllPostPreviews("es"),
    getAllPostPreviews("en"),
  ]);

  const entries: Array<{ url: string; language: string; date: string; title: string }> = [];

  for (const post of postsEs) {
    const date = toW3cDate(post.date);
    if (!date || Date.parse(date) < cutoff) continue;
    entries.push({
      url: `${SITE_URL}/blog/${post.slug}`,
      language: "es",
      date,
      title: post.title,
    });
  }

  for (const post of postsEn) {
    const date = toW3cDate(post.date);
    if (!date || Date.parse(date) < cutoff) continue;
    entries.push({
      url: `${SITE_URL}/en/blog/${post.slug}`,
      language: "en",
      date,
      title: post.title,
    });
  }

  entries.sort((a, b) => Date.parse(b.date) - Date.parse(a.date));

  const urlsXml = entries
    .slice(0, 1000)
    .map((entry) =>
      [
        "<url>",
        `<loc>${escapeXml(entry.url)}</loc>`,
        "<news:news>",
        "<news:publication>",
        `<news:name>${escapeXml(SITE_NAME)}</news:name>`,
        `<news:language>${entry.language}</news:language>`,
        "</news:publication>",
        `<news:publication_date>${entry.date}</news:publication_date>`,
        `<news:title>${escapeXml(entry.title)}</news:title>`,
        "</news:news>",
        "</url>",
      ].join(""),
    )
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">',
    urlsXml,
    "</urlset>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}
