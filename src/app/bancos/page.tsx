// src/app/bancos/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Globe2, ShieldCheck, Star } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { banks, type Bank } from "@/lib/banks";
import { formatIsoYmdToEsDate } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Comparador de bancos europeos 2026",
  description:
    "Compara neobancos y bancos europeos como Revolut, N26, Wise o Bunq. Filtra por IBAN, comisiones, requisitos, soporte en español, multidivisa y más.",
  alternates: {
    canonical: "https://finanzaseu.com/bancos",
    languages: {
      es: "https://finanzaseu.com/bancos",
      en: "https://finanzaseu.com/en/bancos",
    },
  },
  openGraph: {
    title: "Comparador de bancos europeos 2026",
    description:
      "Encuentra el banco europeo que mejor encaja con tu perfil: viajero, freelance, empresa o expatriado.",
    url: "https://finanzaseu.com/bancos",
    type: "website",
    siteName: "FinanzasEU",
  },
};

export default function BancosPage() {
  const publishedBanks = banks.filter((b) => b._status !== "draft");

  const latestBankUpdate = banks
    .map((b) => b._lastUpdated)
    .filter(Boolean)
    .sort()
    .at(-1);

  const lastUpdatedLabel = formatIsoYmdToEsDate(latestBankUpdate);

  const sortedBanks = [...banks].sort((a, b) => {
    const aPriority = typeof a._priority === "number" ? a._priority : 999;
    const bPriority = typeof b._priority === "number" ? b._priority : 999;

    if (aPriority !== bPriority) return aPriority - bPriority;

    const aAff = a.affiliateUrl ? 1 : 0;
    const bAff = b.affiliateUrl ? 1 : 0;
    return bAff - aAff;
  });

  const totalBanks = publishedBanks.length;
  const freeAccounts = publishedBanks.filter((b) => /gratis|0\s*€/i.test(b.fees.monthly))
    .length;
  const multiCurrency = publishedBanks.filter((b) => b.tags.includes("multidivisa"))
    .length;
  const spanishSupport = publishedBanks.filter((b) => b.support.spanishSupport).length;

  return (
    <section className="py-16 md:py-24">
      <Container className="space-y-12">
        <header className="space-y-5 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Ranking 2026 · Bancos recomendados en Europa
          </p>

          {lastUpdatedLabel ? (
            <p className="text-xs text-muted-foreground">
              Última revisión:{" "}
              <strong className="font-semibold text-foreground">
                {lastUpdatedLabel}
              </strong>{" "}
              ·{" "}
              <Link
                href="/aviso-afiliados"
                className="underline underline-offset-4"
              >
                Transparencia (afiliados)
              </Link>
            </p>
          ) : null}

          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Elige tu banco en Europa con{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              datos claros
            </span>
            .
          </h1>

          <p className="mx-auto max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Selección editorial de bancos digitales y tradicionales que permiten
            abrir cuenta online, muchos aptos para{" "}
            <strong className="font-semibold text-foreground">
              no residentes, nómadas digitales y freelancers
            </strong>
            . Haz clic en cada banco para ver ficha, requisitos y pasos para
            abrir la cuenta.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric
            label="Bancos publicados"
            value={totalBanks.toString()}
            description="Fichas completas y revisadas."
          />
          <Metric
            label="Cuentas sin cuota mensual"
            value={freeAccounts.toString()}
            description="Planes 0 €/mes o gratis."
            tone="success"
          />
          <Metric
            label="Cuentas multidivisa"
            value={multiCurrency.toString()}
            description="Ideal para viajar o cobrar en otras divisas."
          />
          <Metric
            label="Soporte en español"
            value={spanishSupport.toString()}
            description="App o atención en español."
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedBanks.map((bank) => (
            <BankCard key={bank.slug} bank={bank} />
          ))}
        </section>

        <p className="mx-auto max-w-3xl text-center text-xs text-muted-foreground md:text-sm">
          La información sobre comisiones, requisitos y países admitidos puede
          cambiar. Revisa siempre los detalles en la web oficial antes de abrir
          tu cuenta. Algunos enlaces pueden ser de afiliados; esto no afecta a
          nuestro análisis.
        </p>
      </Container>
    </section>
  );
}

function BankCard({ bank }: { bank: Bank }) {
  const {
    slug,
    name,
    tagline,
    logo,
    country,
    tags,
    fees,
    cardType,
    affiliateUrl,
    support,
    rating,
  } = bank;

  const detailUrl = `/programas/${slug}`;

  const hasSpanish = support.spanishSupport;
  const isFree = /gratis|0\s*€/i.test(fees.monthly);

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-6 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent">
      <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

      <header className="relative flex items-start gap-4">
        <div className="relative h-12 w-12 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2">
          <Image src={logo} alt={name} fill className="object-contain p-1.5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="truncate text-lg font-black tracking-tight text-accent">
              {name}
            </h2>
            {bank._status === "draft" ? (
              <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/15 bg-secondary-foreground/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-secondary-foreground/80">
                En revisión
              </span>
            ) : null}
            {affiliateUrl ? (
              <span className="inline-flex items-center rounded-full border-2 border-secondary bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                Recomendado
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-secondary-foreground/70">
            {country}
            {bank.ibanPrefix ? (
              <span className="opacity-80"> · IBAN {bank.ibanPrefix}</span>
            ) : null}
          </p>
        </div>
      </header>

      <p className="relative mt-4 line-clamp-3 text-sm leading-relaxed text-secondary-foreground/80">
        {tagline}
      </p>

      <div className="relative mt-4 flex flex-wrap gap-2">
        <CategoryBadge category={bank.category} />

        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground/80"
          >
            {formatTag(tag)}
          </span>
        ))}

        {tags.length > 3 ? (
          <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground/70">
            +{tags.length - 3}
          </span>
        ) : null}
      </div>

      <dl className="relative mt-5 grid grid-cols-1 gap-2 text-xs">
        <InfoRow
          label="Cuota mensual"
          value={fees.monthly}
          highlight={isFree ? "success" : undefined}
        />
        <InfoRow
          label="Tipo de tarjeta"
          value={cardType || "—"}
          icon={<CreditCard className="h-3.5 w-3.5" />}
        />
        <InfoRow
          label="Soporte / app en español"
          value={hasSpanish ? "Sí" : "No"}
          highlight={hasSpanish ? "success" : undefined}
        />
        {rating?.trustpilot ? (
          <InfoRow
            label="Trustpilot"
            value={`${rating.trustpilot.toFixed(1)} / 5`}
            icon={<Star className="h-3.5 w-3.5 text-accent" />}
          />
        ) : null}
      </dl>

      <div className="relative mt-6 flex flex-col gap-3">
        <Button asChild size="sm" className="w-full">
          <Link href={detailUrl}>Ver análisis y cómo abrirla →</Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-secondary-foreground/75">
          <span className="inline-flex items-center gap-1">
            <Globe2 className="h-3.5 w-3.5" />
            Apertura 100% online
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Protección (según entidad)
          </span>
        </div>

        {affiliateUrl ? (
          <Button
            asChild
            size="sm"
            variant="outline"
            className="w-full border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5"
          >
            <a
              href={affiliateUrl}
              data-analytics="affiliate"
              data-affiliate-partner={slug}
              target="_blank"
              rel="noreferrer noopener sponsored"
            >
              Ir directamente a {name}
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

function CategoryBadge({ category }: { category: Bank["category"] }) {
  const labelMap: Record<Bank["category"], string> = {
    neobanco: "Neobanco",
    tradicional: "Banco tradicional",
    "cuenta-multidivisa": "Cuenta multidivisa",
    fintech: "Fintech",
  };

  return (
    <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-2.5 py-1 text-[11px] font-medium text-secondary-foreground/80">
      {labelMap[category] ?? category}
    </span>
  );
}

function formatTag(tag: Bank["tags"][number]): string {
  const map: Record<string, string> = {
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
    "seguro-depositos": "Depósitos protegidos",
    "soporte-24-7": "Soporte 24/7",
  };
  return map[tag] ?? tag;
}

function Metric({
  label,
  value,
  description,
  tone = "default",
}: {
  label: string;
  value: string;
  description?: string;
  tone?: "default" | "success";
}) {
  return (
    <div className="rounded-2xl border-2 border-border bg-card p-4 shadow-soft">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </p>
      <p
        className={[
          "mt-2 text-2xl font-black tracking-tight md:text-3xl",
          tone === "success" ? "text-primary" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </p>
      {description ? (
        <p className="mt-2 text-[11px] text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
