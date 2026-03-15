import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FinanzasEU",
  description:
    "Privacy information for FinanzasEU: what data we collect, how it’s used and how we protect your information.",
  alternates: {
    canonical: "/en/privacidad",
    languages: {
      es: "/privacidad",
      en: "/en/privacidad",
    },
  },
  openGraph: {
    locale: "en_US",
  },
};

export default function PrivacyPageEn() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-4xl font-black">Privacy Policy</h1>
      <div className="prose dark:prose-invert">
        <p>
          FinanzasEU does not sell or share your personal data. Our goal is to
          publish useful information without invading your privacy.
        </p>
        <p>
          We may use aggregated analytics to understand what content works best
          and improve the website (for example, Google Analytics configured in an
          anonymized way). We do not use remarketing cookies or personalized
          advertising.
        </p>
        <p>
          Questions? Email us at{" "}
          <a href="mailto:hola@finanzaseu.com">hola@finanzaseu.com</a>.
        </p>
      </div>
    </article>
  );
}

