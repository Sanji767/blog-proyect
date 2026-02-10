// src/components/blog/BlogContent.tsx
import type { BlogPost } from "@/lib/blog/types";
import { Calendar, Clock, Eye, User2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import CategoryBadge from "./CategoryBadge";
import TagBadge from "./TagBadge";
import PortableTextRenderer from "./PortableTextRenderer";
import { stripLeadingMarkdownH1 } from "@/lib/blog/markdown";

export default function BlogContent({ post }: { post: BlogPost }) {
  const publishedDate = new Date(post.date);

  return (
    <article className="mx-auto w-full max-w-3xl space-y-10 md:space-y-12">
      <header className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm md:p-10">
        <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-emerald-400/10 blur-3xl" />

        <div className="relative space-y-5">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryBadge slug={post.category} />

            <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
              <Calendar className="h-3.5 w-3.5" />
              <time dateTime={post.date}>
                {publishedDate.toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            </span>

            {post.readingTime && (
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
                <Clock className="h-3.5 w-3.5" />
                {post.readingTime}
              </span>
            )}

            {post.author && (
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
                <User2 className="h-3.5 w-3.5" />
                {post.author}
              </span>
            )}

            {typeof post.views === "number" && (
              <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur">
                <Eye className="h-3.5 w-3.5" />
                {post.views.toLocaleString("es-ES")} vistas
              </span>
            )}
          </div>

          <h1 className="text-3xl font-black tracking-tight leading-[1.05] md:text-5xl">
            {post.title}
          </h1>

          {post.description && (
            <p className="max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
              {post.description}
            </p>
          )}

          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {post.tags.map((t) => (
                <TagBadge key={t} slug={t} />
              ))}
            </div>
          )}
        </div>
      </header>

      <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-sm md:p-10">
        <div className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed">
          {typeof post.content === "string" ? (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[
                rehypeSlug,
                [rehypeAutolinkHeadings, { behavior: "wrap" }],
                [
                  rehypeExternalLinks,
                  { target: "_blank", rel: ["noopener", "noreferrer"] },
                ],
              ]}
            >
              {stripLeadingMarkdownH1(post.content)}
            </ReactMarkdown>
          ) : (
            <PortableTextRenderer value={post.content} />
          )}
        </div>
      </section>
    </article>
  );
}
