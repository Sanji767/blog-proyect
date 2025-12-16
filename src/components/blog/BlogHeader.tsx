// src/components/blog/BlogHeader.tsx
import Link from "next/link";

export default function BlogHeader({
  title = "Blog de FinanzasEU",
  subtitle = "Guías reales sobre bancos digitales, comisiones y vida financiera en Europa.",
  total,
}: {
  title?: string;
  subtitle?: string;
  total: number;
}) {
  return (
    <header className="space-y-4 text-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        Blog financiero Europa
      </div>
      <h1 className="text-3xl md:text-5xl font-black tracking-tight">
        {title}
      </h1>
      <p className="mx-auto max-w-2xl text-muted-foreground">
        {subtitle}
      </p>

      <div className="flex flex-wrap justify-center gap-3 text-xs text-muted-foreground">
        <span>{total} artículos</span>
        <span>•</span>
        <Link href="/comparativa" className="hover:underline text-primary">
          Ver comparativa de bancos
        </Link>
      </div>
    </header>
  );
}
