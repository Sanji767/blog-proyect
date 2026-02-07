// src/app/vlogs/[slug]/page.tsx
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Container from "@/components/layout/Container";
import TableOfContents from "@/components/blog/TableOfContents";
import { ArrowLeft, Calendar, Clock, Eye, PlayCircle } from "lucide-react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkHeadingId from "remark-heading-id";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeExternalLinks from "rehype-external-links";

import { vlogs, getVlogBySlug } from "@/lib/vlogs";

const MarkdownComponents: Components = {
  h2: ({ node, className, children, ...props }) => {
    void node;
    return (
      <h2
        {...props}
        className={[
          "text-3xl md:text-4xl font-black tracking-tight mt-20 mb-6 scroll-mt-32",
          className ?? "",
        ].join(" ")}
      >
        {children}
      </h2>
    );
  },
  h3: ({ node, className, children, ...props }) => {
    void node;
    return (
      <h3
        {...props}
        className={[
          "text-2xl md:text-3xl font-bold tracking-tight mt-16 mb-5 scroll-mt-32",
          className ?? "",
        ].join(" ")}
      >
        {children}
      </h3>
    );
  },
  a: ({ href, children, ...props }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary font-semibold hover:underline transition-colors"
      {...props}
    >
      {children}
    </a>
  ),
};

export function generateStaticParams(): Array<{ slug: string }> {
  return vlogs.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const vlog = getVlogBySlug(params.slug);
  if (!vlog) return { title: "Vlog no encontrado | FinanzasEU" };

  return {
    title: `${vlog.title} | FinanzasEU`,
    description: vlog.description,
    alternates: {
      canonical: `/vlogs/${vlog.slug}`,
    },
    openGraph: {
      title: vlog.title,
      description: vlog.description,
      type: "article",
      publishedTime: vlog.date,
      images: vlog.image ? [{ url: vlog.image }] : undefined,
    },
  };
}

export default function VlogPage({ params }: { params: { slug: string } }) {
  const vlog = getVlogBySlug(params.slug);
  if (!vlog) notFound();

  const publishedDate = new Date(vlog.date);
  const formattedDate = publishedDate.toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="py-16 lg:py-24">
      <Container className="max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-[1fr_320px] xl:gap-16">
          <article className="min-w-0">
            <header className="space-y-6">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/vlogs"
                  className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Volver a vlogs
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl font-black tracking-tight leading-[1.05]">
                {vlog.title}
              </h1>

              <p className="max-w-3xl text-base md:text-lg leading-relaxed text-muted-foreground">
                {vlog.description}
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <time dateTime={vlog.date}>{formattedDate}</time>
                </span>
                {vlog.readingTime && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {vlog.readingTime}
                  </span>
                )}
                {typeof vlog.views === "number" && (
                  <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    {vlog.views.toLocaleString("es-ES")} vistas
                  </span>
                )}
              </div>

              {vlog.tags?.length ? (
                <div className="flex flex-wrap gap-2">
                  {vlog.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/vlogs?tag=${encodeURIComponent(t)}`}
                      className="rounded-full bg-primary/10 px-4 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition"
                    >
                      #{t}
                    </Link>
                  ))}
                </div>
              ) : null}
            </header>

            <div className="mt-10 space-y-10">
              {vlog.youtubeId && (
                <div className="overflow-hidden rounded-3xl border border-border/60 bg-black shadow-lg">
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${vlog.youtubeId}`}
                      title={vlog.title}
                      className="h-full w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {!vlog.youtubeId && vlog.image && (
                <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border/60 bg-muted shadow-lg">
                  <Image
                    src={vlog.image}
                    alt={vlog.title}
                    fill
                    sizes="(min-width: 1024px) 900px, 100vw"
                    className="object-cover"
                    priority
                  />
                </div>
              )}

              <div className="lg:hidden">
                <TableOfContents title="En este vlog" />
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none vlog-content">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm, remarkHeadingId]}
                  rehypePlugins={[
                    rehypeSlug,
                    [rehypeAutolinkHeadings, { behavior: "wrap" }],
                    [rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }],
                  ]}
                  components={MarkdownComponents}
                >
                  {vlog.content}
                </ReactMarkdown>
              </div>
            </div>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <TableOfContents
                title="En este vlog"
                className="max-h-[calc(100vh-18rem)] overflow-auto"
              />

              <div className="rounded-3xl border bg-card p-6 shadow-sm">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted-foreground">
                  <PlayCircle className="h-4 w-4 text-primary" />
                  Siguiente paso
                </div>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  Si estás comparando bancos, te recomiendo empezar por el
                  comparador y luego entrar en el análisis del banco que más se
                  parece a tu caso.
                </p>
                <div className="mt-5 grid gap-3">
                  <Link
                    href="/comparativa"
                    className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-primary/80 px-5 py-3 text-sm font-black text-white shadow-lg hover:shadow-xl transition"
                  >
                    Ir a la comparativa
                  </Link>
                  <Link
                    href="/bancos"
                    className="inline-flex items-center justify-center rounded-full border border-border/60 bg-background px-5 py-3 text-sm font-black text-foreground hover:bg-muted transition"
                  >
                    Ver bancos
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </Container>
    </section>
  );
}
