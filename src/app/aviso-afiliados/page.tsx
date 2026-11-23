import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aviso de Afiliados - FinanzasEU",
  description: "Transparencia total: FinanzasEU no gana nada con los enlaces salientes. Explicamos cómo funciona hoy y qué cambiaría si eso cambia.",
  alternates: {
    canonical: "/aviso-afiliados",
    languages: {
      es: "/aviso-afiliados",
      en: "/en/aviso-afiliados",
    },
  },
};

export default function AvisoAfiliados() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black mb-6">Aviso de Afiliados</h1>
      <div className="prose dark:prose-invert max-w-none">
        <p className="lead text-lg">En FinanzasEU somos 100% transparentes.</p>
        <p>Actualmente, <strong>ningún enlace de esta web es un enlace de afiliado</strong>: los enlaces a bancos y entidades son enlaces directos a sus webs oficiales, y FinanzasEU no recibe ninguna comisión si abres cuenta a través de ellos.</p>
        <p>Si en el futuro incorporamos enlaces de afiliado, lo indicaremos claramente en cada página afectada y actualizaremos este aviso. En cualquier caso, <strong>ninguna comisión influirá jamás en nuestras recomendaciones</strong>: solo recomendamos bancos que nosotros mismos usaríamos.</p>
        <p className="font-bold text-primary">Tu confianza es lo primero.</p>
      </div>
    </article>
  );
}
