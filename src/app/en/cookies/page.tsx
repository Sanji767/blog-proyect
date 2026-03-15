import type { Metadata } from "next";

import CookiePreferences from "@/components/cookies/CookiePreferences";

export const metadata: Metadata = {
  title: "Cookie Policy | FinanzasEU",
  description:
    "Information about cookies on FinanzasEU: what they are, which types we use and how you can manage your preferences.",
  alternates: {
    canonical: "/en/cookies",
    languages: {
      es: "/cookies",
      en: "/en/cookies",
    },
  },
  openGraph: {
    locale: "en_US",
  },
};

export default function CookiesPageEn() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-20">
      <header className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-black tracking-tight md:text-5xl">
          Cookie Policy
        </h1>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          We use cookies to improve your browsing experience and to understand
          usage in an anonymous and responsible way.
        </p>
      </header>

      <section className="prose prose-lg max-w-none dark:prose-invert">
        <h2>What are cookies?</h2>
        <p>
          Cookies are small files stored on your device when you visit a
          website. They help the site work properly and can be used to collect
          anonymous statistics.
        </p>

        <h2>Which cookies do we use?</h2>
        <ul>
          <li>
            <strong>Essential cookies:</strong> required for the basic operation
            of the site.
          </li>
          <li>
            <strong>Analytics cookies:</strong> used to measure, in an anonymous
            way, how visitors interact with the site (for example, via Google
            Analytics).
          </li>
        </ul>

        <h2>Do we use advertising cookies?</h2>
        <p>
          No. FinanzasEU does not use remarketing cookies or personalized
          advertising. We don’t sell or share personal data with third parties.
        </p>

        <h2>Manage your preferences</h2>
        <p>
          You can accept or reject analytics cookies from the banner shown when
          you visit the site. You can also change your choice at any time using
          this panel, or by configuring your browser settings.
        </p>

        <CookiePreferences />

        <h2>Updates to this policy</h2>
        <p>
          This policy may be updated due to legal or technical changes. We
          recommend reviewing it periodically.
        </p>
      </section>
    </article>
  );
}

