import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type React from "react";

import { banks, type Bank } from "@/lib/banks";
import Container from "@/components/layout/Container";
import { formatIsoYmdToEnDate, toJsonLd } from "@/lib/seo";

import {
  Globe2,
  ShieldCheck,
  CreditCard,
  ArrowRight,
  Info,
  CheckCircle2,
} from "lucide-react";

type Review = {
  author: string;
  text: string;
  rating: number;
  source?: string;
};

type FAQItem = {
  question: string;
  answer: string;
};

type HistoryItem = {
  year: number;
  event: string;
};

type ExpertOpinion = {
  summary?: string;
  recommendedFor?: string[];
  notFor?: string[];
};

type BankContent = Bank & {
  faq?: FAQItem[];
  reviews?: Review[];
  history?: HistoryItem[];
  openingSteps?: string[];
  expertOpinion?: ExpertOpinion;
};

export function generateStaticParams() {
  return banks.map((bank) => ({
    slug: bank.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const bank = banks.find((b) => b.slug === params.slug);

  if (!bank) {
    return {
      title: "Bank not found | FinanzasEU",
      description: "We couldn't find the requested bank profile.",
    };
  }

  const { name, tagline } = bank;
  const canonicalPath = `/en/programas/${bank.slug}`;

  return {
    title: `${name} Review – Fees, IBAN & How to Open an Account | FinanzasEU`,
    description: tagline,
    alternates: {
      canonical: canonicalPath,
      languages: {
        es: `/programas/${bank.slug}`,
        en: canonicalPath,
      },
    },
    openGraph: {
      title: `${name} Review – Fees, IBAN & Account Setup`,
      description: tagline,
    },
  };
}

export default function ProgramaPageEn({
  params,
}: {
  params: { slug: string };
}) {
  const bank = banks.find((b) => b.slug === params.slug);

  if (!bank) return notFound();

  const {
    name,
    tagline,
    description,
    logo,
    heroImage,
    country,
    ibanCountry,
    currencies,
    keyPros,
    keyCons,
    idealFor,
    requirements,
    affiliateUrl,
    website,
    tags,
    faq = [],
    fees,
    cardType,
    support,
    rating,
    compliance,
    appStoreUrl,
    googlePlayUrl,
    acceptedCountries,
    expertOpinion,
    openingSteps,
    history = [],
    reviews = [],
    _lastUpdated: lastUpdated,
    _status: status,
  } = bank as BankContent;

  const monthlyFee = fees.monthly;
  const atmWithdrawals = `${fees.atmEU} · Intl: ${fees.atmInternational}`;
  const languages = support?.languages ?? [];
  const channels = support?.channels ?? [];

  const primaryCtaUrl = affiliateUrl ?? website;
  const hasAffiliate = Boolean(affiliateUrl);

  const relatedBanks = banks
    .filter((b) => b.slug !== bank.slug && b.category === bank.category)
    .slice(0, 3);

  const lastUpdatedLabel = formatIsoYmdToEnDate(lastUpdated);
  const isFree = /gratis|0\s*(€|\$)/i.test(monthlyFee);

  const defaultOpeningSteps: string[] = [
    "Visit the official website or download the app.",
    "Register with your email address and phone number.",
    "Verify your identity by uploading a valid ID or passport.",
    "Confirm your residential address and personal details.",
    "Activate your account and request your debit card.",
  ];

  const stepsToShow = openingSteps && openingSteps.length > 0 ? openingSteps : defaultOpeningSteps;
  const siteUrl = "https://finanzaseu.com";

  const financialProductJsonLd = {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name,
    description: tagline,
    brand: {
      "@type": "Brand",
      name,
    },
    offers: {
      "@type": "Offer",
      price: isFree ? "0.00" : "0",
      priceCurrency: "EUR",
    },
    aggregateRating: rating?.trustpilot
      ? {
          "@type": "AggregateRating",
          ratingValue: rating.trustpilot.toFixed(1),
          bestRating: "5",
          ratingCount: rating.totalReviews || 2500,
        }
      : undefined,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${siteUrl}/en`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Banks",
        item: `${siteUrl}/en/bancos`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name,
        item: `${siteUrl}/en/programas/${params.slug}`,
      },
    ],
  };

  return (
    <section className="py-10 md:py-14">
      <Container className="space-y-10">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(financialProductJsonLd) }}
        />

        {/* BREADCRUMB */}
        <nav aria-label="Breadcrumb navigation" className="text-xs text-muted-foreground">
          <div className="mb-2 flex flex-wrap items-center gap-1">
            <Link href="/en/bancos" className="hover:text-primary hover:underline">
              Banks
            </Link>
            <span>/</span>
            <span className="text-foreground">{name}</span>
          </div>
        </nav>

        {/* HERO */}
        <header className="grid items-start gap-8 md:grid-cols-[minmax(0,2fr)_minmax(0,1.3fr)]">
          <div className="space-y-6">
            <div className="inline-flex flex-wrap items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary">
              <span>Reviewed by FinanzasEU Editorial Team</span>
              {hasAffiliate && (
                <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] text-primary-foreground">
                  Recommended partner
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative h-10 w-10 md:h-12 md:w-12">
                <Image src={logo} alt={name} fill className="object-contain" sizes="48px" />
              </div>
              <div>
                <h1 className="text-3xl font-bold md:text-4xl">{name}</h1>
                <p className="text-xs text-muted-foreground">
                  {country}
                  {ibanCountry ? ` · IBAN ${ibanCountry}` : ""}
                </p>
              </div>
            </div>

            <p className="text-base text-muted-foreground md:text-lg">{tagline}</p>
            <p className="max-w-2xl text-sm text-muted-foreground md:text-base">{description}</p>

            <div className="flex flex-wrap gap-2 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground"
                >
                  {formatTagEn(tag)}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-4">
              <a
                href={primaryCtaUrl}
                data-analytics="affiliate"
                data-affiliate-partner={params.slug}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-md transition hover:brightness-105"
              >
                Open account with {name}
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href={website}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center justify-center rounded-full border border-border px-5 py-2 text-sm font-medium hover:bg-background/60"
              >
                Official website
              </a>
            </div>
          </div>

          {/* ASIDE SUMMARY */}
          <aside className="rounded-3xl border border-border bg-hero-background/70 p-5 shadow-md">
            {heroImage ? (
              <div className="relative mb-4 h-40 w-full overflow-hidden rounded-2xl">
                <Image src={heroImage} alt={name} fill className="object-cover" />
              </div>
            ) : (
              <div className="mb-4 h-40 rounded-2xl border-2 border-border bg-muted/40" />
            )}

            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">At a glance</h2>
            <dl className="grid grid-cols-1 gap-3 text-sm">
              <InfoRow label="Monthly Fee" value={monthlyFee} />
              <InfoRow label="Card Type" value={cardType} />
              <InfoRow label="ATM Limits" value={atmWithdrawals} />
              <InfoRow label="Country / IBAN" value={`${country}${ibanCountry ? ` · IBAN ${ibanCountry}` : ""}`} />
              {rating?.trustpilot && (
                <InfoRow
                  label="Trustpilot Score"
                  value={`${rating.trustpilot.toFixed(1)} / 5 (${rating.totalReviews?.toLocaleString()} reviews)`}
                />
              )}
            </dl>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Globe2 className="h-3 w-3" /> 100% Online onboarding
              </span>
              <span className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Regulated in EU
              </span>
            </div>
          </aside>
        </header>

        {/* PROS & CONS */}
        <section className="grid items-start gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm space-y-3">
            <h2 className="text-xl font-semibold">Key Highlights of {name}</h2>
            <ul className="space-y-2 text-sm">
              {keyPros.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5 shadow-sm space-y-3">
            <h2 className="text-xl font-semibold">Things to Consider</h2>
            <ul className="space-y-2 text-sm">
              {keyCons.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-destructive font-bold">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* STEP-BY-STEP */}
        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">How to Open an Account in {name}</h2>
          <ol className="space-y-3 text-sm">
            {stepsToShow.map((step, index) => (
              <li key={step} className="flex gap-3 rounded-2xl bg-muted/40 p-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">
                  {index + 1}
                </span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* FEES TABLE */}
        <section className="rounded-3xl border border-border bg-background p-6 shadow-sm">
          <h2 className="mb-3 text-xl font-semibold">Fee Breakdown</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase text-muted-foreground">
                  <th className="py-2 pr-4">Feature</th>
                  <th className="py-2">Fee / Details</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-muted/40">
                  <td className="py-2 pr-4">Monthly Fee</td>
                  <td className="py-2">{fees.monthly}</td>
                </tr>
                <tr className="border-b border-muted/40">
                  <td className="py-2 pr-4">ATM Withdrawals (EU)</td>
                  <td className="py-2">{fees.atmEU}</td>
                </tr>
                <tr className="border-b border-muted/40">
                  <td className="py-2 pr-4">International ATM</td>
                  <td className="py-2">{fees.atmInternational}</td>
                </tr>
                {fees.fxRate && (
                  <tr className="border-b border-muted/40">
                    <td className="py-2 pr-4">FX Exchange Fee</td>
                    <td className="py-2">{fees.fxRate}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </Container>
    </section>
  );
}

function InfoRow({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <dt className="text-[11px] uppercase tracking-wide text-muted-foreground">{label}</dt>
      <dd className="text-sm font-medium">{value ?? "N/A"}</dd>
    </div>
  );
}

function formatTagEn(tag: string): string {
  const map: Record<string, string> = {
    "sin-comisiones": "Zero Monthly Fees",
    "tarjeta-fisica": "Physical Card",
    "tarjeta-virtual": "Virtual Card",
    multidivisa: "Multi-Currency Account",
    crypto: "Crypto Trading",
    "para-freelancers": "Freelancers & Sole Traders",
    "para-empresa": "Business Accounts",
    "no-residentes": "Non-Resident Friendly",
    espanol: "Multilingual Support",
    "iban-es": "Spanish IBAN",
    "iban-nl": "Dutch IBAN",
    "iban-de": "German IBAN",
    "iban-lt": "Lithuanian IBAN",
    "seguro-depositos": "Deposit Protection Guarantee",
  };
  return map[tag] ?? tag;
}
