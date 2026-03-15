import { notFound } from "next/navigation";
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
import { stripLeadingMarkdownH1 } from "@/lib/blog/markdown";

const locale = "en" as const;

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs(locale);
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug, locale);
  if (!post) {
    return {
      title: "Article not found | FinanzasEU",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${post.title} | FinanzasEU`,
    description: post.description ?? post.excerpt,
    alternates: {
      canonical: `/en/blog/${post.slug}`,
    },
    openGraph: {
      locale: "en_US",
    },
  };
}

export default async function BlogPostPageEn({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug, locale);

  if (!post) {
    const postEs = await getPostBySlug(params.slug, "es");
    if (!postEs) notFound();

    return (
      <section className="rounded-2xl border-2 border-border bg-card p-6 text-sm text-muted-foreground shadow-soft">
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

  const markdownContent =
    typeof post.content === "string" ? stripLeadingMarkdownH1(post.content) : null;

  return (
    <article className="space-y-12">
      <header className="space-y-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
          {formattedDate}
          {post.readingTime ? <span> · {post.readingTime}</span> : null}
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

      <section className="grid gap-10 lg:grid-cols-[1fr_0.36fr] lg:items-start">
        <div className="min-w-0">
          {markdownContent ? (
            <div className="lg:hidden">
              <details className="rounded-2xl border-2 border-border bg-card p-5 shadow-soft">
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
  );
}
