import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, FileText, ShieldCheck, Users } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { withLocale } from "@/lib/i18n";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About FinanzasEU (who we are and methodology)",
  description:
    "Learn who is behind FinanzasEU, how we analyze banks and accounts in Europe, and how we keep transparency (affiliate links, official sources and updates).",
  alternates: {
    canonical: "/en/sobre",
  },
  openGraph: {
    title: "About FinanzasEU",
    description:
      "Methodology, transparency and how we analyze banks and accounts in Europe.",
    url: `${SITE_URL}/en/sobre`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function SobrePageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/sobre`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "About", item: pageUrl },
    ],
  };

  const aboutPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${pageUrl}#about`,
    url: pageUrl,
    name: "About FinanzasEU",
    inLanguage: "en-US",
    about: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: SITE_LOGO_URL,
    },
  };

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(aboutPageJsonLd) }}
      />

      <Container className="max-w-5xl space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            About
          </p>
          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Who{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              we are
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            FinanzasEU is an independent guide to choose a bank in Europe with
            clear criteria: IBAN, fees, requirements and official sources.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Editorial project</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We publish guides and comparisons focused on real decisions
              (travel, remote work, salary accounts, freelancers, businesses).
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Clear criteria</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              We explain pros/cons, who it’s for and who it’s not for — avoiding
              empty marketing.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Transparency</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              If there are affiliate links, we disclose it and it doesn’t affect
              the analysis. We prioritize official sources and updates.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border-2 border-border bg-card p-8 shadow-soft md:p-10">
          <h2 className="text-2xl font-black tracking-tight">Methodology (summary)</h2>
          <ul className="mt-5 grid gap-3 text-sm text-muted-foreground md:grid-cols-2">
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                1
              </span>
              Real costs: fees, cash withdrawals, FX rates and conditions.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                2
              </span>
              IBAN / SEPA and day-to-day usage: payments, salary, direct debits.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                3
              </span>
              Requirements: documentation, residency, supported countries.
            </li>
            <li className="flex gap-3">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center border-2 border-border bg-muted text-xs font-black text-foreground">
                4
              </span>
              Safety and support: licensing/regulation and language support when relevant.
            </li>
          </ul>
          <p className="mt-6 text-xs text-muted-foreground">
            Note: information can change. Always verify on the official website
            before opening an account.
          </p>
        </section>

        <section className="flex flex-col items-center gap-3 text-center">
          <Button asChild variant="outline" className="gap-2">
            <Link href={withLocale("/aviso-afiliados", locale)}>
              <FileText className="h-4 w-4" />
              Affiliate disclosure
            </Link>
          </Button>

          <Button asChild size="lg" className="gap-2">
            <Link href={withLocale("/contacto", locale)}>
              Contact
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </section>
      </Container>
    </section>
  );
}

