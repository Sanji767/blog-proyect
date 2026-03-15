import { getAllPostPreviews } from "@/lib/blog";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

function toCdata(value: string): string {
  // Prevent breaking out of CDATA.
  return `<![CDATA[${value.replaceAll("]]>", "]]]]><![CDATA[>")}]]>`;
}

export async function GET() {
  const posts = await getAllPostPreviews("en");

  const itemsXml = posts
    .slice(0, 50)
    .map((post) => {
      const url = `${SITE_URL}/en/blog/${post.slug}`;
      const pubDate = new Date(post.date);
      const date = Number.isNaN(pubDate.getTime()) ? new Date() : pubDate;
      const description =
        (post.description ?? "").trim() || (post.excerpt ?? "").trim() || "";

      return [
        "<item>",
        `<title>${toCdata(post.title)}</title>`,
        `<link>${url}</link>`,
        `<guid isPermaLink="true">${url}</guid>`,
        `<pubDate>${date.toUTCString()}</pubDate>`,
        description ? `<description>${toCdata(description)}</description>` : "",
        "</item>",
      ]
        .filter(Boolean)
        .join("");
    })
    .join("");

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "<channel>",
    `<title>${toCdata(`${SITE_NAME} — Blog (EN)`)}</title>`,
    `<link>${SITE_URL}/en/blog</link>`,
    `<description>${toCdata(
      "Practical guides and comparisons about European banks, IBAN and fees."
    )}</description>`,
    `<atom:link href="${SITE_URL}/en/rss.xml" rel="self" type="application/rss+xml" />`,
    `<language>en-US</language>`,
    `<lastBuildDate>${new Date().toUTCString()}</lastBuildDate>`,
    itemsXml,
    "</channel>",
    "</rss>",
  ].join("");

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, s-maxage=3600",
    },
  });
}

