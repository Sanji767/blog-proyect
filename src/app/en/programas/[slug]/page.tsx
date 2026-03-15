import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import { banks } from "@/lib/banks";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

export function generateStaticParams() {
  return banks.map((bank) => ({
    slug: bank.slug,
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const bank = banks.find((b) => b.slug === params.slug);

  if (!bank) {
    return {
      title: "Bank not found | FinanzasEU",
      description: "We couldn't find the bank profile you were looking for.",
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/en/programas/${bank.slug}`;

  return {
    title: `${bank.name} | FinanzasEU`,
    description:
      "This bank profile is being translated. For now, you can use official links or read the Spanish version.",
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalPath,
      languages: {
        es: `/programas/${bank.slug}`,
        en: canonicalPath,
      },
    },
    openGraph: {
      title: `${bank.name} | FinanzasEU`,
      description:
        "This bank profile is being translated. For now, you can use official links or read the Spanish version.",
      url: `${SITE_URL}${canonicalPath}`,
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      images: [{ url: `${SITE_URL}/og-escalada.png` }],
    },
  };
}

export default function ProgramaPageEn({ params }: { params: { slug: string } }) {
  const bank = banks.find((b) => b.slug === params.slug);
  if (!bank) notFound();

  const primaryCtaUrl = bank.affiliateUrl || bank.website;
  const hasAffiliate = Boolean(bank.affiliateUrl);

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-5xl space-y-6">
        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Bank profile
          </p>
          <h1 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-5xl">
            {bank.name}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This profile is being translated. Meanwhile, you can use the
            official links below or read the full Spanish version.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={primaryCtaUrl}
              data-analytics={hasAffiliate ? "affiliate" : undefined}
              data-affiliate-partner={hasAffiliate ? bank.slug : undefined}
              target="_blank"
              rel={hasAffiliate ? "noopener noreferrer sponsored" : "noopener noreferrer"}
              className="inline-flex items-center justify-center rounded-xl border-2 border-secondary bg-accent px-6 py-3 text-sm font-black text-accent-foreground shadow-offset-accent"
            >
              Open account →
            </a>

            <a
              href={bank.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border-2 border-border bg-background px-6 py-3 text-sm font-black text-foreground"
            >
              Official website →
            </a>
          </div>

          <p className="mt-4 text-xs text-muted-foreground">
            {hasAffiliate
              ? "Some links may be affiliate links. It doesn’t change the analysis and has no extra cost to you."
              : "Always verify conditions on the official website before opening an account."}
          </p>

          <div className="mt-8 border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              Prefer Spanish?{" "}
              <Link
                href={`/programas/${bank.slug}`}
                className="font-semibold text-foreground underline underline-offset-4"
              >
                Read the Spanish version
              </Link>
              .
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

