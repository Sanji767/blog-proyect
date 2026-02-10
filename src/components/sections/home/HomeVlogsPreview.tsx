// src/components/sections/home/HomeVlogsPreview.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Container from "@/components/layout/Container";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPostPreviews } from "@/lib/blog";

export default async function HomeVlogsPreview() {
  const recentPosts = (await getAllPostPreviews()).slice(0, 3);

  if (recentPosts.length === 0) return null;

  return (
    <section className="py-16 md:py-24 bg-gradient-to-b from-background to-muted/30">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div className="space-y-2">
            <div className="uppercase text-xs font-mono tracking-widest text-primary font-semibold">
              BLOG
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tighter">
              Últimos artículos y análisis
            </h2>
            <p className="text-muted-foreground max-w-md text-[15px]">
              Resúmenes claros, ejemplos reales y comparativas sin humo para
              elegir banco, IBAN y comisiones con criterio.
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
          {recentPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </Container>
    </section>
  );
}
