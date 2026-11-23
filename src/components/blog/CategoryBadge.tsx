// src/components/blog/CategoryBadge.tsx
import Link from "next/link";

const ACCENTED_LABELS: Record<string, string> = {
  analisis: "Análisis",
  autonomos: "Autónomos",
  inversion: "Inversión",
  degiro: "DEGIRO",
  etfs: "ETFs",
  euribor: "Euríbor",
  "hacienda-espana": "Hacienda España",
  irpf: "IRPF",
  "prestamos-personales": "Préstamos personales",
  "trade-republic": "Trade Republic",
};

function humanizeSlug(value: string): string {
  const key = value.trim().toLowerCase();
  if (ACCENTED_LABELS[key]) return ACCENTED_LABELS[key];
  const normalized = value.trim().replace(/-/g, " ");
  return normalized ? normalized.charAt(0).toUpperCase() + normalized.slice(1) : value;
}

export default function CategoryBadge({ slug }: { slug: string }) {
  const categorySlug = decodeURIComponent(slug).toLowerCase().trim();
  if (!categorySlug) return null;

  return (
    <Link
      href={`/blog/categoria/${encodeURIComponent(categorySlug)}`}
      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold text-primary-text"
    >
      {humanizeSlug(categorySlug)}
    </Link>
  );
}
