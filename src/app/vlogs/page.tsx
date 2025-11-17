// src/app/vlogs/page.tsx
import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import VlogCard from "@/components/vlogs/VlogCard";
import { vlogs } from "@/lib/vlogs";

export const metadata: Metadata = {
  title: "Vlogs y artículos sobre bancos y finanzas en Europa | Finanzas EU",
  description:
    "Artículos claros sobre bancos digitales, IBAN europeo, comisiones, multidivisa y cómo manejar tu dinero viviendo o trabajando en Europa.",
};

export default function VlogsPage() {
  // ordenamos del más nuevo al más antiguo
  const sortedVlogs = [...vlogs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const featured = sortedVlogs.filter((v) => v.featured);
  const rest = sortedVlogs.filter((v) => !v.featured);

  return (
    <Container className="space-y-10">
      {/* Hero del blog */}
      <header className="space-y-4 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <span>Vlogs & artículos</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            Guías, comparativas y casos reales
          </span>
        </div>
        <h1 className="text-3xl font-bold md:text-4xl">
          Entiende mejor tus opciones bancarias en Europa
        </h1>
        <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
          Aquí recopilo artículos y vlogs donde explico con calma lo que en las
          fichas de bancos resumo muy rápido: comisiones reales, trucos,
          problemas habituales y qué haría yo en tu lugar.
        </p>
      </header>

      {/* Destacados */}
      {featured.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold md:text-xl">
              Artículos destacados
            </h2>
            <p className="text-xs text-muted-foreground">
              Los que más ayudan a la mayoría de personas
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((vlog) => (
              <VlogCard key={vlog.slug} vlog={vlog} variant="featured" />
            ))}
          </div>
        </section>
      )}

      {/* Resto de artículos */}
      {rest.length > 0 && (
        <section className="space-y-4 border-t border-border pt-6">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-semibold md:text-xl">
              Todos los vlogs y artículos
            </h2>
            <p className="text-xs text-muted-foreground">
              Puedes usar estos artículos para aclarar dudas antes de abrir
              cuenta.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((vlog) => (
              <VlogCard key={vlog.slug} vlog={vlog} />
            ))}
          </div>
        </section>
      )}

      {/* CTA suave */}
      <section className="border-t border-border pt-8">
        <div className="rounded-3xl border border-border bg-background p-6 shadow-card md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-xl font-semibold md:text-2xl">
                ¿Te sigues liando con tanto banco?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground md:text-base">
                Es normal. Puedes usar la comparativa de bancos para ver todo de
                un vistazo, o escribirme desde la sección de contacto si tu caso
                es un poco más raro.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/bancos"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-black shadow-soft hover:brightness-105"
              >
                Ir a la comparativa de bancos →
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-background/70"
              >
                Preguntarme directamente
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
