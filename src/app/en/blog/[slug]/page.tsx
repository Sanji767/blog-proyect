// src/app/en/blog/[slug]/page.tsx
//
// NOTE (C4): never add a loading.tsx to src/app/en/blog/. A loading.tsx
// wraps this page in a Suspense boundary and Next.js streams the shell
// with HTTP 200 before the notFound() below can run, turning every
// missing slug into a soft-404 (200 + "not found" UI). The ES template
// had exactly that bug via src/app/blog/loading.tsx.
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";

import TableOfContents from "@/components/blog/TableOfContents";
import PortableTextRenderer from "@/components/blog/PortableTextRenderer";
import LeadCaptureInline from "@/components/leads/LeadCaptureInline";
import { getAllPostSlugs, getPostBySlug } from "@/lib/blog";
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

const locale = "en" as const;

export const dynamic = "force-dynamic";
export const dynamicParams = true;
export const revalidate = 0;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs(locale);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const post = await getPostBySlug(params.slug, locale);
  if (!post) {
    // A4: ES-only Sanity articles no longer serve under /en/, so they land
    // on the "Spanish version" fallback below. Give that stub an honest
    // title and point the canonical at the real (Spanish) article.
    // getPostBySlug is React-cached, so this costs no extra fetch.
    const postEs = await getPostBySlug(params.slug, "es");
    if (postEs) {
      return {
        title: "Available in Spanish | FinanzasEU",
        description: `This article is currently available in Spanish: ${postEs.title}`,
        alternates: {
          canonical: `/blog/${postEs.slug}`,
        },
        robots: { index: false, follow: true },
      };
    }
    return {
      title: "Article not found | FinanzasEU",
      robots: { index: false, follow: true },
    };
  }

  // A6: full OG metadata, ported from the ES template (which had it; this
  // template only set openGraph.locale).
  const canonicalPath = `/en/blog/${post.slug}`;
  const ogImage = post.coverImage ?? post.image;
  const publishedTime = toIsoDate(post.date);
  const description =
    (post.description ?? "").trim() ||
    (post.excerpt ?? "").trim() ||
    "FinanzasEU article";

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
      locale: "en_US",
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

export default async function BlogPostPageEn(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const post = await getPostBySlug(params.slug, locale);

  if (!post) {
    const postEs = await getPostBySlug(params.slug, "es");
    if (!postEs) notFound();

    return (
      <section className="rounded-2xl border border-border bg-card p-6 text-sm text-muted-foreground shadow-soft">
        <p className="font-semibold text-foreground">Spanish version</p>
        <p className="mt-1">
          This article is currently available in Spanish:{" "}
          <Link
            href={`/blog/${params.slug}`}
            className="font-semibold text-foreground underline-offset-4 hover:underline"
          >
            /blog/{params.slug}
          </Link>
          .
        </p>
      </section>
    );
  }

  const publishedDate = new Date(post.date);
  const formattedDate = publishedDate.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const authorLabel = (post.author ?? "").trim() || "FinanzasEU Team";

  const markdownContent =
    typeof post.content === "string" ? stripLeadingMarkdownH1(post.content) : null;

  // A6: structured data + hero image, ported from the ES template
  // (src/app/blog/[slug]/page.tsx). Organization JSON-LD is deliberately
  // NOT duplicated here: the root layout already emits it on every page
  // (src/app/layout.tsx).
  const canonicalUrl = `${SITE_URL}/en/blog/${post.slug}`;

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
        name: "Home",
        item: `${SITE_URL}/en`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/en/blog`,
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
    inLanguage: "en-US",
    timeRequired: toIsoDurationFromReadingTime(post.readingTime),
    isAccessibleForFree: true,
  };

  const faqItems = markdownContent ? extractFaqFromMarkdown(markdownContent) : [];
  const faqJsonLd =
    faqItems.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "@id": `${canonicalUrl}#faq`,
          url: canonicalUrl,
          inLanguage: "en-US",
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

  return (
    <>
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

      <article className="space-y-12">
        <header className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            Updated {formattedDate}
            {post.readingTime ? <span> · {post.readingTime}</span> : null}
          </p>
          <p className="text-sm text-muted-foreground">
            By{" "}
            <Link
              href="/en/sobre"
              className="font-semibold text-foreground underline-offset-4 hover:underline"
            >
              {authorLabel}
            </Link>
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            {post.title}
          </h1>
          {post.description ? (
            <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
              {post.description}
            </p>
          ) : null}
        </header>

        {heroImage ? (
          <figure className="mx-auto mt-12 max-w-5xl">
            <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-secondary shadow-soft">
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

        <section className="grid gap-10 lg:grid-cols-[1fr_0.36fr] lg:items-start">
          <div className="min-w-0">
            {markdownContent ? (
              <div className="lg:hidden">
                <details className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                  <summary className="cursor-pointer text-sm font-semibold">
                    Table of contents
                  </summary>
                  <div className="mt-4">
                    <TableOfContents
                      content={markdownContent}
                      title="In this article"
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
                    [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
                  ]}
                >
                  {markdownContent ?? post.content}
                </ReactMarkdown>
              ) : (
                <PortableTextRenderer value={post.content} />
              )}
            </div>
            <p className="mt-10 rounded-xl border border-border/60 bg-muted/40 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
              Informational content only: this article is not financial advice.
              Terms, fees and interest rates can change; always check each
              provider&apos;s official information before signing up.
            </p>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <TableOfContents
                content={markdownContent ?? undefined}
                title="In this article"
                className="max-h-[calc(100vh-10rem)] overflow-auto"
              />
            </div>
          </aside>
        </section>

        <LeadCaptureInline source={`blog:${post.slug}`} />
      </article>
    </>
  );
}
