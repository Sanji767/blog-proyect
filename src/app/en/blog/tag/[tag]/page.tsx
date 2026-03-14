// src/app/en/blog/tag/[tag]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import BlogExplore from "@/components/blog/BlogExplore";
import NewsPostCard from "@/components/blog/NewsPostCard";
import { getPostsByTag, getTags } from "@/lib/blog";
import { withLocale } from "@/lib/i18n";
import {
  DEFAULT_OG_IMAGE_URL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  toJsonLd,
} from "@/lib/seo";

type Props = {
  params: {
    tag: string;
  };
};

export async function generateStaticParams(): Promise<Array<{ tag: string }>> {
  const tags = await getTags("en");
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tagSlug = decodeURIComponent(params.tag).toLowerCase().trim();
  const tags = await getTags("en");
  const tag = tags.find((t) => t.slug === tagSlug);
  const label = tag?.title ?? tagSlug;

  return {
    title: `#${label} | FinanzasEU Blog`,
    description: `All articles tagged with #${label}.`,
    alternates: {
      canonical: `/en/blog/tag/${encodeURIComponent(tagSlug)}`,
    },
  };
}

export default async function TagPageEn({ params }: Props) {
  const locale = "en" as const;
  const tagSlug = decodeURIComponent(params.tag).toLowerCase().trim();
  const tags = await getTags(locale);
  const tag = tags.find((t) => t.slug === tagSlug);
  const label = tag?.title ?? tagSlug;

  const posts = await getPostsByTag(tagSlug, locale);

  const pageUrl = `${SITE_URL}/en/blog/tag/${encodeURIComponent(tagSlug)}`;
  const pageTitle = `#${label} | FinanzasEU Blog`;
  const pageDescription = `All articles tagged with #${label}.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/en/blog` },
      { "@type": "ListItem", position: 3, name: `#${label}`, item: pageUrl },
    ],
  };

  const tagCollectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: pageTitle,
    description: pageDescription,
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
      itemListElement: posts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/en/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(tagCollectionJsonLd) }}
      />

      <header className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <Link
            href={withLocale("/blog", locale)}
            className="underline-offset-4 hover:underline"
          >
            Blog
          </Link>{" "}
          <span className="text-muted-foreground/70">/</span> Tag
        </p>

        <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
          #{label}
        </h1>

        <p className="text-base text-muted-foreground md:text-lg">
          {posts.length} article{posts.length !== 1 ? "s" : ""}.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-base text-muted-foreground">
          No articles tagged <strong>#{label}</strong> yet.
        </p>
      ) : (
        <section className="mt-12">
          <div className="grid gap-6 md:grid-cols-2">
            {posts.map((post, idx) => (
              <NewsPostCard key={post.slug} post={post} index={idx} showDescription />
            ))}
          </div>
        </section>
      )}

      <BlogExplore locale="en" />
    </>
  );
}
