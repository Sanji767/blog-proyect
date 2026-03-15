// src/app/en/bancos/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CreditCard, Globe2, ShieldCheck, Star } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { banks, type Bank } from "@/lib/banks";
import { withLocale } from "@/lib/i18n";
import { formatIsoYmdToEnDate } from "@/lib/seo";

export const metadata: Metadata = {
  title: "European banks comparison 2026",
  description:
    "Compare European banks and neobanks like Revolut, N26, Wise or bunq. Filter by IBAN, fees, requirements, multi-currency features and more.",
  alternates: {
    canonical: "https://finanzaseu.com/en/bancos",
    languages: {
      es: "https://finanzaseu.com/bancos",
      en: "https://finanzaseu.com/en/bancos",
    },
  },
  openGraph: {
    title: "European banks comparison 2026",
    description:
      "Find the bank that fits your profile: traveler, freelancer, business or expat.",
    url: "https://finanzaseu.com/en/bancos",
    type: "website",
    siteName: "FinanzasEU",
    locale: "en_US",
  },
};

export default function BancosPageEn() {
  const locale = "en" as const;
  const publishedBanks = banks.filter((b) => b._status !== "draft");

  const latestBankUpdate = banks
    .map((b) => b._lastUpdated)
    .filter(Boolean)
    .sort()
    .at(-1);

  const lastUpdatedLabel = formatIsoYmdToEnDate(latestBankUpdate);

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
            2026 ranking · Recommended banks in Europe
          </p>

          {lastUpdatedLabel ? (
            <p className="text-xs text-muted-foreground">
              Last update:{" "}
              <strong className="font-semibold text-foreground">
                {lastUpdatedLabel}
              </strong>{" "}
              ·{" "}
              <Link
                href={withLocale("/aviso-afiliados", locale)}
                className="underline underline-offset-4"
              >
                Disclosure (affiliate links)
              </Link>
            </p>
          ) : null}

          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Choose your bank in Europe with{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              clear data
            </span>
            .
          </h1>

          <p className="mx-auto max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            An editorial selection of digital and traditional banks that let you
            open an account online — many suitable for{" "}
            <strong className="font-semibold text-foreground">
              non-residents, digital nomads and freelancers
            </strong>
            . Click a bank to see details, requirements and steps to open the
            account.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-4">
          <Metric
            label="Published banks"
            value={totalBanks.toString()}
            description="Reviewed and complete profiles."
          />
          <Metric
            label="No monthly fee"
            value={freeAccounts.toString()}
            description="Plans with 0 €/month or free."
            tone="success"
          />
          <Metric
            label="Multi-currency"
            value={multiCurrency.toString()}
            description="Great for travel or being paid in other currencies."
          />
          <Metric
            label="Spanish support"
            value={spanishSupport.toString()}
            description="App or customer support in Spanish."
          />
        </section>

        <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedBanks.map((bank) => (
            <BankCard key={bank.slug} bank={bank} locale={locale} />
          ))}
        </section>

        <p className="mx-auto max-w-3xl text-center text-xs text-muted-foreground md:text-sm">
          Fees, requirements and supported countries can change. Always check
          the official website before opening an account. Some links may be
          affiliate links; this doesn’t affect the analysis.
        </p>
      </Container>
    </section>
  );
}

function BankCard({ bank, locale }: { bank: Bank; locale: "en" }) {
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

  const detailUrl = withLocale(`/programas/${slug}`, locale);

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
                In review
              </span>
            ) : null}
            {affiliateUrl ? (
              <span className="inline-flex items-center rounded-full border-2 border-secondary bg-accent px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                Recommended
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
          label="Monthly fee"
          value={fees.monthly}
          highlight={isFree ? "success" : undefined}
        />
        <InfoRow
          label="Card type"
          value={cardType || "—"}
          icon={<CreditCard className="h-3.5 w-3.5" />}
        />
        <InfoRow
          label="Spanish support / app"
          value={hasSpanish ? "Yes" : "No"}
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
          <Link href={detailUrl}>See details and how to open →</Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-secondary-foreground/75">
          <span className="inline-flex items-center gap-1">
            <Globe2 className="h-3.5 w-3.5" />
            100% online onboarding
          </span>
          <span className="inline-flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5" />
            Protection (varies by entity)
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
              Go directly to {name}
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
    neobanco: "Neobank",
    tradicional: "Traditional bank",
    "cuenta-multidivisa": "Multi-currency account",
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
    "sin-comisiones": "No fees",
    "tarjeta-fisica": "Physical card",
    "tarjeta-virtual": "Virtual card",
    multidivisa: "Multi-currency",
    crypto: "Crypto",
    "para-freelancers": "For freelancers",
    "para-empresa": "For businesses",
    "no-residentes": "Non-residents",
    espanol: "Spanish support",
    "iban-es": "IBAN ES",
    "iban-nl": "IBAN NL",
    "iban-de": "IBAN DE",
    "iban-lt": "IBAN LT",
    "iban-be": "IBAN BE",
    "seguro-depositos": "Deposit protection",
    "soporte-24-7": "24/7 support",
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
