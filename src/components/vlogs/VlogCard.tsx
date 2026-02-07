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
import type { VlogPreview } from "@/lib/vlogs";

const PLACEHOLDER_IMAGE = "/placeholder-vlog.jpg";
const PLACEHOLDER_BLUR = "/placeholder-blur.jpg";
const DEFAULT_AUTHOR_AVATAR = "/jose-avatar.jpg";
const DEFAULT_AUTHOR_NAME = "José María";

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

  const handleClick = () => router.push(`/vlogs/${vlog.slug}`);

  const viewsLabel = vlog.views
    ? `${vlog.views.toLocaleString("es-ES")} vistas`
    : "12.400 vistas";

  const imageSizes = isFeatured
    ? "60vw"
    : isCompact
    ? "(min-width: 768px) 40vw, 100vw"
    : "100vw";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      role="article"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleClick()}
      className={`
        group relative flex cursor-pointer flex-col overflow-hidden border
        bg-card ring-1 ring-border/50 transition-all duration-500
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary
        dark:bg-card/95
        ${isFeatured ? "rounded-3xl shadow-xl hover:-translate-y-3 hover:shadow-3xl hover:ring-primary/40 md:grid md:grid-cols-[1.5fr_1fr]" : ""}
        ${!isFeatured && !isCompact ? "rounded-3xl shadow-xl hover:-translate-y-2 hover:shadow-2xl hover:ring-primary/30" : ""}
        ${isCompact ? "rounded-2xl shadow-md hover:-translate-y-1 hover:shadow-lg hover:ring-primary/20 md:flex-row md:items-stretch max-w-xl w-full mx-auto" : ""}
      `}
    >
      {/* IMAGEN / MEDIA */}
      <div
        className={`
          relative overflow-hidden
          ${
            isFeatured
              ? "aspect-[16/7]"
              : isCompact
              ? "h-[160px] md:h-auto md:w-[40%] md:aspect-[4/3] flex-shrink-0"
              : "aspect-video"
          }
        `}
      >
        <Image
          src={imageSrc}
          alt={vlog.title}
          fill
          sizes={imageSizes}
          className="object-cover transition-transform duration-1000 group-hover:scale-110"
          placeholder="blur"
          blurDataURL={PLACEHOLDER_BLUR}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />

        {vlog.youtubeId && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-500 group-hover:opacity-100">
            <PlayCircle className="h-24 w-24 text-white drop-shadow-2xl group-hover:scale-110 transition-transform" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {isNew && (
            <span className="animate-pulse rounded-full bg-red-500 px-3 py-1.5 text-xs font-bold text-white">
              NUEVO
            </span>
          )}

          {isFeatured && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-3 py-1.5 text-xs font-bold text-white">
              <Sparkles className="h-3 w-3" />
              DESTACADO
            </span>
          )}

          {vlog.youtubeId && (
            <span className="flex items-center gap-1 rounded-full bg-red-600 px-3 py-1.5 text-xs font-bold text-white">
              <PlayCircle className="h-3 w-3" /> VÍDEO
            </span>
          )}
        </div>

        {/* Autor */}
        {!isCompact && (
          <div className="absolute bottom-4 left-4 flex items-center gap-3">
            <Image
              src={vlog.authorAvatar || DEFAULT_AUTHOR_AVATAR}
              alt={vlog.author || DEFAULT_AUTHOR_NAME}
              width={42}
              height={42}
              className="rounded-full ring-4 ring-white/90"
            />
            <div className="text-white drop-shadow-lg">
              <p className="text-sm font-bold">
                {vlog.author || DEFAULT_AUTHOR_NAME}
              </p>
              <p className="text-xs opacity-90">FUNDADOR FINANZAS EU</p>
            </div>
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div
        className={`
          flex flex-1 flex-col justify-between
          ${isCompact ? "p-4 md:p-4" : "p-6"}
        `}
      >
        <div
          className={`
            flex flex-wrap items-center gap-3 text-xs text-muted-foreground
            ${isCompact ? "mb-1" : "mb-0"}
          `}
        >
          <time className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formattedDate}
          </time>

          {vlog.readingTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {vlog.readingTime}
            </span>
          )}

          <span className="flex items-center gap-1.5">
            <Eye className="h-4 w-4" />
            {viewsLabel}
          </span>
        </div>

        <h3
          className={`
            font-black tracking-tight
            ${isFeatured ? "mt-4 text-2xl md:text-3xl" : ""}
            ${!isFeatured && !isCompact ? "mt-4 text-xl md:text-2xl" : ""}
            ${isCompact ? "mt-1 text-lg md:text-xl" : ""}
          `}
        >
          {vlog.title}
        </h3>

        {vlog.description && (
          <p
            className={`
              text-sm text-muted-foreground
              ${isCompact ? "mt-1 line-clamp-2" : "mt-2 line-clamp-3"}
            `}
          >
            {vlog.description}
          </p>
        )}

        <div
          className={`
            flex items-center justify-between
            ${isCompact ? "mt-4" : "mt-6"}
          `}
        >
          <div className="flex flex-wrap gap-2">
            {vlog.tags?.slice(0, 3).map((tag) => (
              <Link
                key={tag}
                href={`/vlogs?tag=${tag}`}
                onClick={(e) => e.stopPropagation()}
                className={`
                  rounded-full bg-primary/10 text-xs font-bold text-primary
                  ${isCompact ? "px-2.5 py-1" : "px-3 py-1"}
                `}
              >
                #{tag}
              </Link>
            ))}
          </div>

          <ArrowRight
            className={`
              h-6 w-6 text-primary transition-all
              ${isCompact ? "opacity-70 group-hover:opacity-100 group-hover:translate-x-1" : "opacity-0 group-hover:opacity-100 group-hover:translate-x-2"}
            `}
          />
        </div>
      </div>
    </motion.article>
  );
}
