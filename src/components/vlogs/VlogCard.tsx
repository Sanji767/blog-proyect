// src/components/vlogs/VlogCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import type { Vlog } from "@/lib/vlogs";

type VlogCardProps = {
  vlog: Vlog;
  variant?: "default" | "featured";
};

export default function VlogCard({ vlog, variant = "default" }: VlogCardProps) {
  const router = useRouter();

  const formattedDate = new Date(vlog.date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const isFeatured = variant === "featured";

  const handleCardClick = () => {
    router.push(`/vlogs/${vlog.slug}`);
  };

  const handleKeyDown: React.KeyboardEventHandler<HTMLElement> = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
  };

  return (
    <article
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      className={`group relative flex cursor-pointer flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-2xl dark:bg-black/90 dark:border-white/10 ${
        isFeatured
          ? "md:grid md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)] md:gap-6"
          : ""
      }`}
    >
      {/* Imagen */}
      {vlog.image && (
        <div
          className={`relative overflow-hidden ${
            isFeatured ? "h-60 md:h-full" : "h-56"
          }`}
        >
          <Image
            src={vlog.image}
            alt={vlog.title}
            fill
            priority={isFeatured}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />

          {/* Badge "Recomendado" solo en featured */}
          {isFeatured && (
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
              Recomendado
            </div>
          )}
        </div>
      )}

      {/* Contenido */}
      <div
        className={`flex flex-1 flex-col gap-4 p-6 md:p-8 ${
          isFeatured ? "md:pr-10" : ""
        }`}
      >
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </span>
          {vlog.readingTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{vlog.readingTime}</span>
            </span>
          )}
        </div>

        {/* Título + descripción */}
        <div className="space-y-2">
          <h3
            className={`font-semibold tracking-tight text-foreground transition-colors group-hover:text-emerald-600 dark:group-hover:text-emerald-300 ${
              isFeatured ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
            }`}
          >
            {vlog.title}
          </h3>
          {vlog.description && (
            <p className="line-clamp-2 text-sm text-muted-foreground md:line-clamp-3">
              {vlog.description}
            </p>
          )}
        </div>

        {/* Tags + CTA */}
        <div className="mt-auto flex items-center justify-between gap-3">
          {/* Tags (clicables, filtran por tema en /vlogs) */}
          {vlog.tags && vlog.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {vlog.tags.slice(0, 3).map((tag) => (
                <Link
                  key={tag}
                  href={`/vlogs?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-800/60"
                  // Evita que al hacer click en el tag también se dispare
                  // la navegación del artículo completo
                  onClick={(e) => e.stopPropagation()}
                >
                  #{tag}
                </Link>
              ))}
              {vlog.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">
                  +{vlog.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Flecha sutil que aparece en hover */}
          <ArrowRight className="h-5 w-5 shrink-0 text-emerald-500 opacity-0 transition-all group-hover:translate-x-2 group-hover:opacity-100" />
        </div>
      </div>
    </article>
  );
}
