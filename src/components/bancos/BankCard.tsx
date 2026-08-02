// src/components/bancos/BankCard.tsx
"use client";

import Image from "next/image";
import { Star } from "lucide-react";

import { Button } from "@/components/ui/button";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { type Bank } from "@/lib/banks";
import type { Locale } from "@/lib/i18n";

type BankCardProps = {
  bank: Bank;
  showDirectLink?: boolean;
};

const UI_COPY: Record<Locale, {
  categories: Record<Bank["category"], string>;
  tags: Record<string, string>;
  monthlyFee: string;
  cardType: string;
  spanishSupport: string;
  yes: string;
  no: string;
  underReview: string;
  recommended: string;
  viewAnalysis: string;
  visitSite: string;
  trustpilot: string;
}> = {
  es: {
    categories: {
      neobanco: "Neobanco",
      tradicional: "Banco tradicional",
      "cuenta-multidivisa": "Cuenta multidivisa",
      fintech: "Fintech",
    },
    tags: {
      "sin-comisiones": "Sin comisiones",
      "tarjeta-fisica": "Tarjeta física",
      "tarjeta-virtual": "Tarjeta virtual",
      multidivisa: "Multidivisa",
      crypto: "Cripto",
      "para-freelancers": "Para freelancers",
      "para-empresa": "Para empresa",
      "no-residentes": "Acepta no residentes",
      espanol: "App/soporte en español",
      "iban-es": "IBAN ES",
      "iban-nl": "IBAN NL",
      "iban-de": "IBAN DE",
      "iban-lt": "IBAN LT",
      "iban-be": "IBAN BE",
      "seguro-depositos": "Garantía de depósitos",
      "soporte-24-7": "Soporte 24/7",
    },
    monthlyFee: "Cuota mensual",
    cardType: "Tipo de tarjeta",
    spanishSupport: "Soporte en español",
    yes: "Sí",
    no: "No",
    underReview: "En revisión",
    recommended: "Recomendado",
    viewAnalysis: "Ver análisis y cómo abrirla →",
    visitSite: "Ir directamente a",
    trustpilot: "Trustpilot",
  },
  en: {
    categories: {
      neobanco: "Neobank",
      tradicional: "Traditional Bank",
      "cuenta-multidivisa": "Multi-currency Account",
      fintech: "Fintech",
    },
    tags: {
      "sin-comisiones": "No monthly fees",
      "tarjeta-fisica": "Physical card",
      "tarjeta-virtual": "Virtual card",
      multidivisa: "Multi-currency",
      crypto: "Crypto",
      "para-freelancers": "For freelancers",
      "para-empresa": "For business",
      "no-residentes": "Non-residents accepted",
      espanol: "Spanish support/app",
      "iban-es": "Spanish IBAN",
      "iban-nl": "Dutch IBAN",
      "iban-de": "German IBAN",
      "iban-lt": "Lithuanian IBAN",
      "iban-be": "Belgian IBAN",
      "seguro-depositos": "Deposit guarantee",
      "soporte-24-7": "24/7 Support",
    },
    monthlyFee: "Monthly fee",
    cardType: "Card type",
    spanishSupport: "Spanish support",
    yes: "Yes",
    no: "No",
    underReview: "Under review",
    recommended: "Top Pick",
    viewAnalysis: "View analysis & open →",
    visitSite: "Go directly to",
    trustpilot: "Trustpilot",
  },
};

export default function BankCard({ bank, showDirectLink = true }: BankCardProps) {
  const { locale } = useLocale();
  const copy = UI_COPY[locale];
  const detailUrl = `/programas/${bank.slug}`;
  const hasAffiliate = Boolean(bank.affiliateUrl);
  const hasSpanish = bank.support.spanishSupport;
  const isFree = /gratis|0\s*(€|\u20ac)/i.test(bank.fees.monthly);

  return (
    <article className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-6 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent">
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <div>
        <header className="relative flex items-start gap-4">
          <div className="relative h-12 w-12 shrink-0 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2">
            <Image
              src={bank.logo}
              alt={bank.name}
              fill
              sizes="48px"
              className="object-contain p-1.5"
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-lg font-black tracking-tight text-accent">
                {bank.name}
              </h3>
              {bank._status === "draft" ? (
                <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/15 bg-secondary-foreground/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-secondary-foreground/80">
                  {copy.underReview}
                </span>
              ) : null}
              {hasAffiliate ? (
                <span className="inline-flex items-center rounded-full border-2 border-secondary bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                  {copy.recommended}
                </span>
              ) : null}
            </div>

            <p className="mt-1 text-xs text-secondary-foreground/70">
              {bank.country}
              {bank.ibanPrefix ? (
                <span className="opacity-80"> · IBAN {bank.ibanPrefix}</span>
              ) : null}
            </p>
          </div>
        </header>

        <p className="relative mt-4 line-clamp-3 text-sm leading-relaxed text-secondary-foreground/80">
          {bank.tagline}
        </p>

        <div className="relative mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground/80">
            {copy.categories[bank.category] ?? bank.category}
          </span>

          {bank.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground/80"
            >
              {copy.tags[tag] ?? tag}
            </span>
          ))}

          {bank.tags.length > 3 ? (
            <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground/70">
              +{bank.tags.length - 3}
            </span>
          ) : null}
        </div>

        <dl className="relative mt-5 grid grid-cols-1 gap-2 text-xs">
          <InfoRow
            label={copy.monthlyFee}
            value={bank.fees.monthly}
            highlight={isFree ? "success" : undefined}
          />
          <InfoRow label={copy.cardType} value={bank.cardType || "—"} />
          <InfoRow
            label={copy.spanishSupport}
            value={hasSpanish ? copy.yes : copy.no}
            highlight={hasSpanish ? "success" : undefined}
          />
          {bank.rating?.trustpilot ? (
            <InfoRow
              label={copy.trustpilot}
              value={`${bank.rating.trustpilot.toFixed(1)} / 5`}
              icon={<Star className="h-3.5 w-3.5 text-accent" />}
            />
          ) : null}
        </dl>
      </div>

      <div className="relative mt-6 flex flex-col gap-3">
        <Button asChild size="sm" className="w-full">
          <LocalizedLink href={detailUrl}>{copy.viewAnalysis}</LocalizedLink>
        </Button>

        {showDirectLink && bank.affiliateUrl ? (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
          >
            <a
              href={bank.affiliateUrl}
              data-analytics="affiliate"
              data-affiliate-partner={bank.slug}
              target="_blank"
              rel="noreferrer noopener sponsored"
            >
              {copy.visitSite} {bank.name}
            </a>
          </Button>
        ) : null}
      </div>
    </article>
  );
}

function InfoRow({
  label,
  value,
  icon,
  highlight,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  highlight?: "success";
}) {
  const valueClasses =
    highlight === "success"
      ? "text-primary font-semibold"
      : "text-secondary-foreground";

  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1 text-[11px] text-secondary-foreground/70">
        {icon ? <span className="text-secondary-foreground/70">{icon}</span> : null}
        <span>{label}</span>
      </dt>
      <dd className={`text-[11px] text-right md:text-xs ${valueClasses}`}>
        {value}
      </dd>
    </div>
  );
}

