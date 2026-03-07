import type { Metadata } from "next";
import Link from "next/link";

import VentajasPageEs, { metadata as metadataEs } from "@/app/ventajas/page";

export const metadata: Metadata = {
  ...(metadataEs as Metadata),
  robots: { index: false, follow: true },
  alternates: { canonical: "/ventajas" },
  openGraph: {
    ...(metadataEs?.openGraph ?? {}),
    locale: "en_US",
  },
};

export default function VentajasPageEn() {
  return (
    <>
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            <p className="font-semibold text-foreground">Spanish version</p>
            <p className="mt-1">
              This page is currently available in Spanish:{" "}
              <Link
                href="/ventajas"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                /ventajas
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <div lang="es">
        <VentajasPageEs />
      </div>
    </>
  );
}

