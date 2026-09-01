import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, X, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

import Container from "@/components/layout/Container";
import LocalizedLink from "@/components/i18n/LocalizedLink";
import { Button } from "@/components/ui/button";
import { banks, Bank } from "@/lib/banks";
import { SITE_URL, toJsonLd } from "@/lib/seo";

interface PageProps {
  params: Promise<{ slug: string }>;
}

function parseComparisonSlug(slug: string): [string, string] | null {
  const parts = slug.toLowerCase().split("-vs-");
  if (parts.length !== 2 || !parts[0] || !parts[1]) return null;
  return [parts[0], parts[1]];
}

export async function generateStaticParams() {
  const activeBanks = banks.filter((b) => b._status !== "draft");
  const params: { slug: string }[] = [];

  for (let i = 0; i < activeBanks.length; i++) {
    for (let j = i + 1; j < activeBanks.length; j++) {
      params.push({ slug: `${activeBanks[i].slug}-vs-${activeBanks[j].slug}` });
      params.push({ slug: `${activeBanks[j].slug}-vs-${activeBanks[i].slug}` });
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) return {};

  const [b1Slug, b2Slug] = parsed;
  const b1 = banks.find((b) => b.slug === b1Slug);
  const b2 = banks.find((b) => b.slug === b2Slug);

  if (!b1 || !b2) return {};

  const title = `${b1.name} vs ${b2.name} (2026): Which is better? Full Review & Comparison`;
  const description = `Direct comparison between ${b1.name} and ${b2.name}. We analyze fees, IBAN prefix (${b1.ibanPrefix} vs ${b2.ibanPrefix}), cards and which one fits your profile best.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/en/comparar/${slug}`,
      languages: {
        es: `/comparar/${slug}`,
        en: `/en/comparar/${slug}`,
      },
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/en/comparar/${slug}`,
    },
  };
}

function translateCountry(country: string): string {
  const map: Record<string, string> = {
    "Bélgica": "Belgium",
    "Francia": "France",
    "Alemania": "Germany",
    "España": "Spain",
    "Reino Unido": "United Kingdom",
    "Chipre": "Cyprus",
    "Suecia": "Sweden",
    "Países Bajos": "Netherlands",
    "Finlandia": "Finland",
    "Suiza": "Switzerland",
    "Portugal": "Portugal",
    "Dinamarca": "Denmark",
  };
  return map[country] ?? country;
}

function translateFee(fee: string): string {
  return fee
    .replace(/gratis/gi, "Free")
    .replace(/0\s*€/g, "Free (€0)")
    .replace(/Desde 0\s*€/gi, "From €0")
    .replace(/según condiciones/gi, "depending on plan")
    .replace(/según red\/condiciones/gi, "Varies by network");
}

function translateTagline(bank: Bank): string {
  const map: Record<string, string> = {
    revolut: "Leading multi-currency account with LT IBAN and top-rated app",
    n26: "German neobank with DE IBAN, zero monthly fees & smart sub-accounts",
    wise: "Low-cost international transfer account with mid-market FX rates & BE IBAN",
    "trade-republic": "3.75% APY high-yield savings account & commission-free trading",
    myinvestor: "Spanish investment neobank with high-yield savings & ES IBAN",
    bunq: "Sustainable Dutch neobank with multiple European IBANs",
    openbank: "Digital bank backed by Santander with ES IBAN & zero fees",
    bbva: "Online account backed by BBVA with zero commissions & ES IBAN",
    santander: "Online digital checking account from Banco Santander",
    qonto: "Business & freelancer banking with expense management tools",
    "trading-212": "High-yield cash interest account (up to 5.1% APY) & free stock investing",
    freedom24: "NASDAQ-listed European broker with daily interest D Account",
    plum: "Smart automated savings app, interest pockets & debit card",
    klarna: "Flexible savings account & smart shopping card from Sweden",
    sumup: "Business checking account with free card & POS card reader",
  };
  return map[bank.slug] ?? bank.tagline;
}

function translateDeposit(guarantee: string): string {
  if (/100\.000/i.test(guarantee)) return "Protected up to €100,000 (DGS)";
  return "EU Regulated Protection";
}

export default async function EnglishComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const parsed = parseComparisonSlug(slug);
  if (!parsed) notFound();

  const [b1Slug, b2Slug] = parsed;
  const b1 = banks.find((b) => b.slug === b1Slug);
  const b2 = banks.find((b) => b.slug === b2Slug);

  if (!b1 || !b2) notFound();

  const pageUrl = `${SITE_URL}/en/comparar/${slug}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Banks", item: `${SITE_URL}/en/bancos` },
      { "@type": "ListItem", position: 3, name: `${b1.name} vs ${b2.name}`, item: pageUrl },
    ],
  };

  return (
    <main className="py-12 md:py-20">
      <Container className="space-y-12">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
        />

        <header className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary">
            <ShieldCheck className="h-4 w-4" /> Head to Head Comparison (2026)
          </div>

          <h1 className="text-balance text-4xl font-black leading-tight tracking-tight md:text-6xl">
            {b1.name} <span className="text-primary">vs</span> {b2.name}
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Not sure which one to choose? We compare {b1.name} and {b2.name} side-by-side: monthly fees, IBAN types, cards, and which one fits your daily needs or travels best.
          </p>
        </header>

        {/* Side-by-side Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {[b1, b2].map((b) => (
            <div
              key={b.slug}
              className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft"
            >
              <div>
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2">
                    <Image src={b.logo} alt={b.name} fill className="object-contain p-2" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-accent">{b.name}</h2>
                    <p className="text-xs text-muted-foreground">{translateCountry(b.country)} • IBAN {b.ibanPrefix}</p>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/80">{translateTagline(b)}</p>

                <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-sm">
                  <span className="font-semibold text-muted-foreground">Monthly fee:</span>
                  <span className="font-bold text-primary">{translateFee(b.fees.monthly)}</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <Button asChild size="sm" className="flex-1 font-bold">
                  <LocalizedLink href={`/programas/${b.slug}`}>View full review</LocalizedLink>
                </Button>
                {b.affiliateUrl && (
                  <Button asChild size="sm" variant="outline" className="flex-1 font-bold">
                    <a href={b.affiliateUrl} target="_blank" rel="noreferrer noopener sponsored">
                      Official site <ExternalLink className="ml-1 h-3.5 w-3.5" />
                    </a>
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Comparison Table */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black tracking-tight md:text-3xl">Feature Comparison</h2>

          <div className="overflow-x-auto rounded-2xl border-2 border-border bg-card">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-border bg-muted/50 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="p-4">Feature</th>
                  <th className="p-4">{b1.name}</th>
                  <th className="p-4">{b2.name}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                <tr>
                  <td className="p-4 font-semibold">IBAN Type</td>
                  <td className="p-4">{b1.ibanPrefix} ({translateCountry(b1.ibanCountry)})</td>
                  <td className="p-4">{b2.ibanPrefix} ({translateCountry(b2.ibanCountry)})</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Monthly fee</td>
                  <td className="p-4 font-bold text-primary">{translateFee(b1.fees.monthly)}</td>
                  <td className="p-4 font-bold text-primary">{translateFee(b2.fees.monthly)}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Deposit Protection</td>
                  <td className="p-4">{translateDeposit(b1.compliance.depositGuarantee)}</td>
                  <td className="p-4">{translateDeposit(b2.compliance.depositGuarantee)}</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Spanish Support</td>
                  <td className="p-4">{b1.support.spanishSupport ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-rose-500" />}</td>
                  <td className="p-4">{b2.support.spanishSupport ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-rose-500" />}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Pros & Cons */}
        <section className="grid gap-8 md:grid-cols-2">
          <div className="space-y-4 rounded-2xl border-2 border-border p-6 bg-card">
            <h3 className="text-xl font-bold">{b1.name}: Highlights & Features</h3>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Key Advantages:</p>
              <ul className="space-y-1.5 text-sm">
                {b1.keyPros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-4 rounded-2xl border-2 border-border p-6 bg-card">
            <h3 className="text-xl font-bold">{b2.name}: Highlights & Features</h3>
            <div className="space-y-2">
              <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Key Advantages:</p>
              <ul className="space-y-1.5 text-sm">
                {b2.keyPros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final Verdict */}
        <section className="rounded-3xl border-2 border-accent bg-secondary p-8 text-secondary-foreground shadow-soft">
          <h2 className="text-2xl font-black tracking-tight text-accent">Final Verdict: Which one to choose?</h2>
          <p className="mt-3 text-base leading-relaxed text-secondary-foreground/80">
            If you need a flexible account for international transfers and daily usage, both <strong>{b1.name}</strong> and <strong>{b2.name}</strong> provide top-tier regulated European banking solutions. Review their specific IBAN origin and fee structure above to select the ideal partner.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Button asChild className="gap-2 font-bold">
              <a
                href={b1.affiliateUrl || b1.website}
                data-analytics="affiliate"
                data-affiliate-partner={b1.slug}
                target="_blank"
                rel="noreferrer noopener sponsored"
              >
                Open account at {b1.name} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="gap-2 font-bold">
              <a
                href={b2.affiliateUrl || b2.website}
                data-analytics="affiliate"
                data-affiliate-partner={b2.slug}
                target="_blank"
                rel="noreferrer noopener sponsored"
              >
                Open account at {b2.name} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </section>
      </Container>
    </main>
  );
}
