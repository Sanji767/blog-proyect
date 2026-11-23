import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | FinanzasEU",
  description:
    "Full transparency: FinanzasEU currently earns nothing from outbound links. How it works today, and what would change if that changes.",
  alternates: {
    canonical: "/en/aviso-afiliados",
    languages: {
      es: "/aviso-afiliados",
      en: "/en/aviso-afiliados",
    },
  },
  openGraph: {
    locale: "en_US",
  },
};

export default function AffiliateDisclosurePageEn() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="mb-6 text-4xl font-black">Affiliate disclosure</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead text-lg">
          FinanzasEU aims to be fully transparent.
        </p>
        <p>
          At the moment, <strong>no link on this website is an affiliate
          link</strong>: links to banks and providers go straight to their
          official websites, and FinanzasEU receives no commission if you open
          an account through them.
        </p>
        <p>
          If we add affiliate links in the future, we will say so clearly on
          every affected page and update this disclosure. Either way,{" "}
          <strong>no commission will ever influence our recommendations</strong>.
          We only highlight banks and products we genuinely believe are useful
          and would consider using ourselves.
        </p>
        <p className="font-bold text-primary">Trust comes first.</p>
      </div>
    </article>
  );
}

