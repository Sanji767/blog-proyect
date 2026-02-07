// src/components/blog/BlogCard.tsx
"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Eye, Sparkles, Flame } from "lucide-react";
import type { BlogPostPreview } from "@/lib/blog/types";

type Props = {
  post: BlogPostPreview;
  variant?: "default" | "featured" | "compact";
  index?: number;
};

export default function BlogCard({ post, variant = "default", index = 0 }: Props) {
  const isFeatured = variant === "featured" || post.featured;
  const isCompact = variant === "compact";

  // Badges inteligentes
  const isNew = new Date(post.date) > new Date(Date.now() - 3 * 24 * 60 * 60 * 1000); // últimos 3 días
  const isHot = (post.views || 0) > 25000;

  const formattedDate = new Date(post.date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Formato de vistas
  const formatViews = (views: number | undefined): string => {
    const num = views ?? 0;
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${Math.round(num / 1_000)}k`;
    return num.toString();
  };

  const views = formatViews(post.views);

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: "easeOut" }}
      className="group relative"
    >
      <Link
        href={`/blog/${post.slug}`}
        className={`block rounded-3xl border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-primary/20
          p-6 bg-gradient-to-br from-white to-gray-50 dark:from-black/80 dark:to-gray-900`}
      >
        {/* Badges */}
        <div className="flex flex-wrap gap-2 mb-3">
          {isNew && (
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-red-600 px-3.5 py-1.5 text-xs font-black text-white animate-pulse">
              <Flame className="h-3.5 w-3.5" />
              NUEVO
            </span>
          )}
          {isHot && (
            <span className="flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-black text-white">
              <Flame className="h-3 w-3" />
              TENDENCIA
            </span>
          )}
          {isFeatured && (
            <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-1.5 text-xs font-black text-white">
              <Sparkles className="h-4 w-4" />
              DESTACADO
            </span>
          )}
        </div>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground/80 mb-2">
          <time className="flex items-center gap-1.5 font-medium">
            <Calendar className="h-3.5 w-3.5" />
            {formattedDate}
          </time>
          {post.readingTime && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {post.readingTime}
            </span>
          )}
          <span className="flex items-center gap-1.5 font-medium">
            <Eye className="h-3.5 w-3.5" />
            {views} vistas
          </span>
        </div>

        {/* Título */}
        <h3
          className={`font-black tracking-tight line-clamp-3 transition-colors group-hover:text-primary mb-2 ${
            isFeatured
              ? "text-2xl md:text-3xl leading-tight"
              : isCompact
              ? "text-lg md:text-xl"
              : "text-xl md:text-2xl leading-snug"
          }`}
        >
          {post.title}
        </h3>

        {/* Descripción */}
        <p className="text-muted-foreground line-clamp-4 leading-relaxed text-sm md:text-base mb-4">
          {post.description ?? post.excerpt ?? "Sin descripción disponible"}
        </p>

        {/* Tags + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {post.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-primary/10 px-3 py-1.5 text-xs font-bold text-primary hover:bg-primary/20 transition"
              >
                #{tag}
              </span>
            ))}
          </div>
          <ArrowRight className="h-6 w-6 text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-3 transition-all duration-300" />
        </div>
      </Link>
    </motion.article>
  );
}
