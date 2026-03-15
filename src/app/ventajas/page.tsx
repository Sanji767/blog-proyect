// src/app/ventajas/page.tsx
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Ventajas de los bancos digitales en Europa | FinanzasEU",
  description:
    "Análisis independiente de las ventajas reales de los bancos digitales en Europa: comisiones, IBAN, seguridad, multidivisa y soporte. Actualizado en 2026.",
  alternates: {
    canonical: "/ventajas",
    languages: {
      es: "/ventajas",
      en: "/en/ventajas",
    },
  },
};

const LAST_UPDATE = "Febrero 2026";
const LAST_UPDATE_ISO = "2026-02-08";

export default function VentajasPage() {
  const ventajas = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "IBAN europeo (SEPA) para operar en Europa",
      desc: "Recibe dinero, paga facturas o domicilia recibos con un IBAN europeo (según entidad y país).",
      stat: "SEPA",
    },
    {
      icon: <Euro className="h-6 w-6" />,
      title: "Transferencias SEPA con comisiones bajas",
      desc: "En muchos bancos digitales, las transferencias SEPA estándar son gratuitas o baratas (según plan).",
      stat: "Según plan",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Pagos internacionales con mejor tipo de cambio",
      desc: "Algunas cuentas multidivisa reducen el margen de cambio frente a bancos tradicionales (según plan y horario).",
      stat: "Multidivisa",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Protección y regulación (según entidad)",
      desc: "Si es un banco con licencia, puede aplicar garantía de depósitos (habitualmente hasta 100.000 €). En e-money no es lo mismo.",
      stat: "Seguridad",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Transferencias instantáneas (cuando disponible)",
      desc: "Envía dinero en segundos entre cuentas compatibles con transferencias instantáneas SEPA.",
      stat: "< 10 s",
    },
    {
      icon: <Users className="h-6 w-6" />,
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
      <section className="py-16 md:py-24">
        <Container className="space-y-14">
          <header className="mx-auto max-w-4xl space-y-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Guía actualizada · {LAST_UPDATE}
            </p>

            <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
              Ventajas reales de los bancos digitales en{" "}
              <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                Europa
              </span>
              .
            </h1>

            <p className="mx-auto max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Más allá del marketing: analizamos comisiones, seguridad, IBAN,
              multidivisa y soporte para ayudarte a elegir con criterio.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {ventajas.map((v) => (
              <Card
                key={v.title}
                className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 text-primary">
                  {v.icon}
                </div>

                <h2 className="relative text-balance text-lg font-black tracking-tight text-accent">
                  {v.title}
                </h2>

                <p className="relative mt-3 text-sm leading-relaxed text-secondary-foreground/80">
                  {v.desc}
                </p>

                <div className="relative mt-5 inline-flex w-fit items-center rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                  {v.stat}
                </div>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <div className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </section>

          <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft md:p-12">
            <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

            <h2 className="relative text-center text-2xl font-black tracking-tight text-accent md:text-4xl">
              Cómo analizamos los bancos en FinanzasEU
            </h2>

            <div className="relative mt-10 grid gap-8 md:grid-cols-3">
              {pasos.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-secondary bg-accent text-base font-black text-accent-foreground shadow-offset-accent">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-black tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/80">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <section className="space-y-6 text-center">
            <h2 className="text-balance text-2xl font-black tracking-tight md:text-4xl">
              Encuentra el banco que de verdad te conviene
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
              Filtra por multidivisa, tarjeta física, IBAN europeo, países
              aceptados o si aceptan no residentes. No todos los bancos sirven
              para todo.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
              >
                <Link href="/comparativa">
                  Ver comparativa
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
              >
                <Link href="/programas/revolut">Ver Revolut (recomendado)</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Algunos enlaces pueden ser de afiliados. Esto no cambia nuestro
              análisis: si algo no compensa, lo decimos.
            </p>
          </section>
        </Container>
      </section>

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
