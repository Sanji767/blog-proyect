import type { Metadata } from "next";
import Link from "next/link";

import { metadata as metadataEs } from "@/app/vlogs/page";

export const metadata: Metadata = {
  ...(metadataEs as Metadata),
  robots: { index: false, follow: true },
  alternates: { canonical: "/vlogs" },
  openGraph: {
    ...(metadataEs?.openGraph ?? {}),
    locale: "en_US",
  },
};

type Props = {
  searchParams?: {
    tag?: string | string[];
  };
};

export default function VlogsPageEn(props: Props) {
  void props;
  return (
    <>
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            <p className="font-semibold text-foreground">Spanish version</p>
            <p className="mt-1">
              Vlogs are currently available in Spanish:{" "}
              <Link
                href="/vlogs"
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                /vlogs
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
