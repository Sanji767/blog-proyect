// src/app/en/comparar/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Check, X, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

import LocalizedLink from "@/components/i18n/LocalizedLink";
import { Button } from "@/components/ui/button";
import { banks } from "@/lib/banks";
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
    <>
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
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {[b1, b2].map((b) => (
          <div
            key={b.slug}
            className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft"
          >
            <div className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-xl border-2 border-secondary-foreground/12 bg-secondary-foreground/5 p-2">
                <Image src={b.logo} alt={b.name} fill className="object-contain p-2" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-accent">{b.name}</h2>
                <p className="text-xs text-muted-foreground">{b.country} • IBAN {b.ibanPrefix}</p>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-secondary-foreground/80">{b.tagline}</p>

            <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4 text-sm">
              <span className="font-semibold text-muted-foreground">Monthly fee:</span>
              <span className="font-bold text-primary">{b.fees.monthly}</span>
            </div>

            <div className="mt-6 flex gap-3">
              <Button asChild size="sm" className="flex-1">
                <LocalizedLink href={`/programas/${b.slug}`}>View full review</LocalizedLink>
              </Button>
              {b.affiliateUrl && (
                <Button asChild size="sm" variant="outline" className="flex-1">
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
      <section className="mt-14 space-y-6">
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
                <td className="p-4">{b1.ibanPrefix} ({b1.ibanCountry})</td>
                <td className="p-4">{b2.ibanPrefix} ({b2.ibanCountry})</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Monthly fee</td>
                <td className="p-4 font-bold text-primary">{b1.fees.monthly}</td>
                <td className="p-4 font-bold text-primary">{b2.fees.monthly}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Deposit Protection</td>
                <td className="p-4">{b1.compliance.depositGuarantee}</td>
                <td className="p-4">{b2.compliance.depositGuarantee}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Spanish Support</td>
                <td className="p-4">{b1.support.spanishSupport ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-rose-500" />}</td>
                <td className="p-4">{b2.support.spanishSupport ? <Check className="h-5 w-5 text-emerald-500" /> : <X className="h-5 w-5 text-rose-500" />}</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold">Ideal for</td>
                <td className="p-4">{b1.idealFor}</td>
                <td className="p-4">{b2.idealFor}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Pros & Cons */}
      <section className="mt-14 grid gap-8 md:grid-cols-2">
        <div className="space-y-4 rounded-2xl border-2 border-border p-6 bg-card">
          <h3 className="text-xl font-bold">{b1.name}: Pros & Cons</h3>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Pros:</p>
            <ul className="space-y-1.5 text-sm">
              {b1.keyPros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          {b1.keyCons.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Cons:</p>
              <ul className="space-y-1.5 text-sm">
                {b1.keyCons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="space-y-4 rounded-2xl border-2 border-border p-6 bg-card">
          <h3 className="text-xl font-bold">{b2.name}: Pros & Cons</h3>
          <div className="space-y-2">
            <p className="text-xs font-bold uppercase tracking-wider text-emerald-500">Pros:</p>
            <ul className="space-y-1.5 text-sm">
              {b2.keyPros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="h-4 w-4 shrink-0 text-emerald-500 mt-0.5" />
                  <span>{pro}</span>
                </li>
              ))}
            </ul>
          </div>
          {b2.keyCons.length > 0 && (
            <div className="space-y-2 pt-3 border-t border-border/40">
              <p className="text-xs font-bold uppercase tracking-wider text-rose-500">Cons:</p>
              <ul className="space-y-1.5 text-sm">
                {b2.keyCons.map((con, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <X className="h-4 w-4 shrink-0 text-rose-500 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Final Verdict */}
      <section className="mt-14 rounded-2xl border-2 border-primary bg-primary/5 p-8 text-foreground">
        <h2 className="text-2xl font-black tracking-tight">Final Verdict: Which one to choose?</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          If you are looking for <strong>{b1.idealFor}</strong>, the best choice is <strong>{b1.name}</strong>. On the other hand, if you prioritize <strong>{b2.idealFor}</strong>, we recommend opting for <strong>{b2.name}</strong>. Both are fully regulated and safe banking choices in Europe.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          {b1.affiliateUrl && (
            <Button asChild className="gap-2">
              <a href={b1.affiliateUrl} target="_blank" rel="noreferrer noopener sponsored">
                Open account at {b1.name} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          )}
          {b2.affiliateUrl && (
            <Button asChild variant="outline" className="gap-2">
              <a href={b2.affiliateUrl} target="_blank" rel="noreferrer noopener sponsored">
                Open account at {b2.name} <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          )}
        </div>
      </section>
    </>
  );
}
