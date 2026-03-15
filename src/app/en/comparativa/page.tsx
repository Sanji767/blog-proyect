import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

import Container from "@/components/layout/Container";
import { withLocale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Bank comparison in Europe (2026) | FinanzasEU";
const DESCRIPTION =
  "Shortlist 1–3 banks with clear criteria: IBAN, fees, requirements and official sources. Updated in 2026.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/comparativa",
    languages: {
      es: "/comparativa",
      en: "/en/comparativa",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/comparativa`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function ComparativaPageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/comparativa`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Comparison", item: pageUrl },
    ],
  };

  const pageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl}#webpage`,
    url: pageUrl,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en-US",
  };

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(pageJsonLd) }}
      />

      <Container className="max-w-5xl space-y-12">
        <header className="space-y-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Comparison
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Choose a bank with{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              clear criteria
            </span>
            .
          </h1>
          <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Start from the ranking, shortlist options, and validate details on
            official sources before opening an account.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Shortlist</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Narrow it down to 1–3 banks based on your real use case (travel,
              salary, freelancer, business).
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Validate</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Check IBAN/SEPA, fees and requirements on the official website
              before opening an account.
            </p>
          </div>

          <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
              <ArrowRight className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-black tracking-tight">Act</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Open the account that fits you — and keep a backup option if you
              travel or work internationally.
            </p>
          </div>
        </section>

        <section className="rounded-2xl border-2 border-secondary bg-secondary p-8 text-center text-secondary-foreground shadow-offset-accent md:p-10">
          <h2 className="text-balance text-2xl font-black text-accent md:text-3xl">
            Ready to pick your 1–3 options?
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-sm text-secondary-foreground/80 md:text-base">
            Start with the ranking and use the IBAN Scanner to validate details.
          </p>

          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={withLocale("/bancos", locale)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary bg-accent px-7 py-3 text-sm font-black text-accent-foreground shadow-offset-accent"
            >
              See bank ranking <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={withLocale("/iban", locale)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-secondary-foreground/20 bg-secondary-foreground/5 px-7 py-3 text-sm font-black text-secondary-foreground"
            >
              Open IBAN Scanner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </Container>
    </section>
  );
}

