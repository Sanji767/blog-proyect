// src/app/en/blog/categoria/[categoria]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import BlogExplore from "@/components/blog/BlogExplore";
import NewsPostCard from "@/components/blog/NewsPostCard";
import { getCategories, getPostsByCategory } from "@/lib/blog";
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
    categoria: string;
  };
};

export async function generateStaticParams(): Promise<Array<{ categoria: string }>> {
  const categories = await getCategories("en");
  return categories.map((cat) => ({ categoria: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const categories = await getCategories("en");
  const cat = categories.find((c) => c.slug === categoria);

  if (!cat) return { title: "Category not found | FinanzasEU" };

  return {
    title: `${cat.title} | FinanzasEU Blog`,
    description: `All articles about ${cat.title.toLowerCase()}: guides, reviews and practical tips.`,
    alternates: {
      canonical: `/en/blog/categoria/${encodeURIComponent(categoria)}`,
    },
  };
}

export default async function CategoryPageEn({ params }: Props) {
  const locale = "en" as const;
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const categories = await getCategories(locale);
  const cat = categories.find((c) => c.slug === categoria);

  if (!cat) {
    return (
      <div className="py-16 text-center">
        <p className="text-base text-muted-foreground">Category not found.</p>
      </div>
    );
  }

  const posts = await getPostsByCategory(categoria, locale);

  const pageUrl = `${SITE_URL}/en/blog/categoria/${encodeURIComponent(categoria)}`;
  const pageTitle = `${cat.title} | FinanzasEU Blog`;
  const pageDescription = `All articles about ${cat.title.toLowerCase()}: guides, reviews and practical tips.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/en/blog` },
      { "@type": "ListItem", position: 3, name: cat.title, item: pageUrl },
    ],
  };

  const categoryCollectionJsonLd = {
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(categoryCollectionJsonLd) }}
      />

      <header className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <Link
            href={withLocale("/blog", locale)}
            className="underline-offset-4 hover:underline"
          >
            Blog
          </Link>{" "}
          <span className="text-muted-foreground/70">/</span> Category
        </p>

        <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
          {cat.title}
        </h1>

        <p className="text-base text-muted-foreground md:text-lg">
          {posts.length} article{posts.length !== 1 ? "s" : ""}.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-base text-muted-foreground">
          No articles in <strong>{cat.title}</strong> yet.
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
