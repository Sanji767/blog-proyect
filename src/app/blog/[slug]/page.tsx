// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";
import type { BlogPostPreview } from "@/lib/blog/types";

import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";

import TableOfContents from "@/components/blog/TableOfContents";
import EditorialPostRow from "@/components/blog/EditorialPostRow";
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";
import { getAllPostPreviews, getAllPostSlugs, getPostBySlug } from "@/lib/blog";
import { extractFaqFromMarkdown } from "@/lib/blog/extractFaq";
import { stripLeadingMarkdownH1 } from "@/lib/blog/markdown";
import {
  DEFAULT_OG_IMAGE_URL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  toAbsoluteUrl,
  toIsoDate,
  toIsoDurationFromReadingTime,
  toJsonLd,
} from "@/lib/seo";

function humanizeSlug(value: string): string {
  const normalized = value.trim().replace(/-/g, " ");
  return normalized
    ? normalized.charAt(0).toUpperCase() + normalized.slice(1)
    : value;
}

// -------------------------------------------------------------
// Generación de parámetros estáticos
export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

// Metadata dinámica (tipada y con StaticImageData compatible)
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return { title: "Artículo no encontrado | FinanzasEU" };

  const canonicalPath = `/blog/${post.slug}`;
  const ogImage = post.coverImage ?? post.image;
  const publishedTime = toIsoDate(post.date);
  const description =
    (post.description ?? "").trim() ||
    (post.excerpt ?? "").trim() ||
    "Artículo de FinanzasEU";

  return {
    title: `${post.title} | FinanzasEU`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: canonicalPath,
      publishedTime,
      modifiedTime: publishedTime,
      images: ogImage
        ? [
            {
              url: typeof ogImage === "string" ? ogImage : ogImage.src,
            },
          ]
        : [
            {
              url: DEFAULT_OG_IMAGE_URL,
            },
          ],
    },
    keywords: post.tags,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;
  const authorLabel = (post.author ?? "").trim() || "Equipo editorial";

  const publishedDate = new Date(post.date);
  const formattedDate = publishedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const heroImage = post.coverImage ?? post.image;
  const heroImageUrl = heroImage
    ? typeof heroImage === "string"
      ? heroImage
      : heroImage.src
    : undefined;
  const heroImageAbsoluteUrl = heroImageUrl
    ? toAbsoluteUrl(heroImageUrl)
    : DEFAULT_OG_IMAGE_URL;

  const publishedIso = toIsoDate(post.date);
  const description =
    (post.description ?? "").trim() || (post.excerpt ?? "").trim() || undefined;

  const categorySlug = String(post.category ?? "general").toLowerCase().trim();
  const categoryLabel = humanizeSlug(categorySlug || "general");

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
        name: post.title,
        item: canonicalUrl,
      },
    ],
  };

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${canonicalUrl}#blogposting`,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    url: canonicalUrl,
    headline: post.title,
    description,
    image: [heroImageAbsoluteUrl],
    datePublished: publishedIso,
    dateModified: publishedIso,
    author: post.author
      ? {
          "@type": "Person",
          name: post.author,
        }
      : {
          "@type": "Organization",
          name: SITE_NAME,
          url: SITE_URL,
        },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: SITE_LOGO_URL,
      },
    },
    articleSection: post.category || undefined,
    keywords: post.tags?.length ? post.tags.join(", ") : undefined,
    inLanguage: "es-ES",
    timeRequired: toIsoDurationFromReadingTime(post.readingTime),
    isAccessibleForFree: true,
  };

  const markdownContent =
    typeof post.content === "string" ? stripLeadingMarkdownH1(post.content) : "";
  const faqItems = markdownContent ? extractFaqFromMarkdown(markdownContent) : [];
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          url: canonicalUrl,
          inLanguage: "es-ES",
          mainEntity: faqItems.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: {
              "@type": "Answer",
              text: item.answer,
            },
          })),
        }
      : null;

  const related: BlogPostPreview[] = (await getAllPostPreviews())
    .filter(
      (p) =>
        p.slug !== post.slug &&
        (p.tags?.length ?? 0) > 0 &&
        p.tags.some((tag: string) => post.tags.includes(tag)),
    )
    .slice(0, 3);

  return (
    <div className="space-y-20">
      {/* Schema.org: Breadcrumbs + BlogPosting (Rich Results) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(breadcrumbJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: toJsonLd(blogPostingJsonLd),
        }}
      />
      {faqJsonLd ? (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: toJsonLd(faqJsonLd),
          }}
        />
      ) : null}

      <article>
        <header className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent sm:p-10">
          <div className="pointer-events-none absolute -top-28 -right-28 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />

          <div className="relative mx-auto max-w-3xl">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1.5 text-xs font-semibold text-secondary-foreground/80 transition-colors hover:border-secondary-foreground/20 hover:text-secondary-foreground"
            >
              <span aria-hidden="true">←</span>
              Artículos
            </Link>

            <h1 className="mt-6 text-balance text-4xl font-black leading-[1.05] tracking-tight text-accent md:text-6xl">
              {post.title}
            </h1>

            {description ? (
              <p className="mt-6 text-pretty text-base leading-relaxed text-secondary-foreground/80 md:text-lg">
                {description}
              </p>
            ) : null}

            <div className="mt-7 flex flex-wrap items-center gap-2 text-xs">
              <Link
                href={`/blog/categoria/${encodeURIComponent(categorySlug)}`}
                className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 font-black uppercase tracking-[0.22em] text-primary transition-colors hover:border-secondary-foreground/20 hover:text-accent"
              >
                {categoryLabel}
              </Link>

              <time
                dateTime={post.date}
                className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 font-semibold text-secondary-foreground/80"
              >
                {formattedDate}
              </time>

              {post.readingTime ? (
                <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 font-semibold text-secondary-foreground/80">
                  {post.readingTime}
                </span>
              ) : null}

              <Link
                href="/sobre"
                className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 font-semibold text-secondary-foreground/80 transition-colors hover:border-secondary-foreground/20 hover:text-secondary-foreground"
              >
                {authorLabel}
              </Link>

              {post.views !== undefined ? (
                <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 font-semibold text-secondary-foreground/80">
                  {post.views.toLocaleString("es-ES")} vistas
                </span>
              ) : null}
            </div>

            {post.tags?.length ? (
              <div className="mt-7 flex flex-wrap gap-2">
                {post.tags.map((tag) => {
                  const slug = String(tag ?? "").toLowerCase().trim();
                  if (!slug) return null;
                  return (
                    <Link
                      key={slug}
                      href={`/blog/tag/${encodeURIComponent(slug)}`}
                      className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 text-xs font-semibold text-secondary-foreground/75 transition-colors hover:border-accent hover:text-secondary-foreground"
                    >
                      #{humanizeSlug(slug)}
                    </Link>
                  );
                })}
              </div>
            ) : null}
          </div>
        </header>

        {heroImage ? (
          <figure className="mx-auto mt-12 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border-2 border-secondary bg-secondary shadow-soft">
              <Image
                src={heroImage}
                alt={post.title}
                fill
                priority
                sizes="(min-width: 1024px) 900px, 100vw"
                className="object-cover"
              />
            </div>
          </figure>
        ) : null}

        <section className="mt-14 lg:grid lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-12">
          <div className="min-w-0">
            {markdownContent ? (
              <div className="not-prose lg:hidden">
                <details className="rounded-2xl border-2 border-secondary bg-secondary p-5 text-secondary-foreground shadow-soft">
                  <summary className="cursor-pointer text-sm font-black uppercase tracking-[0.22em] text-primary">
                    Índice del artículo
                  </summary>
                  <div className="mt-4">
                    <TableOfContents
                      content={markdownContent}
                      title="En este artículo"
                      className="border-0 bg-transparent p-0 shadow-none"
                    />
                  </div>
                </details>
              </div>
            ) : null}

            <div className="mt-10 prose prose-lg dark:prose-invert">
              {typeof post.content === "string" ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkHeadingId]}
                  rehypePlugins={[
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                    [
                      rehypeExternalLinks,
                      { target: "_blank", rel: ["noopener", "noreferrer"] },
                    ],
                  ]}
                >
                  {markdownContent}
                </ReactMarkdown>
              ) : (
                <PortableTextRenderer value={post.content} />
              )}
            </div>
          </div>

          {markdownContent ? (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents
                  content={markdownContent}
                  title="En este artículo"
                  className="max-h-[calc(100vh-10rem)] overflow-auto"
                />
              </div>
            </aside>
          ) : null}
        </section>
      </article>

      <section className="mt-14 overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Herramientas
        </p>
        <h2 className="mt-4 text-balance text-2xl font-black tracking-tight text-accent md:text-3xl">
          Si quieres pasar de leer a decidir, usa esto.
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary-foreground/80 md:text-base">
          Utilidades gratuitas para validar IBAN, comparar bancos y proyectar
          tu dinero sin humo (interés compuesto e inflación).
        </p>

        <div className="mt-7 grid gap-3 sm:grid-cols-2">
          {[
            {
              href: "/iban",
              title: "IBAN Scanner",
              meta: "Valida país, SEPA y entidad",
            },
            {
              href: "/comparativa",
              title: "Comparativa de bancos",
              meta: "Filtra y exporta a PDF",
            },
            {
              href: "/herramientas/interes-compuesto",
              title: "Interés compuesto",
              meta: "Aportaciones + inflación",
            },
            {
              href: "/herramientas/inflacion",
              title: "Inflación",
              meta: "Poder adquisitivo real",
            },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center justify-between gap-4 rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-5 py-4 transition-colors hover:border-secondary-foreground/20"
            >
              <span className="min-w-0">
                <span className="block truncate text-sm font-black text-secondary-foreground group-hover:text-accent">
                  {item.title}
                </span>
                <span className="mt-1 block truncate text-xs text-secondary-foreground/70">
                  {item.meta}
                </span>
              </span>
              <span className="text-xs font-black uppercase tracking-[0.22em] text-primary">
                Abrir →
              </span>
            </Link>
          ))}
        </div>

        <p className="mt-7 text-xs text-secondary-foreground/70">
          Todas las herramientas están en{" "}
          <Link
            href="/herramientas"
            className="font-semibold text-secondary-foreground underline-offset-4 hover:underline"
          >
            /herramientas
          </Link>
          .
        </p>
      </section>

      {related.length > 0 ? (
        <section className="space-y-6">
          <header className="mx-auto max-w-3xl">
            <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Siguiente lectura
            </h2>
          </header>
          <ul className="border-t border-border/50">
            {related.map((relatedPost, idx) => (
              <EditorialPostRow
                key={relatedPost.slug}
                post={relatedPost}
                index={idx}
                dense
                showDescription={false}
              />
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
