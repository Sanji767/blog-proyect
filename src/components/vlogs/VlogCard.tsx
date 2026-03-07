// src/components/vlogs/VlogCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Calendar,
  PlayCircle,
  Eye,
  Sparkles,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { VlogPreview } from "@/lib/vlogs";

const PLACEHOLDER_IMAGE = "/placeholder-vlog.jpg";
const PLACEHOLDER_BLUR = "/placeholder-blur.jpg";

type VlogCardProps = {
  vlog: VlogPreview;
  variant?: "default" | "featured" | "compact";
  index?: number;
};

export default function VlogCard({
  vlog,
  variant = "default",
  index = 0,
}: VlogCardProps) {
  const router = useRouter();

  const vlogDate = new Date(vlog.date);
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const isNew = vlogDate > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const formattedDate = vlogDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const imageSrc = vlog.image || PLACEHOLDER_IMAGE;
  const viewsLabel =
    typeof vlog.views === "number"
      ? `${vlog.views.toLocaleString("es-ES")} vistas`
      : null;

  const imageSizes = isFeatured
    ? "60vw"
    : isCompact
      ? "(min-width: 768px) 40vw, 100vw"
      : "100vw";

  const handleClick = () => router.push(`/vlogs/${vlog.slug}`);

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: "easeOut" }}
      role="article"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border-2 border-secondary bg-secondary text-secondary-foreground shadow-soft transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:shadow-offset-accent",
        isFeatured && "md:grid md:grid-cols-[1.5fr_1fr]",
        isCompact && "md:flex-row md:items-stretch"
      )}
    >
      {/* MEDIA */}
      <div
        className={cn(
          "relative overflow-hidden",
          isFeatured
            ? "aspect-[16/8]"
            : isCompact
              ? "h-[160px] md:h-auto md:w-[42%] md:aspect-[4/3] flex-shrink-0"
              : "aspect-video"
        )}
      >
        <Image
          src={imageSrc}
          alt={vlog.title}
          fill
          sizes={imageSizes}
          className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-secondary/90 via-secondary/35 to-transparent" />

        {vlog.youtubeId ? (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            <PlayCircle className="h-20 w-20 text-accent drop-shadow-2xl" />
          </div>
        ) : null}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {isNew ? (
            <span className="inline-flex items-center rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent-foreground">
              Nuevo
            </span>
          ) : null}

          {isFeatured ? (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-secondary bg-secondary-foreground/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-secondary-foreground">
              <Sparkles className="h-3 w-3 text-accent" />
              Destacado
            </span>
          ) : null}

          {vlog.youtubeId ? (
            <span className="inline-flex items-center gap-1 rounded-full border-2 border-secondary bg-secondary-foreground/5 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-secondary-foreground">
              <PlayCircle className="h-3 w-3 text-primary" />
              Vídeo
            </span>
          ) : null}
        </div>
      </div>

      {/* CONTENT */}
      <div className={cn("flex flex-1 flex-col justify-between", isCompact ? "p-4" : "p-6")}>
        <div className="flex flex-wrap items-center gap-3 text-xs text-secondary-foreground/70">
          <time className="flex items-center gap-1.5" dateTime={vlog.date}>
            <Calendar className="h-4 w-4 text-primary" />
            {formattedDate}
          </time>

          {vlog.readingTime ? (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-primary" />
              {vlog.readingTime}
            </span>
          ) : null}

          {viewsLabel ? (
            <span className="flex items-center gap-1.5">
              <Eye className="h-4 w-4 text-primary" />
              {viewsLabel}
            </span>
          ) : null}
        </div>

        <h3
          className={cn(
            "mt-4 text-balance font-black tracking-tight text-accent",
            isFeatured
              ? "text-2xl md:text-3xl"
              : isCompact
                ? "text-lg md:text-xl"
                : "text-xl md:text-2xl"
          )}
        >
          {vlog.title}
        </h3>

        {vlog.description ? (
          <p
            className={cn(
              "mt-3 text-sm leading-relaxed text-secondary-foreground/80",
              isCompact ? "line-clamp-2" : "line-clamp-3"
            )}
          >
            {vlog.description}
          </p>
        ) : null}

        <div className={cn("mt-6 flex items-center justify-between", isCompact ? "mt-4" : "mt-6")}>
          <div className="flex flex-wrap gap-2">
            {vlog.tags?.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/vlogs?tag=${tag}`}
                onClick={(e) => e.stopPropagation()}
                className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 text-[11px] font-semibold text-secondary-foreground/75 transition-colors hover:border-accent hover:text-secondary-foreground hover:no-underline"
              >
                #{tag}
              </Link>
            ))}
          </div>

          <ArrowRight
            className={cn(
              "h-6 w-6 text-primary transition-all",
              isCompact
                ? "opacity-70 group-hover:opacity-100 group-hover:translate-x-1"
                : "opacity-0 group-hover:opacity-100 group-hover:translate-x-2"
            )}
          />
        </div>
      </div>
    </motion.article>
  );
}

