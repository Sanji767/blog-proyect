// src/components/blog/CategoryBadge.tsx
import Link from "next/link";

function humanizeSlug(value: string): string {
  const normalized = value.trim().replace(/-/g, " ");
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : value;
}

export default function CategoryBadge({ slug }: { slug: string }) {
  const categorySlug = decodeURIComponent(slug).toLowerCase().trim();
  if (!categorySlug) return null;

  return (
    <Link
      href={`/blog/categoria/${encodeURIComponent(categorySlug)}`}
      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
    >
      {humanizeSlug(categorySlug)}
    </Link>
  );
}
