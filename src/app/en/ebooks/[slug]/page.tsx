import type { Metadata } from "next";
import { notFound } from "next/navigation";

import EbookDetailClient from "@/app/ebooks/[slug]/EbookDetailClient";
import { ebooks } from "@/lib/ebooks-data";
import {
  DEFAULT_OG_IMAGE_URL,
  SITE_LOGO_URL,
  SITE_NAME,
  SITE_URL,
  toAbsoluteUrl,
  toJsonLd,
} from "@/lib/seo";

export function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Metadata {
  const ebook = ebooks.find((e) => e.id === params.slug);

  if (!ebook) {
    return {
      title: `Ebook not found | ${SITE_NAME}`,
      description: "We couldn't find the ebook or course you were looking for.",
      robots: { index: false, follow: true },
    };
  }

  const canonicalPath = `/en/ebooks/${encodeURIComponent(ebook.id)}`;

  return {
    title: `${ebook.title} | ${SITE_NAME}`,
    description: ebook.description,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: ebook.title,
      description: ebook.description,
      url: canonicalPath,
      type: "website",
      locale: "en_US",
      images: [
        {
          url: ebook.image ? toAbsoluteUrl(ebook.image) : DEFAULT_OG_IMAGE_URL,
        },
      ],
    },
  };
}

export default function EbookDetailPageEn({
  params,
}: {
  params: { slug: string };
}) {
  const ebook = ebooks.find((e) => e.id === params.slug);
  if (!ebook) notFound();

  const pageUrl = `${SITE_URL}/en/ebooks/${encodeURIComponent(ebook.id)}`;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/en` },
      { "@type": "ListItem", position: 2, name: "Ebooks", item: `${SITE_URL}/en/ebooks` },
      { "@type": "ListItem", position: 3, name: ebook.title, item: pageUrl },
    ],
  };

  const offerJsonLd =
    typeof ebook.price === "number"
      ? {
          "@type": "Offer",
          price: String(ebook.price),
          priceCurrency: "EUR",
          url: ebook.hotmartUrl,
          availability: "https://schema.org/InStock",
        }
      : {
          "@type": "Offer",
          price: "0",
          priceCurrency: "EUR",
          url: ebook.hotmartUrl,
          availability: "https://schema.org/InStock",
        };

  const courseJsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": `${pageUrl}#course`,
    url: pageUrl,
    name: ebook.title,
    description: ebook.description,
    inLanguage: "en-US",
    provider: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: { "@type": "ImageObject", url: SITE_LOGO_URL },
    },
    image: [ebook.image ? toAbsoluteUrl(ebook.image) : DEFAULT_OG_IMAGE_URL],
    offers: offerJsonLd,
    aggregateRating: ebook.reviews
      ? {
          "@type": "AggregateRating",
          ratingValue: ebook.reviews.rating,
          reviewCount: ebook.reviews.count,
        }
      : undefined,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(courseJsonLd) }}
      />

      <EbookDetailClient ebook={ebook} />
    </>
  );
}

