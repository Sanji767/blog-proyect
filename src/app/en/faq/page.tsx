import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import { withLocale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = `FAQ | ${SITE_NAME}`;
const DESCRIPTION =
  "Clear answers about European banks, IBAN/SEPA, fees, safety and opening accounts.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/faq",
    languages: {
      es: "/faq",
      en: "/en/faq",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/faq`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

const FAQ = [
  {
    q: "What is FinanzasEU?",
    a: "FinanzasEU is an independent editorial project focused on helping you choose a bank in Europe with clear criteria: IBAN/SEPA, fees, requirements and official sources.",
  },
  {
    q: "Do you offer financial advice?",
    a: "No. The content is informational and educational. Always verify official terms and consider professional advice when needed.",
  },
  {
    q: "Can conditions change over time?",
    a: "Yes. Fees, requirements, supported countries and features can change. We try to keep pages updated, but always confirm on the official website before opening an account.",
  },
  {
    q: "What does it mean for an IBAN to be SEPA?",
    a: "It means the account belongs to the SEPA area and can be used for SEPA transfers/direct debits, as long as the bank supports the service and your account is active.",
  },
  {
    q: "Do affiliate links affect the ranking?",
    a: "No. If a link is an affiliate link, we disclose it, and it doesn’t change the analysis. It helps fund the project at no extra cost to you.",
  },
  {
    q: "How do I know which bank fits me?",
    a: "Start with the bank ranking, shortlist 1–3 options based on your case (travel, salary, freelancer, business), and then validate details on the official site before opening an account.",
  },
];

export default function FaqPageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/faq`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "FAQ", item: pageUrl },
    ],
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "en-US",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(faqJsonLd) }}
      />

      <Container className="max-w-5xl space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            FAQ
          </p>
          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Frequently asked{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              questions
            </span>
          </h1>
          <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Short, practical answers — focused on real decisions.
          </p>
        </header>

        <div className="space-y-4">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft"
            >
              <summary className="cursor-pointer text-base font-black text-foreground">
                {item.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        <div className="rounded-2xl border-2 border-secondary bg-secondary p-8 text-center text-secondary-foreground shadow-offset-accent">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Next step
          </p>
          <h2 className="mt-4 text-balance text-2xl font-black text-accent md:text-3xl">
            Pick 1–3 banks that fit your case
          </h2>
          <p className="mt-3 mx-auto max-w-2xl text-sm text-secondary-foreground/80 md:text-base">
            Use the ranking to shortlist options, then validate the details on
            official sources.
          </p>

          <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={withLocale("/bancos", locale)}
              className="inline-flex items-center justify-center rounded-xl border-2 border-secondary bg-accent px-6 py-3 text-sm font-black text-accent-foreground shadow-offset-accent"
            >
              See bank ranking →
            </Link>
            <Link
              href={withLocale("/contacto", locale)}
              className="inline-flex items-center justify-center rounded-xl border-2 border-secondary-foreground/20 bg-secondary-foreground/5 px-6 py-3 text-sm font-black text-secondary-foreground"
            >
              Contact →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

