import type { Metadata } from "next";

import FaqClient from "./FaqClient";
import { DEFAULT_OG_IMAGE_URL, SITE_NAME, SITE_URL } from "@/lib/seo";

const TITLE = `FAQ (preguntas frecuentes) | ${SITE_NAME}`;
const DESCRIPTION =
  "Respuestas claras sobre bancos europeos, IBAN/SEPA, comisiones, seguridad y apertura de cuentas. Guía rápida y sin humo.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/faq" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/faq`,
    type: "website",
    locale: "es_ES",
    siteName: SITE_NAME,
    images: [{ url: DEFAULT_OG_IMAGE_URL }],
  },
};

export default function FaqPage() {
  return <FaqClient />;
}

