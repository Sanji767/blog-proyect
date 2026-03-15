import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Disclosure | FinanzasEU",
  description:
    "Full transparency: how FinanzasEU makes money and why recommendations remain honest and editorial.",
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
          Some links on this website are affiliate links. This means that if you
          open an account through them, FinanzasEU may receive a small commission{" "}
          <strong>at no extra cost to you</strong>.
        </p>
        <p>
          This helps keep the site free and up to date, but{" "}
          <strong>it never influences our recommendations</strong>. We only
          highlight banks and products we genuinely believe are useful and would
          consider using ourselves.
        </p>
        <p className="font-bold text-primary">Trust comes first.</p>
      </div>
    </article>
  );
}

