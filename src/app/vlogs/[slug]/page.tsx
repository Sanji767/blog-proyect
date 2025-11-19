// src/app/vlogs/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Container from "@/components/layout/Container";
import { vlogs } from "@/lib/vlogs";

type VlogPageProps = {
  params: { slug: string };
};

/* --- Rutas estáticas --- */
export function generateStaticParams() {
  return vlogs.map((vlog) => ({ slug: vlog.slug }));
}

/* --- Metadata dinámica --- */
export function generateMetadata({ params }: VlogPageProps): Metadata {
  const vlog = vlogs.find((v) => v.slug === params.slug);

  if (!vlog) {
    return {
      title: "Artículo no encontrado | Finanzas EU",
      description: "No hemos encontrado el contenido que estabas buscando.",
    };
  }

  return {
    title: `${vlog.title} | Finanzas EU`,
    description: vlog.description,
  };
}

export default function VlogPage({ params }: VlogPageProps) {
  const vlog = vlogs.find((v) => v.slug === params.slug);

  if (!vlog) return notFound();

  const { title, description, date, image, tags, readingTime, content } = vlog;

  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const blocks = content.split(/\n\s*\n/); // separa por líneas en blanco

  return (
    <Container className="max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-muted-foreground md:text-xs">
        <div className="mb-2 flex flex-wrap items-center gap-1">
          <Link href="/vlogs" className="hover:text-primary hover:underline">
            Vlogs
          </Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{title}</span>
        </div>
      </nav>

      {/* Cabecera del artículo */}
      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary md:text-xs">
          <span>Guía práctica</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            Pensado para gente normal, no para banqueros
          </span>
        </div>

        <h1 className="text-3xl font-black tracking-tight md:text-4xl">
          {title}
        </h1>

        <p className="text-sm text-muted-foreground md:text-base">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground md:text-xs">
          <span>{formattedDate}</span>
          {readingTime && (
            <>
              <span>·</span>
              <span>{readingTime} de lectura</span>
            </>
          )}
          {tags && tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-background px-2 py-0.5 text-[11px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {/* Imagen de portada */}
      {image && (
        <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-border/70 bg-muted md:h-72">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      )}

      {/* Contenido: estilo neobanco, sin prose */}
      <article className="space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
        {blocks.map((block, index) => {
          const trimmed = block.trim();

          if (!trimmed) return null;

          // Línea separadora '---'
          if (trimmed === "---") {
            return (
              <hr
                key={index}
                className="my-6 border-border/60"
              />
            );
          }

          // Títulos H2 markdown: "## Título"
          if (trimmed.startsWith("## ")) {
            const text = trimmed.replace(/^##\s*/, "");
            return (
              <h2
                key={index}
                className="pt-4 text-lg font-semibold text-foreground md:text-xl"
              >
                {text}
              </h2>
            );
          }

          // Título H1 markdown (por si acaso): "# Título"
          if (trimmed.startsWith("# ")) {
            const text = trimmed.replace(/^#\s*/, "");
            return (
              <h1
                key={index}
                className="pt-4 text-xl font-bold text-foreground md:text-2xl"
              >
                {text}
              </h1>
            );
          }

          // Bullets simulados con "• "
          if (trimmed.startsWith("• ")) {
            // Si hay varios bullets seguidos, ya los tienes en el mismo bloque con saltos de línea
            const lines = trimmed.split("\n").map((line) => line.trim());
            const bulletLines = lines.filter((l) => l.startsWith("• "));

            if (bulletLines.length > 1) {
              return (
                <ul key={index} className="space-y-1 pl-4">
                  {bulletLines.map((line, i) => (
                    <li key={i} className="list-none before:mr-2 before:text-primary before:content-['•']">
                      {line.replace(/^•\s*/, "")}
                    </li>
                  ))}
                </ul>
              );
            }

            // Un solo bullet
            return (
              <p key={index} className="pl-4">
                {trimmed}
              </p>
            );
          }

          // Párrafo normal
          return <p key={index}>{trimmed}</p>;
        })}
      </article>

      {/* CTA final suave */}
      <section className="mt-6 rounded-3xl border border-border bg-gradient-to-r from-background via-background/80 to-background p-5 shadow-sm md:p-6">
        <h2 className="mb-2 text-lg font-semibold md:text-xl">
          ¿Quieres bajar esto a tu caso concreto?
        </h2>
        <p className="mb-4 text-sm text-muted-foreground md:text-base">
          Cada banco se comporta distinto según tu país, tus ingresos y cómo mueves
          el dinero: nómina, viajes, clientes fuera de España, etc. Puedes ver la
          comparativa general o escribirme y te digo qué usar como cuenta principal
          y qué dejar solo como apoyo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/bancos"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-black hover:brightness-105 md:px-6 md:py-2.5 md:text-sm"
          >
            Ver comparativa de bancos →
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-xs font-semibold md:px-6 md:py-2.5 md:text-sm"
          >
            Analizar mi caso contigo
          </Link>
        </div>
      </section>
    </Container>
  );
}
