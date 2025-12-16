// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import TableOfContents from "@/components/blog/TableOfContents";
import { getPostBySlug, getAllPosts } from "@/lib/blog";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";

import React from "react";                    // ← Necesario para React.Children
import type { Components } from "react-markdown"; // ← Tipo oficial

import { Calendar, Clock, Eye, Tag } from "lucide-react";
import type { Metadata } from "next";

// ================================================================
// AQUÍ ESTÁ EL MarkdownComponents CORREGIDO (TypeScript 100% feliz)
// ================================================================
const MarkdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-20 mb-6 scroll-mt-32">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-5">
      {children}
    </h3>
  ),
  blockquote: ({ children }) => {
    const hasHeading = React.Children.toArray(children).some(
      (child: any) => child?.type === "h2" || child?.type === "h3"
    );

    if (hasHeading) {
      return (
        <div className="not-prose my-12 rounded-3xl border border-border bg-gradient-to-r from-primary/10 to-primary/5 p-8 shadow-lg">
          {children}
        </div>
      );
    }

    return (
      <blockquote className="border-l-4 border-primary bg-muted/40 rounded-r-xl py-8 px-10 my-10 text-lg">
        {children}
      </blockquote>
    );
  },
  p: ({ children }) => <p className="leading-relaxed text-lg mb-6">{children}</p>,
  strong: ({ children }) => <strong className="font-bold">{children}</strong>,

  // ← EL QUE ARREGLA EL ERROR DE TYPESCRIPT
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-medium hover:underline transition-colors"
      {...props}
    >
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

// ================================================================
// Resto del componente (metadata, página, etc.)
// ================================================================
export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: "Artículo no encontrado | FinanzasEU" };

  return {
    title: `${post.title} | FinanzasEU`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug && p.tags?.some((tag) => post.tags?.includes(tag)))
    .slice(0, 3);

  const publishedDate = new Date(post.date);

  return (
    <Container className="max-w-7xl py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_300px] xl:gap-16">
        {/* CONTENIDO PRINCIPAL */}
        <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
          {/* Header, imagen, TOC... (igual que antes) */}
          {/* ... (código que ya tenías) ... */}

          {/* ← AQUÍ USAMOS EL MarkdownComponents */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm, remarkHeadingId]}
            rehypePlugins={[
              rehypeSlug,
              [rehypeAutolinkHeadings, { behavior: "wrap" }],
              [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
            ]}
            components={MarkdownComponents}   // ← ¡¡AQUÍ!!
          >
            {post.content}
          </ReactMarkdown>

          {/* Relacionados y CTA final (igual que antes) */}
        </article>

        {/* Sidebar con tags */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="bg-muted/30 rounded-2xl p-6 border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags?.map((tag) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>
    </Container>
  );
}