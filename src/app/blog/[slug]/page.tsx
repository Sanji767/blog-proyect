// src/app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import { Calendar, Clock, Eye, Tag } from "lucide-react";
import type { Metadata } from "next";
import type { Components } from "react-markdown";
import type { BlogPost } from "@/lib/blog/types";


// Import dinámico para ReactMarkdown
import dynamic from "next/dynamic";
const ReactMarkdown = dynamic(() => import("react-markdown"), { ssr: false });

// Plugins Markdown
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";

import { getPostBySlug, getAllPosts } from "@/lib/blog";

// Markdown Components tipados
const MarkdownComponents: Components = {
  h2: ({ children }) => (
    <h2 className="text-3xl md:text-4xl font-black tracking-tight mt-20 mb-6 scroll-mt-32">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-5">{children}</h3>
  ),
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

  return {
    title: `${post.title} | FinanzasEU`,
    description: post.description ?? "Artículo de FinanzasEU",
    openGraph: {
      title: post.title,
      description: post.description ?? "",
      type: "article",
      publishedTime: post.date,
      images: post.image
        ? [
            {
              url: typeof post.image === "string" ? post.image : post.image.src, // <-- conversión segura
            },
          ]
        : [],
    },
  };
}

// Página del post
export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const publishedDate = new Date(post.date);

  // Posts relacionados (tags 100% tipados)
  const related: BlogPost[] = getAllPosts()
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tags.length > 0 &&
        p.tags.some((tag: string) => post.tags.includes(tag))
    )
    .slice(0, 3);

  return (
    <Container className="max-w-7xl py-16 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_300px] xl:gap-16">
        {/* Contenido principal */}
        <article className="prose prose-lg dark:prose-invert max-w-none mx-auto">
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <time dateTime={post.date}>
                  {publishedDate.toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" })}
                </time>
              </div>
              {post.readingTime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  {post.readingTime}
                </div>
              )}
              {post.views !== undefined && (
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5" />
                  {post.views.toLocaleString("es-ES")} vistas
                </div>
              )}
            </div>
          </header>

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
        </article>

        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-8">
            <div className="bg-muted/30 rounded-2xl p-6 border">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag: string) => (
                  <span key={tag} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Posts relacionados */}
      {related.length > 0 && (
        <section className="mt-24">
          <h2 className="text-3xl font-black text-center mb-12">Artículos relacionados</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {related.map((relatedPost: BlogPost) => (
              <BlogCard key={relatedPost.slug} post={relatedPost} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </Container>
  );
}
