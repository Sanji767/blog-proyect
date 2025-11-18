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

  const paragraphs = content.split(/\n\s*\n/); // separa por líneas en blanco

  return (
    <Container className="max-w-3xl space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-muted-foreground">
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
        <h1 className="text-3xl font-bold md:text-4xl">{title}</h1>
        <p className="text-sm text-muted-foreground md:text-base">
          {description}
        </p>

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
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
        <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-border bg-muted md:h-72">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
          />
        </div>
      )}

      {/* Contenido */}
      <article className="prose prose-neutral max-w-none text-sm leading-relaxed dark:prose-invert md:text-base">
        {paragraphs.map((p, index) => (
          <p key={index}>{p.trim()}</p>
        ))}
      </article>

      {/* CTA final suave */}
      <section className="mt-6 rounded-3xl border border-border bg-background p-5 shadow-card md:p-6">
        <h2 className="mb-2 text-lg font-semibold">
          ¿Quieres aplicar esto a tu caso concreto?
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Cada banco tiene sus matices según tu país, tu forma de trabajar y
          cómo mueves tu dinero. Puedes ver la comparativa general o escribirme
          si necesitas algo más específico.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/bancos"
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-xs font-semibold text-black hover:brightness-105 md:text-sm"
          >
            Ver bancos recomendados →
          </Link>
          <Link
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-xs font-semibold md:text-sm"
          >
            Preguntarme tu caso
          </Link>
        </div>
      </section>
    </Container>
  );
}
