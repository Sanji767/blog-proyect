import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import FourPercentRuleCalculator from "@/components/tools/FourPercentRuleCalculator";
import { withLocale } from "@/lib/i18n";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "4% rule calculator (FIRE) | FinanzasEU";
const DESCRIPTION =
  "Estimate the target portfolio needed to sustain an annual spend based on the 4% rule (safe withdrawal rate). Includes a share link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/en/herramientas/regla-4" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/herramientas/regla-4`,
    type: "website",
    locale: "en_US",
  },
};

export default function Regla4PageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/herramientas/regla-4`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/en/herramientas` },
      { "@type": "ListItem", position: 3, name: "4% rule", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "4% rule calculator",
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
        name: "What is the 4% rule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It’s a rule of thumb that estimates how much capital you might need to withdraw around 4% per year to fund expenses, based on historical studies. It doesn’t guarantee results.",
        },
      },
      {
        "@type": "Question",
        name: "Can I use 3% or 3.5% instead of 4%?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. A lower withdrawal rate is usually more conservative (requires more capital). Adjust based on your risk tolerance and horizon.",
        },
      },
      {
        "@type": "Question",
        name: "Does it include taxes or inflation?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. It’s a simple estimate. For more complete planning, combine it with the compound interest and inflation calculators.",
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
              4%
            </span>{" "}
            rule.
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Estimate the target portfolio to sustain an annual spend with a
            withdrawal rate. Useful for FIRE-style estimates — with caution.
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

        <FourPercentRuleCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Important notes</h2>
          <ul>
            <li>Rule of thumb based on historical data.</li>
            <li>
              For projections, combine with{" "}
              <a href={withLocale("/herramientas/interes-compuesto", locale)}>
                compound interest
              </a>{" "}
              and{" "}
              <a href={withLocale("/herramientas/inflacion", locale)}>inflation</a>.
            </li>
          </ul>
        </section>
      </Container>
    </section>
  );
}

