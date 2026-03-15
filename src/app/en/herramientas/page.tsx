import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import ExchangeRatesWidget from "@/components/tools/ExchangeRatesWidget";
import { withLocale } from "@/lib/i18n";
import { SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Financial tools | FinanzasEU";
const DESCRIPTION =
  "Free tools to decide with clarity: IBAN scanner, bank comparison and calculators (compound interest, inflation, APR/APY, savings goal).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/en/herramientas",
    languages: {
      es: "/herramientas",
      en: "/en/herramientas",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/herramientas`,
    type: "website",
    locale: "en_US",
  },
};

type Tool = {
  href: string;
  label: string;
  meta: string;
  desc: string;
  category: "Banking" | "Saving & investing";
  featured?: boolean;
};

const tools: Tool[] = [
  {
    href: "/iban",
    label: "IBAN Scanner",
    meta: "SEPA + bank lookup",
    desc: "Validate length, country, SEPA and (when available) the associated bank. Includes history and bulk mode.",
    category: "Banking",
    featured: true,
  },
  {
    href: "/comparativa",
    label: "Bank comparison",
    meta: "Editorial ranking 2026",
    desc: "Filter by IBAN, fees, multi-currency features and more. Export comparisons to PDF.",
    category: "Banking",
    featured: true,
  },
  {
    href: "/herramientas/tae",
    label: "APR/APY calculator",
    meta: "From nominal rate + compounding",
    desc: "Convert nominal rate to effective annual rate and estimate yearly interest. Includes optional fixed fee and share link.",
    category: "Banking",
  },
  {
    href: "/herramientas/interes-compuesto",
    label: "Compound interest calculator",
    meta: "Contributions + inflation",
    desc: "Project your balance with monthly contributions and adjust for inflation to estimate real purchasing power.",
    category: "Saving & investing",
    featured: true,
  },
  {
    href: "/herramientas/objetivo-ahorro",
    label: "Savings goal",
    meta: "Monthly contribution",
    desc: "Calculate how much to invest/save each month to reach a target in X years with an expected return.",
    category: "Saving & investing",
  },
  {
    href: "/herramientas/inflacion",
    label: "Inflation calculator",
    meta: "Purchasing power",
    desc: "Estimate how much you’ll need in the future to keep the same purchasing power.",
    category: "Saving & investing",
  },
  {
    href: "/herramientas/regla-4",
    label: "4% rule (FIRE)",
    meta: "Target portfolio",
    desc: "Quick estimate of the portfolio needed to sustain an annual spend based on a withdrawal rate.",
    category: "Saving & investing",
  },
];

export default function HerramientasPageEn() {
  const locale = "en" as const;
  const pageUrl = `${SITE_URL}/en/herramientas`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Tools", item: pageUrl },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "en-US",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${withLocale(tool.href, locale)}`,
        name: tool.label,
      })),
    },
  };

  const featured = tools.filter((t) => t.featured);
  const groups: Array<{ title: Tool["category"]; items: Tool[] }> = [
    { title: "Banking", items: tools.filter((t) => t.category === "Banking") },
    {
      title: "Saving & investing",
      items: tools.filter((t) => t.category === "Saving & investing"),
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(collectionJsonLd) }}
      />

      <Container className="space-y-14">
        <header className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Tools
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Calculators and utilities to decide with{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              clarity
            </span>
            .
          </h1>
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Less noise, more numbers. These tools are free and built for
            readers who want to make better decisions.
          </p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Home" },
              { href: "/herramientas", label: "Tools" },
              { href: "/blog", label: "Blog" },
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

        <ExchangeRatesWidget />

        {featured.length > 0 ? (
          <section className="grid gap-6 md:grid-cols-3">
            {featured.map((tool) => (
              <Link
                key={tool.href}
                href={withLocale(tool.href, locale)}
                className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Featured
                </p>
                <h2 className="relative mt-5 text-balance text-2xl font-black leading-tight text-accent md:text-3xl">
                  {tool.label}
                  <span className="ml-2 inline-block translate-x-[-4px] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    →
                  </span>
                </h2>
                <p className="relative mt-4 text-sm leading-relaxed text-secondary-foreground/80">
                  {tool.desc}
                </p>
                <div className="relative mt-6">
                  <span className="inline-flex items-center rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-3 py-1 text-[11px] font-semibold text-secondary-foreground/80">
                    {tool.meta}
                  </span>
                </div>
              </Link>
            ))}
          </section>
        ) : null}

        <div className="space-y-10">
          {groups.map((group) => (
            <section key={group.title} className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
                {group.title}
              </h2>
              <ul className="border-t border-border/60">
                {group.items.map((tool) => (
                  <li
                    key={tool.href}
                    className="border-b border-border/60 last:border-0"
                  >
                    <Link
                      href={withLocale(tool.href, locale)}
                      className="group grid gap-3 py-8 transition-colors hover:bg-muted/30 md:grid-cols-[1.3fr_0.7fr]"
                    >
                      <div className="space-y-2 px-2 md:px-4">
                        <h3 className="text-balance text-2xl font-black tracking-tight text-foreground group-hover:text-primary">
                          {tool.label}
                        </h3>
                        <p className="text-sm leading-relaxed text-muted-foreground">
                          {tool.desc}
                        </p>
                      </div>
                      <div className="flex items-center px-2 md:justify-end md:px-4">
                        <span className="inline-flex items-center rounded-full border-2 border-border bg-background/60 px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors group-hover:border-secondary/40 group-hover:text-foreground">
                          {tool.meta}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="max-w-3xl text-sm text-muted-foreground">
          Missing a tool? Send me a message via{" "}
          <Link
            href={withLocale("/contacto", locale)}
            className="text-foreground underline-offset-4 hover:underline"
          >
            contact
          </Link>{" "}
          and we’ll add it.
        </p>
      </Container>
    </section>
  );
}
