// src/components/blog/CategoryBadge.tsx
import Link from "next/link";
import { getCategories } from "@/lib/blog";              // ← corrige la ruta si es necesario
import type { Category } from "@/lib/blog/types";        // ← este es el tipo correcto

export default function CategoryBadge({ slug }: { slug: string }) {
  const categories: Category[] = getCategories();
  const cat = categories.find((c) => c.slug === slug);

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