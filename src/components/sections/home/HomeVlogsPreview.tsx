// src/components/sections/home/HomeVlogsPreview.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import Container from "@/components/layout/Container";
import NewsPostCard from "@/components/blog/NewsPostCard";
import { Button } from "@/components/ui/button";
import { getAllPostPreviews } from "@/lib/blog";

export default async function HomeVlogsPreview() {
  const recentPosts = (await getAllPostPreviews()).slice(0, 3);
  if (recentPosts.length === 0) return null;

  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <Container>
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Blog
            </p>
            <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
              Últimas{" "}
              <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                lecturas
              </span>
            </h2>
            <p className="max-w-xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Guías y análisis sin humo para elegir banco, IBAN y comisiones con
              criterio.
            </p>
          </div>

          <Button asChild variant="outline" className="shrink-0 gap-2">
            <Link href="/blog">
              Ver todo el blog
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </header>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {recentPosts.map((post, i) => (
            <NewsPostCard key={post.slug} post={post} index={i} showDescription />
          ))}
        </div>
      </Container>
    </section>
  );
}

