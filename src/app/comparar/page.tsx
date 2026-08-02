import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import ComparisonHubClient from "@/components/sections/comparar/ComparisonHubClient";

export const metadata: Metadata = {
  title: "Comparativa de Bancos en Europa 2026: Duelos Cara a Cara",
  description:
    "Compara Revolut vs Wise, N26 vs Revolut, Trade Republic vs MyInvestor y más. Analiza comisiones, IBAN, rentabilidad y ventajas cara a cara.",
  alternates: {
    canonical: "/comparar",
    languages: {
      es: "/comparar",
      en: "/en/comparar",
    },
  },
};

export default function CompararHubPage() {
  return (
    <main className="py-12 md:py-20">
      <Container>
        <ComparisonHubClient />
      </Container>
    </main>
  );
}
