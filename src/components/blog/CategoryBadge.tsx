// src/components/blog/CategoryBadge.tsx
import Link from "next/link";
import { getCategories } from "@/lib/blog/getCategories";
import type { Category } from "@/content/categories";

export default function CategoryBadge({ slug }: { slug: string }) {
  const categories: Category[] = getCategories();
  const cat = categories.find((c: Category) => c.slug === slug);

  if (!cat) return null;

  return (
    <Link
      href={`/blog/categoria/${cat.slug}`}
      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary"
    >
      {cat.title}
    </Link>
  );
}
