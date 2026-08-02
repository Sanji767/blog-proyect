import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ComparisonHubClient from "@/components/sections/comparar/ComparisonHubClient";

export const metadata: Metadata = {
  title: "Bank Comparison Hub 2026: Head-to-Head Duels",
  description:
    "Compare Revolut vs Wise, N26 vs Revolut, Trade Republic vs MyInvestor and more. Compare fees, IBANs, yields and card perks side by side.",
  alternates: {
    canonical: "/en/comparar",
    languages: {
      es: "/comparar",
      en: "/en/comparar",
    },
  },
};

export default function CompararHubPageEn() {
  return (
    <main className="py-12 md:py-20">
      <Container>
        <ComparisonHubClient />
      </Container>
    </main>
  );
}
