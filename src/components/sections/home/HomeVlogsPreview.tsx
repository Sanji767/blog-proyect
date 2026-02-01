// src/components/sections/home/HomeBlogPreview.tsx
import Link from "next/link";
import { ArrowRight, Clock, Calendar } from "lucide-react";
import { getAllPosts } from "@/lib/blog";
import type { BlogPost } from "@/lib/blog/types";
import Container from "@/components/layout/Container";
import CategoryBadge from "@/components/blog/CategoryBadge";

export default async function HomeBlogPreview() {
  const recentPosts = getAllPosts().slice(0, 3);

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="uppercase text-xs font-mono tracking-widest text-primary font-semibold">
              CONOCIMIENTO PRÁCTICO
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
              Últimas guías y análisis
            </h2>
            <p className="text-muted-foreground max-w-md text-[15px]">
              Análisis actualizados, comparativas reales y trucos útiles sobre bancos digitales en Europa.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-2 rounded-full border-2 border-primary/20 bg-background hover:bg-primary hover:text-white px-6 py-3 font-semibold transition-all duration-300 whitespace-nowrap"
          >
            Ver todo el blog
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
          </Link>
        </div>

        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {recentPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block bg-card rounded-3xl border border-border/60 overflow-hidden hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="p-6">
                {/* Categoría + Fecha */}
                <div className="flex items-center justify-between mb-4">
                  <CategoryBadge slug={post.category} />
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(post.date).toLocaleDateString("es-ES", { month: "short", day: "numeric" })}
                  </span>
                </div>

                {/* Título */}
                <h3 className="font-bold text-xl leading-snug tracking-tight mb-3 group-hover:text-primary transition-colors line-clamp-3">
                  {post.title}
                </h3>

                {/* Extracto */}
                <p className="text-muted-foreground text-[15px] leading-relaxed line-clamp-3 mb-5">
                  {post.excerpt || post.description || "Explora esta guía completa..."}
                </p>

                {/* Meta inferior */}
                <div className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t border-border/50">
                  {post.readingTime && (
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readingTime}
                    </span>
                  )}
                  <span className="font-mono text-primary/70 group-hover:text-primary transition-colors">
                    Leer →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}