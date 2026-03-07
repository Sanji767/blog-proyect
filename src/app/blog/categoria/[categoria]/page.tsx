// src/app/blog/categoria/[categoria]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import BlogExplore from "@/components/blog/BlogExplore";
import NewsPostCard from "@/components/blog/NewsPostCard";
import { getCategories, getPostsByCategory } from "@/lib/blog";
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
  const categories = await getCategories();
  return categories.map((cat) => ({ categoria: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === categoria);

  if (!cat) return { title: "Categoría no encontrada | FinanzasEU" };

  return {
    title: `${cat.title} | Blog FinanzasEU`,
    description: `Todos los artículos sobre ${cat.title.toLowerCase()}: guías, opiniones y trucos.`,
    alternates: {
      canonical: `/blog/categoria/${encodeURIComponent(categoria)}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === categoria);

  if (!cat) {
    return (
      <div className="py-16 text-center">
        <p className="text-base text-muted-foreground">Categoría no encontrada.</p>
      </div>
    );
  }

  const posts = await getPostsByCategory(categoria);

  const pageUrl = `${SITE_URL}/blog/categoria/${encodeURIComponent(categoria)}`;
  const pageTitle = `${cat.title} | Blog FinanzasEU`;
  const pageDescription = `Todos los artículos sobre ${cat.title.toLowerCase()}: guías, opiniones y trucos.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE_URL}/blog` },
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
        dangerouslySetInnerHTML={{ __html: toJsonLd(categoryCollectionJsonLd) }}
      />

      <header className="space-y-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          <Link href="/blog" className="underline-offset-4 hover:underline">
            Blog
          </Link>{" "}
          <span className="text-muted-foreground/70">/</span> Categoría
        </p>

        <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
          {cat.title}
        </h1>

        <p className="text-base text-muted-foreground md:text-lg">
          {posts.length} artículo{posts.length !== 1 ? "s" : ""}.
        </p>
      </header>

      {posts.length === 0 ? (
        <p className="mt-12 text-base text-muted-foreground">
          Todavía no hay artículos en <strong>{cat.title}</strong>.
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

