// src/app/blog/categoria/[categoria]/page.tsx
import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPostPreviews, getCategories } from "@/lib/blog";
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

export function generateStaticParams(): Array<{ categoria: string }> {
  return getCategories().map((cat) => ({ categoria: cat.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const cat = getCategories().find((c) => c.slug === categoria);

  if (!cat) {
    return { title: "Categoría no encontrada | FinanzasEU" };
  }

  return {
    title: `${cat.title} | Blog FinanzasEU`,
    description: `Todos los artículos sobre ${cat.title.toLowerCase()}: guías, opiniones y trucos.`,
    alternates: {
      canonical: `/blog/categoria/${encodeURIComponent(categoria)}`,
    },
  };
}

export default function CategoryPage({ params }: Props) {
  const categoria = decodeURIComponent(params.categoria).toLowerCase().trim();
  const cat = getCategories().find((c) => c.slug === categoria);

  if (!cat) {
    return (
      <Container className="py-20 text-center">
        <p className="text-lg text-muted-foreground">Categoría no encontrada</p>
      </Container>
    );
  }

  const posts = getAllPostPreviews().filter((p) => p.category === categoria);

  const pageUrl = `${SITE_URL}/blog/categoria/${encodeURIComponent(categoria)}`;
  const pageTitle = `${cat.title} | Blog FinanzasEU`;
  const pageDescription = `Todos los artículos sobre ${cat.title.toLowerCase()}: guías, opiniones y trucos.`;

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
        name: cat.title,
        item: pageUrl,
      },
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
      {/* Schema.org: Breadcrumbs + CollectionPage (Category) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(categoryCollectionJsonLd),
        }}
      />

      <Container className="py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-black mb-4">{cat.title}</h1>
          <p className="text-xl text-muted-foreground">
            {posts.length} artículo{posts.length !== 1 ? "s" : ""} en esta categoría
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </Container>
    </>
  );
}
