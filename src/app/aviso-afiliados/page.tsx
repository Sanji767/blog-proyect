import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Afiliados - Finanzas EU",
  description: "Transparencia total: explicamos cómo ganamos dinero y por qué nuestras recomendaciones siguen siendo 100% honestas.",
};

export default function AvisoAfiliados() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black mb-6">Aviso de Afiliados</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead text-lg">En Finanzas EU somos 100% transparentes.</p>
        <p>Algunos enlaces de esta web son de afiliado. Esto significa que si abres cuenta a través de ellos, recibimos una pequeña comisión <strong>sin coste adicional para ti</strong>.</p>
        <p>Esta comisión nos permite mantener la web gratuita y actualizada, pero <strong>nunca influye en nuestras recomendaciones</strong>. Solo recomendamos bancos que nosotros mismos usaríamos.</p>
        <p className="font-bold text-primary">Tu confianza es lo primero.</p>
      </div>
    </article>
  );
}