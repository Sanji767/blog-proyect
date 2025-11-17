// src/components/programas/RelatedBanks.tsx
import BankCard from "@/components/bancos/BankCard";
import { banks, type Bank } from "@/lib/banks";

type RelatedBanksProps = {
  currentBank: Bank;
};

export default function RelatedBanks({ currentBank }: RelatedBanksProps) {
  const related = banks
    .filter((bank) => bank.slug !== currentBank.slug)
    .map((bank) => {
      // score simple: +2 si misma categoría, +1 por cada tag en común
      const sameCategoryScore = bank.category === currentBank.category ? 2 : 0;
      const commonTags = bank.tags.filter((tag) =>
        currentBank.tags.includes(tag),
      ).length;

      return {
        bank,
        score: sameCategoryScore + commonTags,
      };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.bank);

  if (related.length === 0) return null;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">
        Otros bancos que también te pueden encajar
      </h2>
      <p className="text-sm text-muted-foreground">
        Estos bancos son similares por tipo o por cómo funcionan. Pueden ser una
        buena alternativa si quieres comparar antes de decidirte.
      </p>
      <div className="grid gap-6 md:grid-cols-3">
        {related.map((bank) => (
          <BankCard key={bank.slug} bank={bank} showDirectLink={false} />
        ))}
      </div>
    </section>
  );
}
