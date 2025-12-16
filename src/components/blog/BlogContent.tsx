// src/components/blog/BlogContent.tsx
import type { BlogPost } from "@/lib/blog/types";
import CategoryBadge from "./CategoryBadge";
import TagBadge from "./TagBadge";

export default function BlogContent({ post }: { post: BlogPost }) {
  return (
    <article className="space-y-6">
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryBadge slug={post.category} />
          <span className="text-xs text-muted-foreground">
            {new Date(post.date).toLocaleDateString("es-ES")}
          </span>
          {post.author && (
            <span className="text-xs text-muted-foreground">• {post.author}</span>
          )}
        </div>

        <h1 className="text-3xl md:text-4xl font-black tracking-tight">
          {post.title}
        </h1>

        {post.description && (
          <p className="text-muted-foreground">{post.description}</p>
        )}

        {!!post.tags?.length && (
          <div className="flex flex-wrap gap-2 pt-1">
            {post.tags.map((t) => (
              <TagBadge key={t} slug={t} />
            ))}
          </div>
        )}
      </header>

      <div
        className="prose prose-neutral dark:prose-invert max-w-none leading-relaxed"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  );
}
