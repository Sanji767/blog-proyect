// src/app/en/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import BlogExplore from "@/components/blog/BlogExplore";
import LatestNewsRail from "@/components/blog/LatestNewsRail";
import EditorialPostRow from "@/components/blog/EditorialPostRow";
import { getAllPostPreviews } from "@/lib/blog";
import { withLocale } from "@/lib/i18n";
import {
  DEFAULT_OG_IMAGE_URL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  toJsonLd,
} from "@/lib/seo";

const BLOG_PAGE_TITLE =
  "FinanzasEU Blog — practical guides on banks, IBAN and fees (2026)";
const BLOG_PAGE_DESCRIPTION =
  "Honest comparisons, real-world reviews and practical tips to save money with Revolut, Wise, N26 and more.";

export const metadata: Metadata = {
  title: BLOG_PAGE_TITLE,
  description: BLOG_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/en/blog",
  },
};

export default async function BlogPageEn() {
  const locale = "en" as const;
  const allPosts = await getAllPostPreviews(locale);
  const pageUrl = `${SITE_URL}/en/blog`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Blog", item: pageUrl },
    ],
  };

  const blogCollectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: BLOG_PAGE_TITLE,
    description: BLOG_PAGE_DESCRIPTION,
    inLanguage: "en-US",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
    },
    primaryImageOfPage: { "@type": "ImageObject", url: DEFAULT_OG_IMAGE_URL },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: allPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/en/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  const railPosts = allPosts.slice(0, 8);
  const remainingPosts = allPosts.slice(8);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(blogCollectionJsonLd) }}
      />

      <header className="space-y-6">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Blog
        </p>

        <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
          Ideas, guides and experiences about{" "}
          <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
            money
          </span>{" "}
          in Europe.
        </h1>

        <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Clear reads about digital banks, IBAN, fees and useful tools. Less
          marketing, more judgement.
        </p>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {[
            { href: "/", label: "Home" },
            { href: "/blog", label: "Articles" },
            { href: "/sobre", label: "About" },
          ].map((item, idx, arr) => (
            <span key={item.href} className="inline-flex items-center gap-x-4">
              <Link
                href={withLocale(item.href, locale)}
                className="text-foreground/90 underline-offset-4 transition-colors hover:text-foreground hover:underline"
              >
                {item.label}
              </Link>
              {idx < arr.length - 1 ? (
                <span className="text-muted-foreground/70">/</span>
              ) : null}
            </span>
          ))}
        </nav>
      </header>

      {allPosts.length === 0 ? (
        <p className="mt-12 text-base text-muted-foreground">
          No articles published yet.
        </p>
      ) : (
        <>
          <LatestNewsRail
            posts={railPosts}
            title="Latest"
            subtitle="Recent reads, without generic cards or noise."
          />

          {remainingPosts.length > 0 ? (
            <section className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                More articles
              </h2>
              <ul className="mt-6 border-t border-border/50">
                {remainingPosts.map((post, idx) => (
                  <EditorialPostRow key={post.slug} post={post} index={idx} />
                ))}
              </ul>
            </section>
          ) : null}
        </>
      )}

      <BlogExplore locale="en" />

      <p className="mt-16 max-w-3xl text-sm text-muted-foreground">
        Have a specific question or want to suggest a topic?{" "}
        <Link
          href={withLocale("/contacto", locale)}
          className="text-foreground underline-offset-4 hover:underline"
        >
          Write to me
        </Link>
        .
      </p>
    </>
  );
}
