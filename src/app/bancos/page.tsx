// src/app/bancos/page.tsx
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import Container from "@/components/layout/Container";
import { banks } from "@/lib/banks";
import type { Bank } from "@/lib/banks";
import { Badge } from "@/components/ui/badge";
import { Globe2, CreditCard, ShieldCheck, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "Comparador de bancos europeos 2025",
  description:
    "Compara neobancos y bancos europeos como Revolut, N26, Wise o Bunq. Filtra por IBAN, comisiones, soporte en español, multidivisa y más.",
  alternates: {
    canonical: "https://finanzaseu.com/bancos",
  },
  openGraph: {
    title: "Comparador de bancos europeos 2025",
    description:
      "Encuentra el banco europeo que mejor encaja con tu perfil: viajero, freelance, empresa o expatriado.",
    url: "https://bancoseuropa.com/bancos",
    type: "website",
    siteName: "Bancos Europa",
  },
};

export default function BancosPage() {
  // Ordenamos usando prioridad interna y afiliación
  const sortedBanks = [...banks].sort((a, b) => {
    const aPriority = typeof a._priority === "number" ? a._priority : 999;
    const bPriority = typeof b._priority === "number" ? b._priority : 999;

    if (aPriority !== bPriority) return aPriority - bPriority;

    const aAff = a.affiliateUrl ? 1 : 0;
    const bAff = b.affiliateUrl ? 1 : 0;
    return bAff - aAff;
  });

  // Métricas rápidas para darle nivel pro
  const totalBanks = banks.length;
  const freeAccounts = banks.filter((b) =>
    /gratis|0\s*€/i.test(b.fees.monthly),
  ).length;
  const multiCurrency = banks.filter((b) =>
    b.tags.includes("multidivisa"),
  ).length;
  const spanishSupport = banks.filter(
    (b) => b.support.spanishSupport,
  ).length;

  return (
    <section className="py-12 md:py-16">
      <Container className="space-y-10">
        {/* Encabezado */}
        <header className="space-y-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Star className="h-3 w-3" />
            Ranking 2025 · Bancos recomendados en Europa
          </span>

          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Elige tu banco en Europa con{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              datos claros y comparables
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            Selección de bancos digitales y tradicionales que permiten abrir
            cuenta online, muchos aptos para{" "}
            <strong className="font-semibold text-foreground">
              no residentes, nómadas digitales y freelancers
            </strong>
            . Haz clic en cada banco para ver la ficha detallada, requisitos y
            pasos para abrir tu cuenta.
          </p>
        </header>

        {/* Métricas resumen */}
        <section className="grid gap-3 md:grid-cols-4">
          <Metric
            label="Bancos analizados"
            value={totalBanks.toString()}
            description="Neobancos, fintech y tradicionales."
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

        {/* Grid de bancos */}
        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedBanks.map((bank) => (
            <BankCard key={bank.slug} bank={bank} />
          ))}
        </section>

        {/* Nota final */}
        <p className="mx-auto max-w-2xl text-center text-xs text-muted-foreground md:text-sm">
          La información sobre comisiones, requisitos y países admitidos puede
          cambiar con el tiempo. Revisa siempre los detalles en la web oficial
          del banco antes de abrir tu cuenta. Algunos enlaces pueden ser de
          afiliados; esto no afecta a nuestro análisis.
        </p>
      </Container>
    </section>
  );
}

// ============ COMPONENTE DE TARJETA ============

function BankCard({ bank }: { bank: Bank }) {
  const {
    slug,
    name,
    tagline,
    logo,
    country,
    ibanCountry,
    category,
    tags,
    fees,
    cardType,
    affiliateUrl,
    support,
    rating,
  } = bank;

  const detailUrl = `/programas/${slug}`;
  const logoSrc = logo; // string | StaticImageData, válido para <Image />

  const hasSpanish = support.spanishSupport;
  const isFree = /gratis|0\s*€/i.test(fees.monthly);

  return (
    <article className="group flex flex-col rounded-3xl border border-border bg-background/90 p-5 shadow-md transition-transform duration-200 hover:-translate-y-1 hover:shadow-xl">
      {/* Header: logo + nombre + categoría */}
      <div className="flex items-start gap-3">
        <div className="relative h-10 w-10 rounded-xl bg-hero-background/60 p-1.5 md:h-12 md:w-12">
          <Image
            src={logoSrc}
            alt={name}
            fill
            className="rounded-lg object-contain"
          />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h2 className="truncate text-base font-semibold md:text-lg">
              {name}
            </h2>
            {affiliateUrl && (
              <Badge className="h-5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-[10px] text-white">
                Recomendado
              </Badge>
            )}
          </div>
          <p className="mt-0.5 text-[11px] text-muted-foreground md:text-xs">
            {country}
            {ibanCountry && (
              <span className="text-muted-foreground">
                {" "}
                · IBAN {ibanCountry}
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Tagline */}
      <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
        {tagline}
      </p>

      {/* Tags / chips */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        <CategoryBadge category={category} />
        {tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
          >
            {formatTag(tag)}
          </span>
        ))}
        {tags.length > 3 && (
          <span className="inline-flex items-center rounded-full border border-dashed border-border bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground">
            +{tags.length - 3}
          </span>
        )}
      </div>

      {/* Info rápida / stats */}
      <dl className="mt-4 grid grid-cols-1 gap-2 text-xs">
        <InfoRow
          label="Cuota mensual"
          value={fees.monthly}
          highlight={isFree ? "success" : undefined}
        />
        <InfoRow
          label="Tipo de tarjeta"
          value={cardType || "—"}
          icon={<CreditCard className="h-3 w-3" />}
        />
        <InfoRow
          label="Soporte / app en español"
          value={hasSpanish ? "Sí" : "No"}
          highlight={hasSpanish ? "success" : undefined}
        />
        {rating?.trustpilot && (
          <InfoRow
            label="Trustpilot"
            value={`${rating.trustpilot.toFixed(1)} / 5`}
            icon={<Star className="h-3 w-3 text-yellow-500" />}
          />
        )}
      </dl>

      {/* Footer / CTAs */}
      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={detailUrl}
          className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2 text-xs font-semibold text-black shadow-md transition hover:brightness-105"
        >
          Ver análisis y cómo abrirla →
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <Globe2 className="h-3 w-3" />
            Apertura 100% online
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            Depósitos protegidos en la UE
          </span>
        </div>

        {affiliateUrl && (
          <a
            href={affiliateUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-1 inline-flex items-center justify-center rounded-full border border-border bg-background px-4 py-2 text-[11px] font-medium text-muted-foreground transition hover:bg-muted/70"
          >
            Ir directamente a {name}
          </a>
        )}
      </div>
    </article>
  );
}

// ============ COMPONENTES AUXILIARES ============

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
      ? "text-emerald-600 dark:text-emerald-400 font-semibold"
      : "text-foreground";

  return (
    <div className="flex items-center justify-between gap-2">
      <dt className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {icon && <span>{icon}</span>}
        <span>{label}</span>
      </dt>
      <dd
        className={`text-[11px] text-right md:text-xs ${valueClasses}`}
      >
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
    <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-[11px] font-medium">
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
    "seguro-depositos": "Depósitos protegidos",
    "soporte-24-7": "Soporte 24/7",
  };
  return map[tag] ?? tag;
}

// Métrica pequeña de la parte superior
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
  const toneClasses =
    tone === "success"
      ? "border-emerald-200/70 bg-emerald-50/70 dark:border-emerald-900/60 dark:bg-emerald-950/30"
      : "border-border/70 bg-background/90";

  return (
    <div className={`rounded-2xl border p-3 shadow-sm md:p-4 ${toneClasses}`}>
      <p className="text-[11px] font-medium text-muted-foreground md:text-xs">
        {label}
      </p>
      <p className="mt-1 text-xl font-bold text-foreground md:text-2xl">
        {value}
      </p>
      {description && (
        <p className="mt-1 text-[11px] text-muted-foreground md:text-xs">
          {description}
        </p>
      )}
    </div>
  );
}
