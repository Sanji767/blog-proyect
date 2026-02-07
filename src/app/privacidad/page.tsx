import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | FinanzasEU",
  description:
    "Información sobre privacidad en FinanzasEU: qué datos se recogen, para qué se usan y cómo protegemos tu información.",
};

export default function Privacidad() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-4xl font-black mb-6">Política de Privacidad</h1>
      <div className="prose dark:prose-invert">
        <p>
          En FinanzasEU no vendemos ni compartimos tus datos personales. Nuestro
          objetivo es ofrecer información útil sin invadir tu privacidad.
        </p>
        <p>
          Usamos analítica agregada para entender qué contenidos funcionan mejor
          y mejorar la web (por ejemplo, Google Analytics configurado de forma
          anónima). No utilizamos cookies de remarketing ni publicidad
          personalizada.
        </p>
        <p>
          Si tienes dudas, escríbenos a{" "}
          <a href="mailto:hola@finanzaseu.com">hola@finanzaseu.com</a>.
        </p>
      </div>
    </article>
  );
}
