// src/app/en/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

import Container from "@/components/layout/Container";
import CtaSection from "@/components/sections/comunes/CtaSection";
import Benefits from "@/components/sections/home/Benefits";
import CurrencyComparison from "@/components/sections/home/CurrencyComparison";
import Features from "@/components/sections/home/Features";
import Hero from "@/components/sections/home/Hero";
import HomeBanksPreview from "@/components/sections/home/HomeBanksPreview";
import HomeFaqPreview from "@/components/sections/home/HomeFaqPreview";
import HomeHowItWorks from "@/components/sections/home/HomeHowItWorks";
import HomeVlogsPreview from "@/components/sections/home/HomeVlogsPreview";
import RankingMethodology from "@/components/sections/home/RankingMethodology";
import TrustStrip from "@/components/sections/home/TrustStrip";
import UseCases from "@/components/sections/home/UseCases";
import { Button } from "@/components/ui/button";
import { banks } from "@/lib/banks";
import { withLocale } from "@/lib/i18n";
import { formatIsoYmdToEnDate } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Digital bank comparison in Europe (2026) + IBAN validator",
  description:
    "Compare banks with clear criteria (IBAN, fees, requirements) and official links. Includes a SEPA IBAN validator to double-check details before sending money.",
  keywords: [
    "bank comparison",
    "best digital banks",
    "IBAN validator",
    "IBAN checker",
    "SEPA IBAN",
    "banks in Europe",
    "no-fee accounts",
  ],
  alternates: {
    canonical: "/en",
  },
  openGraph: {
    title: "Digital bank comparison in Europe (2026) + IBAN validator",
    description:
      "Fees, IBAN, requirements and official links to choose a bank with confidence. Includes a SEPA IBAN validator.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Digital bank comparison (2026)",
    description:
      "Compare banks with clear criteria and validate SEPA IBANs in seconds.",
  },
};

export default function HomePageEn() {
  const latestBankUpdate = banks
    .map((b) => b._lastUpdated)
    .filter(Boolean)
    .sort()
    .at(-1);

  const lastUpdatedLabel = formatIsoYmdToEnDate(latestBankUpdate);

  const locale = "en" as const;

  return (
    <>
      {/* 1. First impression */}
      <Hero />

      {/* 2. Trust / authority */}
      <TrustStrip locale={locale} />

      {/* 3. Features + segmentation */}
      <Features locale={locale} />
      <UseCases />

      {/* 3.1 Methodology */}
      <RankingMethodology locale={locale} lastUpdatedLabel={lastUpdatedLabel} />

      {/* 4. Tool: IBAN validator */}
      <section className="border-t border-border bg-muted/30 py-16 md:py-24">
        <Container>
          <div className="relative overflow-hidden rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent md:p-12">
            <div className="pointer-events-none absolute -top-28 -right-28 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

            <div className="relative grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary-foreground/10 bg-secondary-foreground/5 px-4 py-2 text-xs font-black uppercase tracking-wide text-primary">
                  <ShieldCheck className="h-4 w-4" />
                  Free tool
                </div>

                <h2 className="text-balance text-3xl font-black tracking-tight md:text-4xl">
                  Validate an IBAN in{" "}
                  <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
                    seconds
                  </span>{" "}
                  (country, SEPA, bank)
                </h2>

                <p className="max-w-2xl text-sm text-secondary-foreground/80 md:text-base">
                  Paste any IBAN and we’ll tell you if the length is correct,
                  whether it belongs to SEPA and, when available, the associated
                  bank. Useful for payroll, international transfers and to
                  double-check details before sending money.
                </p>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="w-full gap-2 sm:w-auto">
                    <Link href={withLocale("/iban", locale)}>
                      Open IBAN Scanner
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>

                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full border-secondary-foreground/20 text-secondary-foreground hover:border-secondary-foreground/35 hover:bg-secondary-foreground/5 sm:w-auto"
                  >
                    <Link href={withLocale("/bancos", locale)}>
                      See bank comparison
                    </Link>
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border-2 border-secondary-foreground/10 bg-secondary-foreground/5 p-6 backdrop-blur">
                <p className="text-xs font-black uppercase tracking-wide text-secondary-foreground/70">
                  Quick example
                </p>
                <p className="mt-3 font-mono text-sm md:text-base">
                  ES91 2100 0418 4502 0005 1332
                </p>
                <div className="mt-5 grid gap-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-foreground/70">Country</span>
                    <span className="font-semibold">Spain</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-foreground/70">SEPA</span>
                    <span className="font-semibold text-accent">Yes</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-secondary-foreground/70">Length</span>
                    <span className="font-semibold">24</span>
                  </div>
                </div>
                <p className="mt-5 text-xs text-secondary-foreground/70">
                  This tool doesn’t move money — it only validates and explains
                  the IBAN format.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* 5. Bank selection */}
      <HomeBanksPreview />

      {/* 6. Value */}
      <Benefits />
      <CurrencyComparison />

      {/* 7. Content + FAQ */}
      <HomeHowItWorks locale={locale} />
      <HomeVlogsPreview locale={locale} />
      <HomeFaqPreview locale={locale} />

      {/* 8. Conversion */}
      <CtaSection locale={locale} />
    </>
  );
}
