import type { Metadata } from "next";

import { SITE_NAME } from "@/lib/seo";

export const metadata: Metadata = {
  title: {
    default: `Digital bank comparison & IBAN validator (2026) | ${SITE_NAME}`,
    template: `%s • ${SITE_NAME}`,
  },
  description:
    "Independent guide to choose a bank in Europe: fees, IBAN, requirements and official sources. Includes a bank comparison and free tools.",
  openGraph: {
    locale: "en_US",
  },
};

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <div lang="en">{children}</div>;
}

