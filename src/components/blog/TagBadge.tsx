// src/components/blog/TagBadge.tsx
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

export default function TagBadge({ slug }: { slug: string }) {
  const tagSlug = decodeURIComponent(slug).toLowerCase().trim();
  const label = humanizeSlug(tagSlug);

  return (
    <Link
      href={`/blog/tag/${encodeURIComponent(tagSlug)}`}
      className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted"
    >
      {label}
    </Link>
  );
}
