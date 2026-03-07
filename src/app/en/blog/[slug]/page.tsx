import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import BlogPostPageEs, {
  generateStaticParams as generateStaticParamsEs,
} from "@/app/blog/[slug]/page";
import { getPostBySlug } from "@/lib/blog";

export async function generateStaticParams() {
  return generateStaticParamsEs();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: "Article not found | FinanzasEU",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${post.title} | FinanzasEU`,
    description: post.description ?? post.excerpt,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
  };
}

export default async function BlogPostPageEn({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  return (
    <>
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            <p className="font-semibold text-foreground">Spanish version</p>
            <p className="mt-1">
              This article is currently available in Spanish. You can read it
              here:{" "}
              <Link
                href={`/blog/${params.slug}`}
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                /blog/{params.slug}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <div lang="es">
        <BlogPostPageEs params={params} />
      </div>
    </>
  );
}

