import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import SavingsGoalCalculator from "@/components/tools/SavingsGoalCalculator";
import { withLocale } from "@/lib/i18n";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Savings goal calculator (monthly contribution) | FinanzasEU";
const DESCRIPTION =
  "Calculate how much to contribute each month to reach a target in X years with an expected return. Includes yearly table and a share link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/en/herramientas/objetivo-ahorro" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/herramientas/objetivo-ahorro`,
    type: "website",
    locale: "en_US",
  },
};

export default function ObjetivoAhorroPageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/herramientas/objetivo-ahorro`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/en/herramientas` },
      { "@type": "ListItem", position: 3, name: "Savings goal", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Savings goal calculator",
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
        name: "What return should I use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use a conservative estimate. This calculator helps plan scenarios; it doesn’t guarantee results and it doesn’t replace advice.",
        },
      },
      {
        "@type": "Question",
        name: "Why does it change if I contribute at the start or end of the month?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Contributing earlier gives the money more time to compound. The difference is usually small, but it exists.",
        },
      },
      {
        "@type": "Question",
        name: "Does it include fees or taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. This is a simple projection. Real products may include fees, taxation and limits.",
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
            Savings{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              goal
            </span>
            .
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            How much to contribute each month to reach a target in a given time
            horizon. Simple projection with yearly table and a share link.
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

        <SavingsGoalCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Important notes</h2>
          <ul>
            <li>Educational projection: not financial advice.</li>
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

