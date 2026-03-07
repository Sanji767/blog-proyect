import type { Metadata } from "next";

import FaqClient from "@/app/faq/FaqClient";
import { SITE_NAME, SITE_URL } from "@/lib/seo";

const TITLE = `FAQ | ${SITE_NAME}`;
const DESCRIPTION =
  "Clear answers about European banks, IBAN/SEPA, fees, safety and opening accounts. Fast, practical and no fluff.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/en/faq" },
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

export default function FaqPageEn() {
  return <FaqClient />;
}

