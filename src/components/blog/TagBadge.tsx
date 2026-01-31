// src/components/blog/TagBadge.tsx
import Link from "next/link";
import { getTags } from "@/lib/blog";          // ← ruta correcta (o "@/lib/blog/getTags" si está separado)
import type { Tag } from "@/lib/blog/types";  // ← el tipo centralizado (el mismo que BlogPost y Category)

export default function TagBadge({ slug }: { slug: string }) {
  const tags: Tag[] = getTags();
  const tag = tags.find((t) => t.slug === slug);

  const label = tag?.title ?? slug;

  return (
    <Link
      href={`/blog/tag/${slug}`}
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted"
    >
      {label}
    </Link>
  );
}