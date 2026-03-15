import type { Metadata } from "next";
import Link from "next/link";

import Container from "@/components/layout/Container";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const TITLE = `Ebooks & courses | ${SITE_NAME}`;
const DESCRIPTION =
  "Guides and courses to make better decisions: saving, investing and banking in Europe.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  robots: { index: false, follow: true },
  alternates: {
    canonical: "/en/ebooks",
    languages: {
      es: "/ebooks",
      en: "/en/ebooks",
    },
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/en/ebooks`,
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
    images: [{ url: `${SITE_URL}/og-escalada.png` }],
  },
};

export default function EbooksPageEn() {
  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-5xl">
        <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Resources
          </p>
          <h1 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-5xl">
            Ebooks & courses
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            This section is being translated. For now, the resources are
            available in Spanish.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/ebooks"
              className="inline-flex items-center justify-center rounded-xl border-2 border-secondary bg-accent px-6 py-3 text-sm font-black text-accent-foreground shadow-offset-accent"
            >
              Open Spanish resources →
            </Link>
            <Link
              href="/en/contacto"
              className="inline-flex items-center justify-center rounded-xl border-2 border-border bg-background px-6 py-3 text-sm font-black text-foreground"
            >
              Contact →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

