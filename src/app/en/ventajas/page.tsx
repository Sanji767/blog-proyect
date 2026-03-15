// src/app/en/ventajas/page.tsx
import type { Metadata } from "next";
import Script from "next/script";
import Link from "next/link";
import {
  ArrowRight,
  CreditCard,
  Euro,
  Globe,
  Lock,
  Users,
  Zap,
} from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { withLocale } from "@/lib/i18n";
import { SITE_NAME, SITE_URL, toJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Benefits of digital banks in Europe | FinanzasEU",
  description:
    "Independent analysis of the real benefits of digital banks in Europe: fees, IBAN, safety, multi-currency features and support. Updated in 2026.",
  alternates: {
    canonical: "/en/ventajas",
    languages: {
      es: "/ventajas",
      en: "/en/ventajas",
    },
  },
  openGraph: {
    title: "Benefits of digital banks in Europe",
    description:
      "Fees, IBAN, safety, multi-currency features and support — explained with clear criteria.",
    url: `${SITE_URL}/en/ventajas`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

const LAST_UPDATE = "February 2026";
const LAST_UPDATE_ISO = "2026-02-08";

export default function VentajasPageEn() {
  const locale = "en" as const;

  const benefits = [
    {
      icon: <Globe className="h-6 w-6" />,
      title: "European IBAN (SEPA) to operate across Europe",
      desc: "Receive money, pay bills or set up direct debits with a European IBAN (varies by entity and country).",
      stat: "SEPA",
    },
    {
      icon: <Euro className="h-6 w-6" />,
      title: "Lower fees for SEPA transfers (often)",
      desc: "Many digital banks offer free or low-cost standard SEPA transfers depending on your plan.",
      stat: "Plan-dependent",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Better FX rates for international payments",
      desc: "Some multi-currency accounts reduce the FX markup versus traditional banks (depends on plan and time).",
      stat: "Multi-currency",
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Protection and regulation (varies by entity)",
      desc: "If it’s a licensed bank, deposit protection may apply (often up to €100,000). E-money institutions work differently.",
      stat: "Safety",
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Instant transfers (when available)",
      desc: "Send money in seconds between accounts that support SEPA instant transfers.",
      stat: "< 10 s",
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "English support (in most cases)",
      desc: "Chat/email help is often available in English. We indicate support and channels in each bank profile when relevant.",
      stat: "Support",
    },
  ];

  const stats = [
    { value: "SEPA", label: "IBAN and transfers in the EU" },
    { value: "Sources", label: "Official links to verify conditions" },
    { value: "2026", label: `Last review: ${LAST_UPDATE}` },
  ];

  const steps = [
    {
      step: "1",
      title: "Real data",
      desc: "We review fees, requirements, limits and conditions and cross-check with official sources.",
    },
    {
      step: "2",
      title: "No paid positions",
      desc: "We don’t sell ranking spots. If something isn’t worth it, we say it — even if there’s an affiliate link.",
    },
    {
      step: "3",
      title: "Ongoing updates",
      desc: `We revisit fees and requirements regularly. Last update: ${LAST_UPDATE}.`,
    },
  ];

  return (
    <>
      <section className="py-16 md:py-24">
        <Container className="space-y-14">
          <header className="mx-auto max-w-4xl space-y-5 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Updated guide · {LAST_UPDATE}
            </p>

            <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
              Real benefits of digital banks in{" "}
              <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                Europe
              </span>
              .
            </h1>

            <p className="mx-auto max-w-3xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
              Beyond marketing: fees, safety, IBAN, multi-currency features and
              support — explained with clarity.
            </p>
          </header>

          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <Card
                key={b.title}
                className="group relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-7 text-secondary-foreground shadow-soft transition-shadow hover:shadow-offset-accent"
              >
                <div className="pointer-events-none absolute -top-24 -right-24 h-56 w-56 rounded-full bg-accent/10 blur-3xl" />

                <div className="relative mb-5 flex h-12 w-12 items-center justify-center rounded-xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 text-primary">
                  {b.icon}
                </div>

                <h2 className="relative text-balance text-lg font-black tracking-tight text-accent">
                  {b.title}
                </h2>

                <p className="relative mt-3 text-sm leading-relaxed text-secondary-foreground/80">
                  {b.desc}
                </p>

                <div className="relative mt-5 inline-flex w-fit items-center rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
                  {b.stat}
                </div>
              </Card>
            ))}
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.label} className="p-6 text-center">
                <div className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
                  {stat.value}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </section>

          <Card className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-soft md:p-12">
            <div className="pointer-events-none absolute -top-32 -right-32 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />

            <h2 className="relative text-center text-2xl font-black tracking-tight text-accent md:text-4xl">
              How we analyze banks at FinanzasEU
            </h2>

            <div className="relative mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((s) => (
                <div key={s.step} className="text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border-2 border-secondary bg-accent text-base font-black text-accent-foreground shadow-offset-accent">
                    {s.step}
                  </div>
                  <h3 className="text-lg font-black tracking-tight">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-secondary-foreground/80">
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <section className="space-y-6 text-center">
            <h2 className="text-balance text-2xl font-black tracking-tight md:text-4xl">
              Find the bank that actually fits your needs
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
              Not every bank is good for every use case. Shortlist options and
              verify details on official sources.
            </p>
            <div className="flex flex-col justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="gap-2 rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
              >
                <Link href={withLocale("/bancos", locale)}>
                  See bank ranking
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full shadow-none hover:translate-x-0 hover:translate-y-0"
              >
                <Link href={withLocale("/iban", locale)}>Open IBAN Scanner</Link>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Some links may be affiliate links. This doesn’t change the
              analysis.
            </p>
          </section>
        </Container>
      </section>

      <Script
        id="ld-json-benefits-digital-banks-europe-en"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: toJsonLd({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Benefits of digital banks in Europe",
            description:
              "Independent analysis of fees, safety, IBAN and the real benefits of digital banks in Europe.",
            publisher: {
              "@type": "Organization",
              name: SITE_NAME,
              url: SITE_URL,
            },
            dateModified: LAST_UPDATE_ISO,
            inLanguage: "en-US",
          }),
        }}
      />
    </>
  );
}

