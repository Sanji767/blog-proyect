import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import CompoundInterestCalculator from "@/components/tools/CompoundInterestCalculator";
import { withLocale } from "@/lib/i18n";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Compound interest calculator (with contributions) | FinanzasEU";
const DESCRIPTION =
  "Calculate compound interest with monthly contributions and inflation adjustment. Includes yearly projection, table and a share link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/herramientas/interes-compuesto",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/herramientas/interes-compuesto`,
    type: "website",
    locale: "en_US",
  },
};

export default function InteresCompuestoPageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/herramientas/interes-compuesto`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/en/herramientas` },
      { "@type": "ListItem", position: 3, name: "Compound interest", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Compound interest calculator",
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
        name: "What return should I use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use a conservative, long-term estimate. This tool is educational: it does not guarantee results and it doesn’t replace financial advice.",
        },
      },
      {
        "@type": "Question",
        name: "Does it include monthly contributions?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Yes. You can set a monthly contribution and choose whether it’s added at the start or end of each month.",
        },
      },
      {
        "@type": "Question",
        name: "What does “real result” mean?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It’s the balance adjusted for inflation to estimate real purchasing power. With the same nominal amount, inflation reduces what you can buy over time.",
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
              Compound interest
            </span>{" "}
            calculator.
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Projection with monthly contributions and inflation adjustment. Ideal
            for planning long-term saving/investing with clarity.
          </p>

          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/herramientas", label: "Tools" },
              { href: "/comparativa", label: "Comparison" },
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

        <CompoundInterestCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Important notes</h2>
          <ul>
            <li>
              This calculator is educational: it doesn’t predict markets and it
              doesn’t guarantee results.
            </li>
            <li>
              If your goal is choosing a bank or account, also use the{" "}
              <a href={withLocale("/comparativa", locale)}>bank comparison</a>.
            </li>
          </ul>
        </section>
      </Container>
    </section>
  );
}

