// src/app/vlogs/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import Container from "@/components/layout/Container";
import { vlogs } from "@/lib/vlogs";
import VlogCard from "@/components/vlogs/VlogCard";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return vlogs.map((vlog) => ({ slug: vlog.slug }));
}

export async function generateMetadata(
  { params }: Props,
): Promise<Metadata> {
  const vlog = vlogs.find((v) => v.slug === params.slug);
  if (!vlog) return {};

  return {
    title: `${vlog.title} | Blog`,
    description: vlog.description,
    openGraph: {
      title: vlog.title,
      description: vlog.description,
      images: vlog.image ? [{ url: vlog.image }] : [],
      type: "article",
      publishedTime: vlog.date,
    },
  };
}

// util para IDs de headings
function slugifyHeading(text: string) {
  return text
    .toLowerCase()
    .replace(/[^\w\s\-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default function VlogPage({ params }: Props) {
  const vlog = vlogs.find((v) => v.slug === params.slug);
  if (!vlog) return notFound();

  const {
    title,
    description,
    date,
    image,
    tags = [],
    readingTime,
    content,
  } = vlog;

  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // TOC simple a partir de headings "## "
  const toc = content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const label = line.replace(/^##\s*/, "");
      return { id: slugifyHeading(label), label };
    });

  // Artículos relacionados (por tags)
  const related = vlogs
    .filter((v) => v.slug !== vlog.slug)
    .filter((v) =>
      v.tags?.some((t: string) => tags.includes(t)),
    )
    .slice(0, 3);

  const fallbackRelated =
    related.length > 0
      ? related
      : vlogs
          .filter((v) => v.slug !== vlog.slug)
          .slice(0, 3);

  return (
    <Container className="max-w-3xl py-12 md:py-20">
      {/* Breadcrumb */}
      <nav className="mb-10 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="transition-colors hover:text-foreground"
          >
            Inicio
          </Link>
          <span>/</span>
          <Link
            href="/vlogs"
            className="transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <span>/</span>
          <span className="font-medium text-foreground">{title}</span>
        </div>
      </nav>

      {/* HEADER */}
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
          Guía actualizada 2025
        </div>

        <h1 className="text-balance text-3xl font-black tracking-tight text-foreground md:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            {description}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>{formattedDate}</span>
          </span>
          {readingTime && (
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              <span>{readingTime}</span>
            </span>
          )}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/vlogs?tag=${encodeURIComponent(tag)}`}
                  className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-medium text-emerald-700 transition hover:bg-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-200 dark:hover:bg-emerald-800/60"
                >
                  #{tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Imagen destacada */}
      {image && (
        <div className="relative mt-8 overflow-hidden rounded-3xl border border-border/40 bg-muted">
          <div className="relative h-56 w-full md:h-80">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      )}

      {/* TOC opcional */}
      {toc.length > 0 && (
        <aside className="mt-8 rounded-2xl border border-border/40 bg-background/70 p-4 text-sm shadow-sm">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            En este artículo
          </p>
          <ul className="space-y-1.5 text-sm">
            {toc.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="text-emerald-700 hover:underline dark:text-emerald-300"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      )}

      {/* CONTENIDO: MARKDOWN REAL */}
      <article className="prose prose-neutral mt-8 max-w-none rounded-3xl border border-border/40 bg-background/80 p-5 text-sm leading-relaxed shadow-sm dark:prose-invert md:p-8 md:text-base">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: (props) => (
              <h1
                className="mt-8 text-3xl font-bold"
                {...props}
              />
            ),
            h2: (props) => {
              const text = String(props.children ?? "");
              const id = slugifyHeading(text);
              return (
                <h2
                  id={id}
                  className="mt-8 scroll-mt-24 text-2xl font-semibold"
                  {...props}
                />
              );
            },
            h3: (props) => (
              <h3
                className="mt-6 text-xl font-semibold"
                {...props}
              />
            ),
            h4: (props) => (
              <h4
                className="mt-4 text-lg font-semibold"
                {...props}
              />
            ),
            p: (props) => (
              <p className="my-4 leading-relaxed" {...props} />
            ),
            ul: (props) => (
              <ul className="my-4 list-disc pl-6" {...props} />
            ),
            ol: (props) => (
              <ol className="my-4 list-decimal pl-6" {...props} />
            ),
            li: (props) => <li className="mb-1" {...props} />,
            blockquote: (props) => (
              <blockquote
                className="border-l-4 border-emerald-500 bg-emerald-500/5 pl-6 pr-4 py-4 italic dark:border-emerald-400 dark:bg-emerald-400/10"
                {...props}
              />
            ),
            table: (props) => (
              <div className="my-6 overflow-x-auto">
                <table
                  className="min-w-full border-collapse text-sm"
                  {...props}
                />
              </div>
            ),
            th: (props) => (
              <th
                className="border border-border bg-muted px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide"
                {...props}
              />
            ),
            td: (props) => (
              <td
                className="border border-border px-3 py-2 align-top"
                {...props}
              />
            ),
            code: (props) => (
              <code
                className="rounded bg-muted px-1 py-0.5 text-[13px]"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </article>

      {/* CTA / RELACIONADOS */}
      <section className="mt-10 space-y-8">
        {/* Relacionados */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground md:text-xl">
            También te puede interesar
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {fallbackRelated.map((relatedVlog) => (
              <VlogCard
                key={relatedVlog.slug}
                vlog={relatedVlog}
                variant="default"
              />
            ))}
          </div>
        </div>

        {/* CTA final */}
        <footer className="rounded-3xl border border-border/40 bg-background/80 p-5 text-sm shadow-sm md:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1.5">
              <h2 className="text-base font-semibold md:text-lg">
                ¿Quieres que miremos tu caso concreto?
              </h2>
              <p className="text-sm text-muted-foreground">
                Escríbeme 2–3 frases con tu situación y te digo qué
                bancos miraría yo primero.
              </p>
            </div>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:brightness-110"
            >
              Hablar conmigo
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>
          </div>
        </footer>
      </section>
    </Container>
  );
}
