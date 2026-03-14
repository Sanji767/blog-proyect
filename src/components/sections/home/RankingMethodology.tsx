import Link from "next/link";
import { CheckCircle2, FileText, Info, Scale, ShieldCheck } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { withLocale, type Locale } from "@/lib/i18n";

type Props = {
  lastUpdatedLabel?: string;
  locale?: Locale;
};

const CRITERIA_BY_LOCALE = {
  es: [
    {
      title: "Costes y letra pequeña",
      description:
        "Cuota, cajeros, cambio de divisa, transferencias y condiciones del plan gratuito.",
      icon: Scale,
    },
    {
      title: "IBAN y operativa real",
      description:
        "Prefijo/país de IBAN, SEPA y detalles prácticos para cobrar nómina, pagar y domiciliar.",
      icon: CheckCircle2,
    },
    {
      title: "Requisitos y países admitidos",
      description:
        "Documentación, residencia, proceso de alta y lista de países aceptados cuando aplica.",
      icon: FileText,
    },
    {
      title: "Seguridad y soporte",
      description:
        "Licencia, supervisión, garantías (según entidad) y soporte en español.",
      icon: ShieldCheck,
    },
  ],
  en: [
    {
      title: "Costs & fine print",
      description:
        "Monthly fees, ATMs, FX rates, transfers and the conditions of the free plan.",
      icon: Scale,
    },
    {
      title: "IBAN and real usability",
      description:
        "IBAN country/prefix, SEPA and practical details for salary, payments and direct debits.",
      icon: CheckCircle2,
    },
    {
      title: "Requirements & eligibility",
      description:
        "Documents, residency rules, onboarding steps and eligible countries when applicable.",
      icon: FileText,
    },
    {
      title: "Security & support",
      description:
        "License, supervision, guarantees (when applicable) and support experience.",
      icon: ShieldCheck,
    },
  ],
} as const;

const COPY = {
  es: {
    kicker: "Transparencia",
    titlePrefix: "Metodología del",
    titleHighlight: "ranking",
    desc: "Ordenamos recomendaciones con criterios comparables y enlaces oficiales para verificar condiciones.",
    datasetUpdated: "Última actualización del dataset:",
    note: "La información puede cambiar. Revisa siempre la web oficial antes de abrir cuenta.",
    ctaComparison: "Ver comparativa",
    ctaAffiliates: "Transparencia (afiliados)",
  },
  en: {
    kicker: "Transparency",
    titlePrefix: "Ranking",
    titleHighlight: "methodology",
    desc: "We rank recommendations with comparable criteria and official links to verify conditions.",
    datasetUpdated: "Dataset last updated:",
    note: "Information can change. Always check the official website before opening an account.",
    ctaComparison: "See comparison",
    ctaAffiliates: "Affiliate disclosure",
  },
} as const;

export default function RankingMethodology({ lastUpdatedLabel, locale = "es" }: Props) {
  const copy = COPY[locale];
  const criteria = CRITERIA_BY_LOCALE[locale];

  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <Container className="space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            {copy.kicker}
          </p>

          <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
            {copy.titlePrefix}{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              {copy.titleHighlight}
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            {copy.desc}
          </p>

          {lastUpdatedLabel ? (
            <p className="text-xs text-muted-foreground">
              {copy.datasetUpdated}{" "}
              <strong className="font-semibold text-foreground">
                {lastUpdatedLabel}
              </strong>
            </p>
          ) : null}
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {criteria.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft"
            >
              <div className="mb-3 inline-flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <h3 className="text-base font-black tracking-tight md:text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>{copy.note}</p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href={withLocale("/comparativa", locale)}>{copy.ctaComparison}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={withLocale("/aviso-afiliados", locale)}>{copy.ctaAffiliates}</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}
