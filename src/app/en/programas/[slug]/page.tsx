import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import ProgramaPageEs from "@/app/programas/[slug]/page";
import { banks } from "@/lib/banks";

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

  return {
    title: `${bank.name} | FinanzasEU`,
    description: bank.tagline,
    robots: { index: false, follow: true },
    alternates: {
      canonical: `/programas/${bank.slug}`,
    },
  };
}

export default function ProgramaPageEn({ params }: { params: { slug: string } }) {
  const bank = banks.find((b) => b.slug === params.slug);
  if (!bank) notFound();

  return (
    <>
      <section className="py-10 md:py-14">
        <div className="mx-auto max-w-7xl px-6">
          <div className="rounded-2xl border-2 border-border bg-card p-5 text-sm text-muted-foreground shadow-soft">
            <p className="font-semibold text-foreground">Spanish version</p>
            <p className="mt-1">
              This bank profile is currently available in Spanish. You can read
              it here:{" "}
              <Link
                href={`/programas/${params.slug}`}
                className="font-semibold text-foreground underline-offset-4 hover:underline"
              >
                /programas/{params.slug}
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      <div lang="es">
        <ProgramaPageEs params={params} />
      </div>
    </>
  );
}

