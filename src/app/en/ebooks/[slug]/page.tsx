import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import { ebooks } from "@/lib/ebooks-data";
import { DEFAULT_OG_IMAGE_URL, SITE_NAME, SITE_URL } from "@/lib/seo";

export async function generateMetadata(
  props: {
    params: Promise<{ slug: string }>;
  }
): Promise<Metadata> {
  const params = await props.params;
  const ebook = ebooks.find((e) => e.id === params.slug);

  if (!ebook) {
    return {
      title: `Resource not found | ${SITE_NAME}`,
      description: "We couldn't find the resource you were looking for.",
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/en/ebooks/${encodeURIComponent(ebook.id)}`;

  return {
    title: `Resource | ${SITE_NAME}`,
    description:
      "This resource is being translated. For now it’s available in Spanish.",
    robots: { index: false, follow: true },
    alternates: {
      canonical: canonicalPath,
      languages: {
        es: `/ebooks/${encodeURIComponent(ebook.id)}`,
        en: canonicalPath,
      },
    },
    openGraph: {
      title: `Resource | ${SITE_NAME}`,
      description:
        "This resource is being translated. For now it’s available in Spanish.",
      url: `${SITE_URL}${canonicalPath}`,
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      images: [{ url: DEFAULT_OG_IMAGE_URL }],
    },
  };
}

export default async function EbookDetailPageEn(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const ebook = ebooks.find((e) => e.id === params.slug);
  if (!ebook) notFound();

  const esPath = `/ebooks/${encodeURIComponent(ebook.id)}`;

  return (
    <section className="py-16 md:py-24">
      <Container className="max-w-5xl">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft md:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-text">
            Resource
          </p>
          <h1 className="mt-4 text-balance text-3xl font-black tracking-tight md:text-5xl">
            This resource is available in Spanish
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            We’re translating this section. Meanwhile you can view the Spanish
            version here:
          </p>

          <div className="mt-6">
            <Link
              href={esPath}
              className="inline-flex items-center justify-center rounded-xl bg-accent px-6 py-3 text-sm font-black text-accent-foreground"
            >
              Open Spanish version →
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

