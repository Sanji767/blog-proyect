// src/components/sections/home/Hero.tsx

import Link from "next/link";
import { ShieldCheck, Globe2, ArrowRight, Sparkles } from "lucide-react";
import Container from "@/components/layout/Container";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-hero-background py-16 md:py-24">
      {/* Degradado sutil de fondo */}
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.18)_0,_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.18)_0,_transparent_55%)]" />

      <Container className="grid items-center gap-10 md:grid-cols-2">
        {/* Columna texto */}
        <div className="space-y-6 animate-fade-in-up">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
            <Sparkles className="h-3.5 w-3.5" />
            Finanzas Eu · Bancos para vivir en Europa
          </span>

          <h1 className="text-balance text-3xl font-black leading-tight md:text-5xl">
            Abre tu cuenta en Europa{" "}
            <span className="bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-400 bg-clip-text text-transparent">
              sin líos ni letra pequeña
            </span>
            .
          </h1>

          <p className="max-w-xl text-sm text-muted-foreground md:text-base">
            Comparo bancos como <strong>Revolut, N26, Wise o Bunq</strong> para
            que sepas cuál encaja mejor contigo según dónde vives, si trabajas
            en remoto, viajas o necesitas cuenta multidivisa.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            {/* Botón principal con degradado verde-turquesa */}
            <Link
              href="/comparativa"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-transform hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
            >
              Ver ranking de bancos
              <ArrowRight className="ml-1.5 h-4 w-4" />
            </Link>

            <Link
              href="/bancos"
              className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground/90 hover:bg-background/70"
            >
              Ver todos los bancos
            </Link>
          </div>

          {/* Bullets de confianza */}
          <ul className="mt-4 grid gap-2 text-xs text-muted-foreground md:text-sm">
            <li className="inline-flex items-start gap-2">
              <ShieldCheck className="mt-[2px] h-4 w-4 text-emerald-500" />
              <span>Bancos regulados en la UE y Reino Unido, sin humo comercial.</span>
            </li>
            <li className="inline-flex items-start gap-2">
              <Globe2 className="mt-[2px] h-4 w-4 text-cyan-500" />
              <span>Perfecto si vives en un país, cobras desde otro o viajas a menudo.</span>
            </li>
            <li>• Ideal para remotos, freelancers, nómadas y expatriados.</li>
          </ul>

          {/* Mini barra de stats */}
          <div className="mt-5 grid max-w-md grid-cols-3 gap-2 text-[11px] text-muted-foreground">
            <div className="rounded-2xl bg-background/70 px-3 py-2 text-center shadow-sm">
              <p className="text-xs font-semibold text-foreground">Bancos clave</p>
              <p>Revolut · N26 · Wise · Bunq…</p>
            </div>
            <div className="rounded-2xl bg-background/70 px-3 py-2 text-center shadow-sm">
              <p className="text-xs font-semibold text-foreground">Tipo de cuentas</p>
              <p>Neobancos · Multidivisa</p>
            </div>
            <div className="rounded-2xl bg-background/70 px-3 py-2 text-center shadow-sm">
              <p className="text-xs font-semibold text-foreground">Coste para ti</p>
              <p>0 € · Web gratuita</p>
            </div>
          </div>
        </div>

        {/* Columna tarjeta resumen */}
        <div className="animate-fade-in-up rounded-3xl border border-border bg-background/95 p-5 shadow-card backdrop-blur md:p-6">
          <h2 className="mb-4 text-sm font-semibold text-muted-foreground">
            Resumen rápido de Finanzas Eu
          </h2>
          <div className="space-y-3 text-sm">
            <Row label="Bancos analizados" value="Revolut, N26, Wise, Bunq…" />
            <Row label="Tipo de cuentas" value="Neobancos, multidivisa, online" />
            <Row label="Enfoque" value="Claro, directo y sin humo" />
            <Row label="Coste para ti" value="0 € (web gratuita)" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2 text-[11px] text-muted-foreground">
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
