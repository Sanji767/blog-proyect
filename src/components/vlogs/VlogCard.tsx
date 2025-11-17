// src/components/vlogs/VlogCard.tsx
import Image from "next/image";
import Link from "next/link";
import type { Vlog } from "@/lib/vlogs";

type VlogCardProps = {
  vlog: Vlog;
  variant?: "default" | "featured";
};

export default function VlogCard({ vlog, variant = "default" }: VlogCardProps) {
  const formattedDate = new Date(vlog.date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const isFeatured = variant === "featured";

  return (
    <Link
      href={`/vlogs/${vlog.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-card transition-transform hover:-translate-y-1 hover:shadow-soft ${
        isFeatured ? "md:col-span-1 lg:col-span-1" : ""
      }`}
    >
      {/* Imagen */}
      {vlog.image && (
        <div className="relative h-40 w-full overflow-hidden bg-muted md:h-44">
          <Image
            src={vlog.image}
            alt={vlog.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(min-width: 768px) 360px, 100vw"
          />
        </div>
      )}

      {/* Contenido */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span>{formattedDate}</span>
          {vlog.readingTime && (
            <>
              <span>·</span>
              <span>{vlog.readingTime}</span>
            </>
          )}
        </div>

        <h3 className="line-clamp-2 text-base font-semibold md:text-lg">
          {vlog.title}
        </h3>

        <p className="line-clamp-3 text-xs text-muted-foreground md:text-sm">
          {vlog.description}
        </p>

        {vlog.tags && vlog.tags.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1">
            {vlog.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
