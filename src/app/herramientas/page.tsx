import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import ExchangeRatesWidget from "@/components/tools/ExchangeRatesWidget";
import { SITE_URL, toJsonLd } from "@/lib/seo";

const TITLE = "Herramientas financieras | FinanzasEU";
const DESCRIPTION =
  "Herramientas gratuitas para decidir con criterio: IBAN scanner, comparativa de bancos y calculadoras (interés compuesto, inflación, TAE, objetivo de ahorro).";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: "/herramientas",
    languages: {
      es: "/herramientas",
      en: "/en/herramientas",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/herramientas`,
    type: "website",
    locale: "es_ES",
  },
};

type Tool = {
  href: string;
  label: string;
  meta: string;
  desc: string;
  category: "Banca" | "Ahorro e inversión";
  featured?: boolean;
};

const tools: Tool[] = [
  {
    href: "/iban",
    label: "IBAN Scanner",
    meta: "Validador SEPA + entidad",
    desc: "Comprueba longitud, país, SEPA y (cuando aplica) banco asociado. Incluye historial y modo bulk.",
    category: "Banca",
    featured: true,
  },
  {
    href: "/comparativa",
    label: "Comparativa de bancos",
    meta: "Ranking editorial 2026",
    desc: "Filtra por IBAN, comisiones, soporte en español, multidivisa y más. Exporta comparativas a PDF.",
    category: "Banca",
    featured: true,
  },
  {
    href: "/herramientas/tae",
    label: "Calculadora TAE",
    meta: "Desde TIN + capitalización",
    desc: "Convierte TIN a TAE y estima interés anual. Incluye comisión fija opcional y enlace para compartir.",
    category: "Banca",
  },
  {
    href: "/herramientas/interes-compuesto",
    label: "Calculadora de interés compuesto",
    meta: "Aportaciones + inflación",
    desc: "Proyecta tu capital con aportaciones mensuales y ajusta por inflación para ver el valor real.",
    category: "Ahorro e inversión",
    featured: true,
  },
  {
    href: "/herramientas/objetivo-ahorro",
    label: "Objetivo de ahorro",
    meta: "Aportación mensual",
    desc: "Calcula cuánto aportar al mes para llegar a una meta en X años con una rentabilidad esperada.",
    category: "Ahorro e inversión",
  },
  {
    href: "/herramientas/inflacion",
    label: "Calculadora de inflación",
    meta: "Poder adquisitivo",
    desc: "Calcula cuánto necesitas en el futuro para mantener el mismo poder adquisitivo.",
    category: "Ahorro e inversión",
  },
  {
    href: "/herramientas/regla-4",
    label: "Regla del 4% (FIRE)",
    meta: "Capital objetivo",
    desc: "Estimación rápida de capital necesario para sostener un gasto anual según una tasa de retirada.",
    category: "Ahorro e inversión",
  },
];

export default function HerramientasPage() {
  const pageUrl = `${SITE_URL}/herramientas`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Herramientas", item: pageUrl },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${pageUrl}#collection`,
    url: pageUrl,
    name: TITLE,
    description: DESCRIPTION,
    inLanguage: "es-ES",
    mainEntity: {
      "@type": "ItemList",
      itemListElement: tools.map((tool, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `${SITE_URL}${tool.href}`,
        name: tool.label,
      })),
    },
  };

  const featured = tools.filter((t) => t.featured);
  const groups: Array<{ title: Tool["category"]; items: Tool[] }> = [
    { title: "Banca", items: tools.filter((t) => t.category === "Banca") },
    {
      title: "Ahorro e inversión",
      items: tools.filter((t) => t.category === "Ahorro e inversión"),
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
            Herramientas
          </p>
          <h1 className="text-balance text-4xl font-black leading-[1.05] tracking-tight md:text-6xl">
            Calculadoras y utilidades para decidir con{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              criterio
            </span>
            .
          </h1>
          <p className="max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Menos marketing, más números claros. Estas herramientas son gratuitas
            y están pensadas para lectores de FinanzasEU.
          </p>
          <nav className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm">
            {[
              { href: "/", label: "Inicio" },
              { href: "/herramientas", label: "Herramientas" },
              { href: "/blog", label: "Blog" },
            ].map((item, idx, arr) => (
              <span key={item.href} className="inline-flex items-center gap-x-4">
                <Link
                  href={item.href}
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
                href={tool.href}
                className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-secondary"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />
                <p className="relative text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                  Destacada
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
                      href={tool.href}
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
          ¿Echas en falta una herramienta? Escríbeme en{" "}
          <Link href="/contacto" className="text-foreground underline-offset-4 hover:underline">
            contacto
          </Link>{" "}
          y la añadimos.
        </p>
      </Container>
    </section>
  );
}
