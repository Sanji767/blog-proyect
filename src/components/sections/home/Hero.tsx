// src/components/sections/home/Hero.tsx

import Link from "next/link";
import Container from "@/components/layout/Container";

export default function Hero() {
  return (
    <section className="bg-hero-background py-16 md:py-24">
      <Container className="grid items-center gap-10 md:grid-cols-2">
        {/* Columna texto */}
        <div className="space-y-5 animate-fade-in-up">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Finanzas Eu · Guía de bancos europeos
          </span>

          <h1 className="text-3xl font-bold md:text-5xl">
            Abre tu cuenta en Europa{" "}
            <span className="text-primary">sin líos ni letra pequeña</span>.
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            En Finanzas Eu comparamos bancos como Revolut, N26, Wise o Bunq para
            que sepas cuál encaja mejor contigo según tu país, si trabajas en
            remoto, viajas o necesitas cuenta multidivisa.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/programas/revolut"
              className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-black shadow-soft hover:brightness-105"
            >
              Ver banco recomendado →
            </Link>
            <Link
              href="/bancos"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-background/60"
            >
              Ver todos los bancos
            </Link>
          </div>

          <ul className="mt-4 grid gap-2 text-xs text-muted-foreground md:text-sm">
            <li>• Bancos que aceptan no residentes en muchos casos.</li>
            <li>• Información clara sobre comisiones, límites e IBAN.</li>
            <li>• Ideal para viajeros, remotos, freelancers y expatriados.</li>
          </ul>
        </div>

        {/* Columna tarjeta resumen */}
        <div className="rounded-3xl border border-border bg-background p-5 shadow-card animate-fade-in-up md:animate-none md:translate-y-0">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            Resumen rápido de Finanzas Eu
          </h2>
          <div className="space-y-3 text-sm">
            <Row
              label="Bancos analizados"
              value="Revolut, N26, Wise, Bunq…"
            />
            <Row
              label="Tipo de cuentas"
              value="Neobancos, multidivisa, online"
            />
            <Row
              label="Enfoque"
              value="Claro, directo y sin humo"
            />
            <Row
              label="Coste para ti"
              value="0 € (web gratuita)"
            />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
            <span className="rounded-full bg-muted px-2 py-1 text-center">
              Sin comisiones ocultas
            </span>
            <span className="rounded-full bg-muted px-2 py-1 text-center">
              Pensado para remotos
            </span>
            <span className="rounded-full bg-muted px-2 py-1 text-center">
              Enlace directo a los bancos
            </span>
          </div>
        </div>
      </Container>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold text-right text-foreground">
        {value}
      </span>
    </div>
  );
}
