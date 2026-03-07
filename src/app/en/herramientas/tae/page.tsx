import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import TaeCalculator from "@/components/tools/TaeCalculator";
import { withLocale } from "@/lib/i18n";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "APR/APY calculator (from nominal rate) | FinanzasEU";
const DESCRIPTION =
  "Convert a nominal rate to an effective annual rate depending on compounding (monthly, quarterly, yearly) and estimate annual interest. Includes optional fixed fee and a share link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/en/herramientas/tae" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/herramientas/tae`,
    type: "website",
    locale: "en_US",
  },
};

export default function TaePageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/herramientas/tae`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/en/herramientas` },
      { "@type": "ListItem", position: 3, name: "APR/APY", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "APR/APY calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    url: pageUrl,
    description: DESCRIPTION,
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
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
        name: "What’s the difference between nominal rate and effective annual rate?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The nominal rate is the stated interest rate. The effective annual rate accounts for compounding frequency (and, in some cases, fees).",
        },
      },
      {
        "@type": "Question",
        name: "Why does it change with monthly vs yearly compounding?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The more frequently interest compounds, the higher the effective rate tends to be, because interest earns interest more times per year.",
        },
      },
      {
        "@type": "Question",
        name: "Does this include taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This is an educational estimate. Tax treatment depends on the country and the product.",
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
              APR/APY
            </span>{" "}
            calculator.
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Convert nominal rate to effective annual rate and estimate yearly
            interest (with optional fixed fee).
          </p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/herramientas", label: "Tools" },
              { href: "/bancos", label: "Banks" },
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

        <TaeCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Important notes</h2>
          <ul>
            <li>
              Real accounts can include tiers, limits and additional conditions.
            </li>
            <li>Use the effective rate as a comparison reference, not a promise.</li>
          </ul>
        </section>
      </Container>
    </section>
  );
}

