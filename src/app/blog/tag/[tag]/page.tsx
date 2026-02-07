// src/app/blog/tag/[tag]/page.tsx
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPostPreviews, getTags } from "@/lib/blog";
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

export function generateStaticParams(): Array<{ tag: string }> {
  return getTags().map((t) => ({ tag: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const tagSlug = decodeURIComponent(params.tag).toLowerCase().trim();
  const tag = getTags().find((t) => t.slug === tagSlug);
  const label = tag?.title ?? tagSlug;

  return {
    title: `#${label} | Blog FinanzasEU`,
    description: `Todos los artículos etiquetados con #${label}.`,
    alternates: {
      canonical: `/blog/tag/${encodeURIComponent(tagSlug)}`,
    },
  };
}

export default function TagPage({ params }: Props) {
  const tagSlug = decodeURIComponent(params.tag).toLowerCase().trim();
  const tag = getTags().find((t) => t.slug === tagSlug);
  const label = tag?.title ?? tagSlug;

  const posts = getAllPostPreviews().filter((p) => p.tags?.includes(tagSlug));

  const pageUrl = `${SITE_URL}/blog/tag/${encodeURIComponent(tagSlug)}`;
  const pageTitle = `#${label} | Blog FinanzasEU`;
  const pageDescription = `Todos los artículos etiquetados con #${label}.`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: `#${label}`,
        item: pageUrl,
      },
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
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO_URL,
      },
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: DEFAULT_OG_IMAGE_URL,
    },
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
      {/* Schema.org: Breadcrumbs + CollectionPage (Tag) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(tagCollectionJsonLd),
        }}
      />

      <Container className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black mb-4">#{label}</h1>
          <p className="text-xl text-muted-foreground">
            {posts.length} artículo{posts.length !== 1 ? "s" : ""} encontrado
            {posts.length !== 1 ? "s" : ""}
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground py-20 text-lg">
            No hay artículos con la etiqueta <strong>#{label}</strong> todavía.
          </p>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i} />
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
