// app/ventajas/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import {
  Globe,
  Euro,
  CreditCard,
  Lock,
  Zap,
  Users,
  ArrowRight,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ventajas de los bancos digitales en Europa | FinanzasEU",
  description:
    "Análisis independiente de las ventajas reales de los bancos digitales en Europa: comisiones, IBAN, seguridad, multidivisa y soporte. Actualizado en 2026.",
};

const LAST_UPDATE = "Febrero 2026";
const LAST_UPDATE_ISO = "2026-02-08";

export default function VentajasPage() {
  const ventajas = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "IBAN europeo (SEPA) para operar en Europa",
      desc: "Recibe dinero, paga facturas o domicilia recibos con un IBAN europeo (según entidad y país).",
      stat: "SEPA",
    },
    {
      icon: <Euro className="w-6 h-6" />,
      title: "Transferencias SEPA con comisiones bajas",
      desc: "En muchos bancos digitales, las transferencias SEPA estándar son gratuitas o baratas (según plan).",
      stat: "Según plan",
    },
    {
      icon: <CreditCard className="w-6 h-6" />,
      title: "Pagos internacionales con mejor tipo de cambio",
      desc: "Algunas cuentas multidivisa reducen el margen de cambio frente a bancos tradicionales (según plan y horario).",
      stat: "Multidivisa",
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: "Protección y regulación (según entidad)",
      desc: "Si es un banco con licencia, puede aplicar garantía de depósitos (habitualmente hasta 100.000 €). En e-money no es lo mismo.",
      stat: "Según entidad",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Transferencias instantáneas (cuando disponible)",
      desc: "Envía dinero en segundos entre cuentas compatibles con transferencias instantáneas SEPA.",
      stat: "< 10 s",
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Soporte en español (en muchos casos)",
      desc: "Chat/email y ayuda en español en varias entidades. Lo indicamos en cada ficha cuando aplica.",
      stat: "Soporte",
    },
  ];

  const stats = [
    { value: "SEPA", label: "IBAN y transferencias en la UE" },
    { value: "Fuentes", label: "Enlaces oficiales para verificar condiciones" },
    { value: "2026", label: `Última revisión: ${LAST_UPDATE}` },
  ];

  const pasos = [
    {
      step: "1",
      title: "Datos reales",
      desc: "Revisamos comisiones, requisitos, límites y condiciones, y los contrastamos con fuentes oficiales.",
    },
    {
      step: "2",
      title: "Sin humo ni posiciones compradas",
      desc: "No vendemos posiciones. Si algo no compensa, lo decimos claro aunque tenga enlace de afiliado.",
    },
    {
      step: "3",
      title: "Actualización constante",
      desc: `Revisamos fees, requisitos y condiciones de forma recurrente. Última actualización: ${LAST_UPDATE}.`,
    },
  ];

  return (
    <>
      <section className="py-16 md:py-20 bg-gradient-to-b from-background to-hero-background">
        <Container className="space-y-16">
          {/* Encabezado profesional */}
          <header className="mx-auto max-w-4xl space-y-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <span>Guía actualizada</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{LAST_UPDATE}</span>
            </div>

            <h1 className="text-3xl font-bold leading-tight md:text-5xl">
              Ventajas reales de los bancos digitales en Europa
            </h1>

            <p className="text-lg text-muted-foreground">
              Más allá del marketing: analizamos comisiones, seguridad, IBAN,
              multidivisa y soporte para ayudarte a elegir el banco que de
              verdad encaja con tu forma de vivir y trabajar.
            </p>
          </header>

          {/* Grid de ventajas */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ventajas.map((v) => (
              <article
                key={v.title}
                className="group rounded-2xl border border-border bg-card p-6 shadow-card transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  {v.icon}
                </div>
                <h2 className="mb-2 text-lg font-semibold">{v.title}</h2>
                <p className="mb-3 text-sm text-muted-foreground">{v.desc}</p>
                <span className="inline-block rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {v.stat}
                </span>
              </article>
            ))}
          </div>

          {/* Estadísticas de confianza */}
          <section className="grid gap-6 text-center md:grid-cols-3">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-gradient-to-br from-primary/5 to-primary/10 p-6 dark:from-primary/10 dark:to-primary/20"
              >
                <div className="text-3xl font-bold text-primary md:text-4xl">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            ))}
          </section>

          {/* Proceso de análisis */}
          <section className="rounded-3xl border border-border bg-card p-8 shadow-card md:p-12">
            <h2 className="mb-8 text-center text-2xl font-bold md:text-3xl">
              Cómo analizamos los bancos en FinanzasEU
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {pasos.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-base font-bold text-black shadow-soft">
                    {s.step}
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA final – conversión suave */}
          <section className="space-y-6 py-6 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Encuentra el banco que de verdad te conviene
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
              Filtra por multidivisa, tarjeta física, IBAN europeo, países
              aceptados o si aceptan no residentes. No todos los bancos sirven
              para todo, y eso es precisamente lo que te explicamos.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Link
                href="/bancos"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-black shadow-soft transition hover:brightness-105"
              >
                Ver comparativa completa
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/programas/revolut"
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-primary px-8 py-3 text-sm font-semibold text-primary transition hover:bg-primary/5"
              >
                Ver Revolut (recomendado)
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Algunos enlaces pueden ser de afiliados. Esto no cambia nuestro
              análisis: si algo no compensa, lo decimos.
            </p>
          </section>
        </Container>
      </section>

      {/* Schema.org con next/script */}
      <Script
        id="ld-json-ventajas-bancos-digitales"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: toJsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Ventajas de los bancos digitales en Europa",
            description:
              "Análisis independiente de comisiones, seguridad, IBAN y ventajas reales de los bancos digitales.",
            publisher: {
              "@type": "Organization",
              name: "FinanzasEU",
            },
            dateModified: LAST_UPDATE_ISO,
          }),
        }}
      />
    </>
  );
}
