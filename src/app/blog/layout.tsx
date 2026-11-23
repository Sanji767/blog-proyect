// src/app/blog/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";

import Container from "@/components/layout/Container";
import { BLOG_OG_IMAGE_URL } from "@/lib/seo";

export const metadata: Metadata = {
  // NOTE: title MUST be an object with a template here, not a plain string.
  // A plain-string title in this layout blocks the root template from
  // applying to generateMetadata titles in child segments (articles,
  // categories, tags rendered with no brand suffix at all after the W4
  // suffix strip); the object form restores "%s • FinanzasEU" for them.
  // The same-segment /blog index is unaffected (a layout's template never
  // applies to its own segment's page — it keeps using the root template).
  title: {
    default: "Blog de bancos digitales, IBAN y comisiones (2026)",
    template: "%s • FinanzasEU",
  },
  description:
    "Guías prácticas sobre bancos digitales, IBAN europeo, comisiones, multidivisa y finanzas para vivir o trabajar en Europa. Actualizado en 2026.",
  openGraph: {
    title: "Blog FinanzasEU — Guías, bancos y consejos (2026)",
    description: "Artículos reales y comparativas sobre bancos en Europa.",
    url: "https://finanzaseu.com/blog",
    siteName: "FinanzasEU",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: BLOG_OG_IMAGE_URL,
        width: 1376,
        height: 768,
        alt: "Blog FinanzasEU",
      },
    ],
  },
};

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-6xl">{children}</Container>
    </div>
  );
}

