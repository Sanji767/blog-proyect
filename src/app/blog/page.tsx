// src/app/blog/page.tsx
import type { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";
import BlogHeader from "@/components/blog/BlogHeader";
import { getAllPostPreviews } from "@/lib/blog";
import {
  DEFAULT_OG_IMAGE_URL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  toJsonLd,
} from "@/lib/seo";

const BLOG_PAGE_TITLE =
  "Blog FinanzasEU — guías prácticas de bancos, IBAN y comisiones (2026)";
const BLOG_PAGE_DESCRIPTION =
  "Comparativas honestas, opiniones reales y trucos para ahorrar con Revolut, Wise, N26 y más.";

export const metadata: Metadata = {
  title: BLOG_PAGE_TITLE,
  description: BLOG_PAGE_DESCRIPTION,
  alternates: {
    canonical: "/blog",
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPostPreviews();
  const featured = allPosts.filter((p) => p.featured).slice(0, 3);
  const normal = allPosts.filter((p) => !featured.some((f) => f.slug === p.slug));

  const pageUrl = `${SITE_URL}/blog`;

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
        item: pageUrl,
      },
    ],
  };

  const blogCollectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: BLOG_PAGE_TITLE,
    description: BLOG_PAGE_DESCRIPTION,
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
      itemListElement: allPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
        name: post.title,
      })),
    },
  };

  return (
    <>
      {/* Schema.org: Breadcrumbs + CollectionPage (Blog index) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(blogCollectionJsonLd),
        }}
      />

      <BlogHeader total={allPosts.length} />

      {featured.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Destacados del momento
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((post, i) => (
              <BlogCard key={post.slug} post={post} variant="featured" index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-24">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          Todos los artículos
        </h2>
        {normal.length === 0 ? (
          <p className="text-center text-muted-foreground py-20 text-lg">
            Pronto más guías brutales
          </p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {normal.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i + featured.length} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-32 text-center">
        <p className="text-xl text-muted-foreground mb-8">
          ¿No encuentras lo que buscas?
        </p>
        <a
          href="/contacto"
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-primary/80 px-10 py-5 text-xl font-bold text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
        >
          Pídeme el tema que quieras → ¡Gratis!
        </a>
      </section>
    </>
  );
}
