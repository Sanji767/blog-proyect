import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import MortgageCalculator from "@/components/tools/MortgageCalculator";
import { withLocale } from "@/lib/i18n";
import { SITE_LOGO_URL, SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Mortgage calculator (Euribor + spread) | FinanzasEU";
const DESCRIPTION =
  "Work out your monthly mortgage payment with a variable rate (12-month Euribor + spread) or a fixed rate, and simulate how it changes at your next reset.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/en/herramientas/hipoteca" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/herramientas/hipoteca`,
    type: "website",
    locale: "en_US",
  },
};

export default function HipotecaPageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/herramientas/hipoteca`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Tools", item: `${SITE_URL}/en/herramientas` },
      { "@type": "ListItem", position: 3, name: "Mortgage", item: pageUrl },
    ],
  };

  const appJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${pageUrl}#app`,
    name: "Mortgage calculator",
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
        name: "How is a variable mortgage payment calculated?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "With the French amortization system: the monthly payment depends on the outstanding capital, the remaining term and the interest rate (12-month Euribor plus your contract spread). The payment stays constant between resets and is recalculated at each annual reset.",
        },
      },
      {
        "@type": "Question",
        name: "What happens to my payment at the mortgage reset?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "At the annual reset, the bank applies the current Euribor plus your spread and recalculates the payment with the remaining capital and term. If Euribor rises, the payment rises; if it falls, the payment falls. This calculator simulates that change.",
        },
      },
      {
        "@type": "Question",
        name: "Fixed or variable mortgage?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A fixed rate gives a stable payment for the life of the loan; a variable rate usually starts cheaper but its payment changes at each reset with Euribor. The best choice depends on your risk tolerance and the rate outlook.",
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
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-text">
            <Link
              href={withLocale("/herramientas", locale)}
              className="underline-offset-4 hover:underline"
            >
              Tools
            </Link>{" "}
            <span className="text-muted-foreground/70">/</span> Calculator
          </p>

          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            <span className="inline-block bg-accent px-3 py-2 text-accent-foreground">
              Mortgage
            </span>{" "}
            calculator.
          </h1>

          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Work out your monthly payment with a variable rate (Euribor + spread) or a fixed
            rate, and simulate how it changes at your next reset.
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

        <MortgageCalculator />

        <section className="prose prose-lg max-w-none">
          <h2>Important notes</h2>
          <ul>
            <li>
              The calculation uses the French amortization system and ignores fees, insurance,
              taxes and floor clauses.
            </li>
            <li>
              The default Euribor (3.29%) is the November 2026 monthly average. Enter the
              current value for an accurate estimate.
            </li>
          </ul>
        </section>
      </Container>
    </section>
  );
}
