// src/components/blog/BlogList.tsx
import BlogCard from "./BlogCard";
import type { BlogPost } from "@/lib/blog/types";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  if (!posts.length) {
    return (
      <div className="rounded-2xl border bg-background p-8 text-center text-sm text-muted-foreground">
        No hay artículos todavía.
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {posts.map((p) => (
        <BlogCard key={p.slug} post={p} />
      ))}
    </div>
  );
}
