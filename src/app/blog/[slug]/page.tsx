// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import BlogCard from "@/components/blog/BlogCard";
import CategoryBadge from "@/components/blog/CategoryBadge";
import TagBadge from "@/components/blog/TagBadge";
import TableOfContents from "@/components/blog/TableOfContents";
import { ArrowLeft, Calendar, Clock, Eye, User2 } from "lucide-react";
import type { Metadata } from "next";
import ReactMarkdown, { type Components } from "react-markdown";
import type { BlogPostPreview } from "@/lib/blog/types";

// Plugins Markdown
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";

import { getPostBySlug, getAllPosts } from "@/lib/blog";
import {
  DEFAULT_OG_IMAGE_URL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  toJsonLd,
  toAbsoluteUrl,
  toIsoDate,
  toIsoDurationFromReadingTime,
} from "@/lib/seo";

// Markdown Components tipados
const MarkdownComponents: Components = {
  h2: ({ node, className, children, ...props }) => {
    void node; // We don't render the AST node, but we must not forward it to the DOM.
    return (
      <h2
        {...props}
        className={[
          "text-3xl md:text-4xl font-black tracking-tight mt-20 mb-6 scroll-mt-32",
          className ?? "",
        ].join(" ")}
      >
        {children}
      </h2>
    );
  },
  h3: ({ node, className, children, ...props }) => {
    void node; // We don't render the AST node, but we must not forward it to the DOM.
    return (
      <h3
        {...props}
        className={[
          "text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-5 scroll-mt-32",
          className ?? "",
        ].join(" ")}
      >
        {children}
      </h3>
    );
  },
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-primary bg-muted/40 rounded-r-xl py-8 px-10 my-10 text-lg">{children}</blockquote>
  ),
  p: ({ children }) => <p className="leading-relaxed text-lg mb-6">{children}</p>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,
  a: ({ href, children, ...props }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary font-medium hover:underline transition-colors" {...props}>
      {children}
    </a>
  ),
  table: ({ children }) => (
    <div className="my-12 overflow-x-auto rounded-2xl border border-border/60 shadow-lg">
      <table className="min-w-full divide-y divide-border/40">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bg-primary/10">{children}</thead>,
  th: ({ children }) => <th className="px-6 py-4 text-left font-bold">{children}</th>,
  td: ({ children }) => <td className="px-6 py-4 border-t border-border/40">{children}</td>,
  tr: ({ children }) => <tr className="even:bg-muted/30 hover:bg-muted/50 transition">{children}</tr>,
};

// -------------------------------------------------------------
// Generación de parámetros estáticos
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

// Metadata dinámica (tipada y con StaticImageData compatible)
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
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
              url: typeof ogImage === "string" ? ogImage : ogImage.src, // <-- conversión segura
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

// Página del post
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const canonicalUrl = `${SITE_URL}/blog/${post.slug}`;

  const publishedDate = new Date(post.date);
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

  const formattedDate = publishedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Posts relacionados (tags 100% tipados)
  const related: BlogPostPreview[] = getAllPosts()
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tags.length > 0 &&
        p.tags.some((tag: string) => post.tags.includes(tag))
    )
    .slice(0, 3)
    .map((p) => {
      const { content, ...rest } = p;
      void content;
      return rest;
    });

  return (
    <div className="space-y-16">
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

      <article className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-white to-gray-50 shadow-lg dark:from-black/80 dark:to-gray-900">
        <header className="relative p-6 md:p-10">
          <div className="pointer-events-none absolute -top-36 -right-36 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />

          <div className="relative space-y-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Volver al blog
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <CategoryBadge slug={post.category} />

              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <time dateTime={post.date}>{formattedDate}</time>
              </span>

              {post.readingTime && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground">
                  <Clock className="h-3.5 w-3.5" />
                  {post.readingTime}
                </span>
              )}

              {post.author && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground">
                  <User2 className="h-3.5 w-3.5" />
                  {post.author}
                </span>
              )}

              {post.views !== undefined && (
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs text-muted-foreground">
                  <Eye className="h-3.5 w-3.5" />
                  {post.views.toLocaleString("es-ES")} vistas
                </span>
              )}
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
                {post.title}
              </h1>

              {(post.description || post.excerpt) && (
                <p className="max-w-2xl text-base md:text-lg leading-relaxed text-muted-foreground">
                  {post.description ?? post.excerpt}
                </p>
              )}
            </div>

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {post.tags.map((t) => (
                  <TagBadge key={t} slug={t} />
                ))}
              </div>
            )}
          </div>
        </header>

        {heroImage && (
          <div className="relative aspect-[16/9] w-full border-y border-border/50">
            <Image
              src={heroImage}
              alt={post.title}
              fill
              priority
              sizes="(min-width: 1024px) 900px, 100vw"
              className="object-cover"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/25 dark:to-black/45" />
          </div>
        )}

        <div className="p-6 md:p-10">
          <div className="lg:hidden mb-10">
            <TableOfContents title="En este artículo" />
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-3xl mx-auto">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkHeadingId]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
              ]}
              components={MarkdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="space-y-10">
          <div className="flex items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black tracking-tight">
                Artículos relacionados
              </h2>
              <p className="text-sm md:text-base text-muted-foreground">
                Siguiente lectura recomendada según etiquetas en común.
              </p>
            </div>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {related.map((relatedPost) => (
              <BlogCard
                key={relatedPost.slug}
                post={relatedPost}
                variant="compact"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
