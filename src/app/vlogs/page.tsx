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
    <Container className="max-w-5xl space-y-10 md:space-y-12">
      {/* Hero del blog estilo neobanco */}
      <header className="space-y-6">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-semibold text-primary md:text-xs">
          <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            ●
          </span>
          <span>Vlogs & artículos</span>
          <span className="text-muted-foreground">·</span>
          <span className="text-muted-foreground">
            Guías claras sobre bancos digitales en Europa
          </span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl font-black tracking-tight md:text-4xl lg:text-5xl">
            Entiende tus opciones bancarias en Europa
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground md:text-base">
            Aquí reúno artículos en los que explico con calma lo que en las fichas
            de bancos resumo muy rápido: comisiones reales, límites, trucos y
            problemas que aparecen en la vida real cuando usas un banco digital.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground md:text-xs">
          <span className="rounded-full bg-background/60 px-3 py-1">
            Contenido pensado para españoles y residentes en Europa
          </span>
          <span className="rounded-full bg-background/60 px-3 py-1">
            Sin jerga técnica, solo lo que importa
          </span>
        </div>
      </header>

      {/* Destacados */}
      {featured.length > 0 && (
        <section className="space-y-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold md:text-xl">
                Artículos destacados
              </h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                Lo mínimo que deberías leer antes de elegir banco.
              </p>
            </div>
            <span className="text-[11px] text-muted-foreground md:text-xs">
              Actualizados para 2025
            </span>
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
        <section className="space-y-4 border-t border-border/60 pt-6 md:pt-8">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-lg font-semibold md:text-xl">
                Todos los vlogs y artículos
              </h2>
              <p className="text-xs text-muted-foreground md:text-sm">
                Úsalos como “guía previa” antes de abrir cuenta o cambiar de banco.
              </p>
            </div>
            <p className="text-[11px] text-muted-foreground md:text-xs">
              Piensa en esto como una capa extra de contexto, no como teoría.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((vlog) => (
              <VlogCard key={vlog.slug} vlog={vlog} />
            ))}
          </div>
        </section>
      )}

      {/* CTA suave estilo fintech */}
      <section className="border-t border-border/60 pt-8 md:pt-10">
        <div className="rounded-3xl border border-border bg-gradient-to-r from-background via-background/80 to-background p-6 shadow-sm md:p-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold md:text-2xl">
                ¿Demasiada información? Simplifiquemos.
              </h2>
              <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                Si te abruma tanto banco, empieza por la comparativa. Y si tu caso
                es un poco raro (freelancer, empresa, varias divisas), puedes
                escribirme y te digo qué usar como cuenta principal y cuál como apoyo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/bancos"
                className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-black shadow-sm hover:brightness-105 md:px-6 md:py-3"
              >
                Ver comparativa de bancos →
              </Link>
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-background/70 md:px-6 md:py-3"
              >
                Analizar mi caso
              </Link>
            </div>
          </div>
        </div>
      </section>
    </Container>
  );
}
