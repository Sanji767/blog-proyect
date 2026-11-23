// src/app/en/blog/layout.tsx
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
  title: {
    default: "Blog — banks, IBAN & fees (2026)",
    template: "%s • FinanzasEU",
  },
  description:
    "Practical guides about digital banks, European IBANs, fees, multi-currency accounts and finance for living or working in Europe. Updated in 2026.",
  openGraph: {
    title: "FinanzasEU Blog — Guides & comparisons (2026)",
    description: "Real articles and comparisons about banking in Europe.",
    url: "https://finanzaseu.com/en/blog",
    siteName: "FinanzasEU",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: BLOG_OG_IMAGE_URL,
        width: 1376,
        height: 768,
        alt: "FinanzasEU Blog",
      },
    ],
  },
};

export default function BlogLayoutEn({ children }: { children: ReactNode }) {
  return (
    <div className="py-16 md:py-24">
      <Container className="max-w-6xl">{children}</Container>
    </div>
  );
}

