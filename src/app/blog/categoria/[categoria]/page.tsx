// src/app/blog/categoria/[categoria]/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";

import BlogExplore from "@/components/blog/BlogExplore";
import NewsPostCard from "@/components/blog/NewsPostCard";
import { getCategories, getPostsByCategory } from "@/lib/blog";
import { LEGACY_CATEGORIES } from "@/lib/blog/legacyTaxonomy";
import {
  DEFAULT_OG_IMAGE_URL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  toJsonLd,
} from "@/lib/seo";

type Props = {
  params: Promise<{
    categoria: string;
  }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams(): Promise<Array<{ categoria: string }>> {
  const categories = await getCategories();
  return categories.map((cat) => ({ categoria: cat.slug }));
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === categoria);

  if (!cat) {
    const legacy = LEGACY_CATEGORIES.es[categoria];
    if (legacy) permanentRedirect(`/blog/categoria/${legacy}`);
    return {
      title: "Categoría no encontrada",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: cat.title,
    description: `Todos los artículos sobre ${cat.title.toLowerCase()}: guías, opiniones y trucos.`,
    ...(cat.count < 3 ? { robots: { index: false, follow: true } } : {}),
    alternates: {
      canonical: `/blog/categoria/${encodeURIComponent(categoria)}`,
    },
  };
}

export default async function CategoryPage(props: Props) {
  const params = await props.params;
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === categoria);

  // C4: categorías desconocidas devuelven 404 (antes: 200 indexable con
  // un "Categoría no encontrada" renderizado inline). Las categorías
  // retiradas en la consolidación de taxonomía (F-04) redirigen a su
  // superviviente.
  if (!cat) {
    const legacy = LEGACY_CATEGORIES.es[categoria];
    if (legacy) permanentRedirect(`/blog/categoria/${legacy}`);
    notFound();
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
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-text">
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

