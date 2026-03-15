// src/app/blog/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import BlogExplore from "@/components/blog/BlogExplore";
import LatestNewsRail from "@/components/blog/LatestNewsRail";
import EditorialPostRow from "@/components/blog/EditorialPostRow";
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
    languages: {
      es: "/blog",
      en: "/en/blog",
    },
  },
};

export default async function BlogPage() {
  const allPosts = await getAllPostPreviews();
  const pageUrl = `${SITE_URL}/blog`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
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
      itemListElement: allPosts.map((post, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}/blog/${post.slug}`,
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
          Ideas, guías y experiencias sobre{" "}
          <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
            finanzas
          </span>{" "}
          en Europa.
        </h1>

        <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
          Lecturas claras sobre bancos digitales, IBAN, comisiones y herramientas
          útiles. Menos marketing, más criterio.
        </p>

        <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
          {[
            { href: "/", label: "Inicio" },
            { href: "/blog", label: "Artículos" },
            { href: "/sobre", label: "Sobre" },
          ].map((item, idx, arr) => (
            <span key={item.href} className="inline-flex items-center gap-x-4">
              <Link
                href={item.href}
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
          Todavía no hay artículos publicados.
        </p>
      ) : (
        <>
          <LatestNewsRail
            posts={railPosts}
            title="Latest News"
            subtitle="Lecturas recientes, sin tarjetas genéricas ni ruido."
          />

          {remainingPosts.length > 0 ? (
            <section className="mt-14">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                Más artículos
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

      <BlogExplore />

      <p className="mt-16 max-w-3xl text-sm text-muted-foreground">
        ¿Tienes una pregunta concreta o quieres proponer un tema?{" "}
        <Link href="/contacto" className="text-foreground underline-offset-4 hover:underline">
          Escríbeme
        </Link>
        .
      </p>
    </>
  );
}
