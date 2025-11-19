// src/app/vlogs/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Calendar, Clock } from "lucide-react";

import Container from "@/components/layout/Container";
import { vlogs } from "@/lib/vlogs";
import VlogCard from "@/components/vlogs/VlogCard";

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

  // Split en bloques separados por línea en blanco
  const blocks = content
    .split(/\n\s*\n/)
    .map((b: string) => b.trim())
    .filter(Boolean);

  // TOC simple a partir de headings ## 
  const toc = blocks
    .filter((b: string) => b.startsWith("## "))
    .map((b: string) => {
      const label = b.replace(/^##\s*/, "");
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

      {/* CONTENIDO */}
      <article className="prose prose-neutral mt-8 max-w-none rounded-3xl border border-border/40 bg-background/80 p-5 text-sm leading-relaxed shadow-sm dark:prose-invert md:p-8 md:text-base">
        <div className="space-y-6">
          {blocks.map((text: string, index: number) => {
            // Separador
            if (/^(-{3,}|_{3,}|\*{3,})$/.test(text)) {
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 text-muted-foreground"
                >
                  <div className="h-px flex-1 bg-border" />
                  <span className="text-xs">✦</span>
                  <div className="h-px flex-1 bg-border" />
                </div>
              );
            }

            // Heading H2
            if (text.startsWith("## ")) {
              const headingText = text.replace(/^##\s*/, "");
              const id = slugifyHeading(headingText);
              return (
                <h2
                  key={index}
                  id={id}
                  className="scroll-mt-24 text-xl font-semibold text-foreground md:text-2xl"
                >
                  {headingText}
                </h2>
              );
            }

            // Cita
            if (text.startsWith(">")) {
              return (
                <blockquote
                  key={index}
                  className="border-l-4 border-emerald-500 bg-emerald-500/5 pl-6 pr-4 py-4 italic text-foreground/90 md:text-lg dark:border-emerald-400 dark:bg-emerald-400/10"
                >
                  {text.replace(/^>\s*/, "")}
                </blockquote>
              );
            }

            // Lista con bullets •
            if (text.startsWith("•")) {
              const items = text
                .split("\n")
                .map((line) => line.trim())
                .filter((line) => line.startsWith("•"))
                .map((line) => line.replace(/^•\s*/, ""))
                .filter(Boolean);

              return (
                <ul
                  key={index}
                  className="list-disc space-y-2 pl-5 text-foreground"
                >
                  {items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              );
            }

            // Párrafo normal
            return (
              <p key={index} className="text-foreground">
                {text}
              </p>
            );
          })}
        </div>
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
