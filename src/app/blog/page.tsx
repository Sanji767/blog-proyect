// src/app/blog/page.tsx
import type { Metadata } from "next";
import BlogCard from "@/components/blog/BlogCard";
import BlogHeader from "@/components/blog/BlogHeader";
import { getAllPosts, getFeaturedPosts } from "@/lib/blog";

export const metadata: Metadata = {
  title: "Blog Finanzas EU – Guías reales sobre bancos digitales 2025",
  description: "Comparativas honestas, opiniones reales y trucos para ahorrar con Revolut, Wise, N26 y más.",
};

export default function BlogPage() {
  const allPosts = getAllPosts();
  const featured = getFeaturedPosts().slice(0, 3);
  const normal = allPosts.filter((p) => !featured.some((f) => f.slug === p.slug));

  return (
    <>
      <BlogHeader total={allPosts.length} />

      {featured.length > 0 && (
        <section className="mt-20">
          <h2 className="text-3xl md:text-4xl font-black text-center mb-12 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            Destacados del momento
          </h2>
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {featured.map((post, i) => (
              <BlogCard key={post.slug} post={post} variant="featured" index={i} />
            ))}
          </div>
        </section>
      )}

      <section className="mt-24">
        <h2 className="text-3xl md:text-4xl font-black text-center mb-12">
          Todos los artículos
        </h2>
        {normal.length === 0 ? (
          <p className="text-center text-muted-foreground py-20 text-lg">
            Pronto más guías brutales
          </p>
        ) : (
          <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {normal.map((post, i) => (
              <BlogCard key={post.slug} post={post} index={i + featured.length} />
            ))}
          </div>
        )}
      </section>

      <section className="mt-32 text-center">
        <p className="text-xl text-muted-foreground mb-8">
          ¿No encuentras lo que buscas?
        </p>
        <a
          href="/contacto"
          className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-primary to-primary/80 px-10 py-5 text-xl font-bold text-white shadow-2xl hover:shadow-3xl hover:scale-105 transition-all"
        >
          Pídeme el tema que quieras → ¡Gratis!
        </a>
      </section>
    </>
  );
}