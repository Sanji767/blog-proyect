import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | FinanzasEU",
  description:
    "Legal terms for using FinanzasEU — an independent informational website about banking and personal finance in Europe.",
  alternates: {
    canonical: "/en/terminos",
    languages: {
      es: "/terminos",
      en: "/en/terminos",
    },
  },
  openGraph: {
    locale: "en_US",
  },
};

export default function TermsPageEn() {
  const currentYear = new Date().getFullYear();

  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-8 text-center text-4xl font-black md:text-left">
        Terms of Use
      </h1>

      <div className="prose prose-lg max-w-none space-y-6 text-muted-foreground dark:prose-invert">
        <p className="lead text-lg font-medium text-foreground">
          Last updated: March 14, 2026
        </p>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            1. Acceptance of terms
          </h2>
          <p>
            By accessing and using <strong>FinanzasEU</strong> (the “Site”), you
            agree to be bound by these Terms of Use and applicable laws and
            regulations. You are responsible for compliance with any local laws
            that may apply.
          </p>
        </section>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            2. Informational nature (no advice)
          </h2>
          <p>
            FinanzasEU is an <strong>independent informational website</strong>.
            We are not a bank, a registered financial advisor, or a financial
            intermediary.
          </p>
          <p>
            All information is provided for <strong>educational purposes</strong>{" "}
            and does not constitute financial, tax, legal or any other
            professional advice.
          </p>
          <p className="font-medium text-foreground">
            You are solely responsible for decisions you make based on the
            content on this Site.
          </p>
        </section>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            3. Affiliate links and transparency
          </h2>
          <p>
            Some links to banking products may be{" "}
            <strong>affiliate links</strong>. If you open an account through
            them, FinanzasEU may receive a commission{" "}
            <strong>at no extra cost to you</strong>.
          </p>
          <p>
            This supports the project, but{" "}
            <strong>
              it does not affect our opinions, methodology, or the way we
              present information
            </strong>
            . We encourage you to verify conditions on official websites.
          </p>
        </section>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            4. Accuracy of information
          </h2>
          <p>
            We do our best to keep information up to date, but bank conditions
            can change at any time.{" "}
            <strong>
              Always verify official terms on the bank’s website before opening
              any account
            </strong>
            .
          </p>
        </section>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            5. Intellectual property
          </h2>
          <p>
            Original content published on FinanzasEU (texts, guides, comparisons
            and original visuals) is protected by copyright. You may share it
            with attribution, but large-scale reproduction or commercial use
            without permission is prohibited.
          </p>
        </section>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            6. Limitation of liability
          </h2>
          <p>
            FinanzasEU and its contributors are not liable for any direct,
            indirect, incidental or consequential damages resulting from the use
            of, or inability to use, this website.
          </p>
        </section>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            7. Changes
          </h2>
          <p>
            We may update these terms at any time. We recommend reviewing them
            periodically.
          </p>
        </section>

        <section>
          <h2 className="mb-4 mt-8 text-2xl font-bold text-foreground">
            8. Contact
          </h2>
          <p>
            If you have questions about these terms, contact us at{" "}
            <a href="mailto:hola@finanzaseu.com" className="text-primary underline">
              hola@finanzaseu.com
            </a>
            .
          </p>
        </section>

        <div className="mt-12 border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} FinanzasEU — All rights reserved</p>
        </div>
      </div>
    </article>
  );
}

