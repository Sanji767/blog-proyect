import type { Metadata } from "next";
import Link from "next/link";

import VlogPageEs, {
  generateMetadata as generateMetadataEs,
  generateStaticParams as generateStaticParamsEs,
} from "@/app/vlogs/[slug]/page";

export function generateStaticParams(): Array<{ slug: string }> {
  return generateStaticParamsEs();
}

export async function generateMetadata(
  args: {
    params: { slug: string };
  },
): Promise<Metadata> {
  const meta = await generateMetadataEs(args);
  return {
    ...meta,
    robots: { index: false, follow: true },
    alternates: {
      canonical: meta?.alternates?.canonical ?? `/vlogs/${args.params.slug}`,
    },
  };
}

export default function VlogPageEn({ params }: { params: { slug: string } }) {
  return (
    <>
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            <p className="font-semibold text-foreground">Spanish version</p>
            <p className="mt-1">
              This vlog is currently available in Spanish:{" "}
              <Link
                href={`/vlogs/${params.slug}`}
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                /vlogs/{params.slug}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <div lang="es">
        <VlogPageEs params={params} />
      </div>
    </>
  );
}

