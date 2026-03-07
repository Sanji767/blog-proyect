import type { BlogPostPreview } from "@/lib/blog/types";
import EditorialPostRow from "@/components/blog/EditorialPostRow";

export default function EditorialPostList({
  posts,
  title,
  startIndex = 0,
}: {
  posts: BlogPostPreview[];
  title?: string;
  startIndex?: number;
}) {
  if (!posts.length) return null;

  return (
    <section className="mt-14">
      {title ? (
        <div className="mb-6 flex items-baseline justify-between gap-6">
          <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
            {title}
          </h2>
        </div>
      ) : null}

      <ul className="border-t border-border/50">
        {posts.map((post, idx) => (
          <EditorialPostRow
            key={post.slug}
            post={post}
            index={startIndex + idx}
          />
        ))}
      </ul>
    </section>
  );
}

