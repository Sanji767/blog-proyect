import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import InflationCalculator from "@/components/tools/InflationCalculator";
import { withLocale } from "@/lib/i18n";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Inflation & purchasing power calculator | FinanzasEU";
const DESCRIPTION =
  "Estimate compounded inflation and purchasing power: how much you’ll need in the future to keep the same value, and how much your money loses today if it doesn’t grow.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/herramientas/inflacion",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/herramientas/inflacion`,
    type: "website",
    locale: "en_US",
  },
};

export default function InflacionPageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/herramientas/inflacion`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/en/herramientas` },
      { "@type": "ListItem", position: 3, name: "Inflation", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Inflation calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: pageUrl,
    description: DESCRIPTION,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en-US",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is compounded inflation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Inflation accumulates year after year. A 3% annual rate doesn’t add linearly — it compounds, and the effect grows over time.",
        },
      },
      {
        "@type": "Question",
        name: "Why does my money lose value if it doesn’t grow?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Because prices tend to go up. If your balance stays the same, you can buy fewer things as years pass.",
        },
      },
      {
        "@type": "Question",
        name: "Does this include taxes or investment returns?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This tool only estimates the inflation effect. For projections with returns, use the compound interest calculator.",
        },
      },
    ],
  };

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(appJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }}
      />

      <Container className="space-y-14">
        <header className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            <Link
              href={withLocale("/herramientas", locale)}
              className="underline-offset-4 hover:underline"
            >
              Tools
            </Link>{" "}
            <span className="text-muted-foreground/70">/</span> Calculator
          </p>

          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              Inflation
            </span>{" "}
            calculator.
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Understand how much you’ll need in the future to keep the same
            purchasing power — and how much your money loses if it doesn’t grow.
          </p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/herramientas", label: "Tools" },
              { href: "/herramientas/interes-compuesto", label: "Compound interest" },
            ].map((item, idx, arr) => (
              <span key={item.href} className="inline-flex items-center gap-x-4">
                <Link
                  href={withLocale(item.href, locale)}
                  className="text-foreground/90 underline-offset-4 transition-colors hover:text-foreground hover:underline"
                >
                  {item.label}
                </Link>
                {idx < arr.length - 1 ? (
                  <span className="text-muted-foreground/70">/</span>
                ) : null}
              </span>
            ))}
          </nav>
        </header>

        <InflationCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Recommended next</h2>
          <p>
            If you want projections with returns and contributions, use the{" "}
            <a href={withLocale("/herramientas/interes-compuesto", locale)}>
              compound interest calculator
            </a>
            .
          </p>
        </section>
      </Container>
    </section>
  );
}

