// src/app/blog/tag/[tag]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import BlogExplore from "@/components/blog/BlogExplore";
import NewsPostCard from "@/components/blog/NewsPostCard";
import { getPostsByTag, getTags } from "@/lib/blog";
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
  const tags = await getTags();
  return tags.map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tagSlug = decodeURIComponent(params.tag).toLowerCase().trim();
  const tags = await getTags();
  const tag = tags.find((t) => t.slug === tagSlug);
  const label = tag?.title ?? tagSlug;

  return {
    title: `#${label} | Blog FinanzasEU`,
    description: `Todos los artículos etiquetados con #${label}.`,
    alternates: {
      canonical: `/blog/tag/${encodeURIComponent(tagSlug)}`,
    },
  };
}

export default async function TagPage({ params }: Props) {
  const tagSlug = decodeURIComponent(params.tag).toLowerCase().trim();
  const tags = await getTags();
  const tag = tags.find((t) => t.slug === tagSlug);
  const label = tag?.title ?? tagSlug;

  const posts = await getPostsByTag(tagSlug);

  const pageUrl = `${SITE_URL}/blog/tag/${encodeURIComponent(tagSlug)}`;
  const pageTitle = `#${label} | Blog FinanzasEU`;
  const pageDescription = `Todos los artículos etiquetados con #${label}.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
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
    inLanguage: "es-ES",
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
        url: `${SITE_URL}/blog/${post.slug}`,
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
          <Link href="/blog" className="underline-offset-4 hover:underline">
            Blog
          </Link>{" "}
          <span className="text-muted-foreground/70">/</span> Tag
        </p>

        <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
          #{label}
        </h1>

        <p className="text-base text-muted-foreground md:text-lg">
          {posts.length} artículo{posts.length !== 1 ? "s" : ""}.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-base text-muted-foreground">
          No hay artículos con la etiqueta <strong>#{label}</strong> todavía.
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

      <BlogExplore />
    </>
  );
}

