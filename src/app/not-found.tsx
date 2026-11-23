// src/app/not-found.tsx
//
// Página 404 global (C4). Next.js la renderiza para cualquier URL sin ruta
// y cuando una página llama a notFound(). Antes no existía este archivo y
// se servía la página 404 por defecto de Next.js.
//
// OJO: el layout raíz (src/app/layout.tsx) define robots index,follow por
// defecto. Este metadata lo sobrescribe para que las 404 no sean indexables.
// Next.js además inyecta su propio <meta name="robots" content="noindex">
// en las respuestas 404; verificar tras el despliegue que solo queda un
// meta robots (noindex).
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada",
  description:
    "La página que buscas no existe o se ha movido. Vuelve al inicio o explora el blog.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl py-16 text-center md:py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary-text">
        Error 404
      </p>
      <h1 className="mt-4 text-balance text-4xl font-black tracking-tight md:text-6xl">
        Página no encontrada
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
        La página que buscas no existe o se ha movido. Puede que el enlace
        esté desactualizado o que hayas escrito mal la dirección.
      </p>

      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Volver al inicio
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold transition-colors hover:border-foreground/30"
        >
          Ir al blog
        </Link>
        <Link
          href="/en"
          className="inline-flex items-center rounded-full border border-border bg-card px-6 py-3 text-sm font-bold transition-colors hover:border-foreground/30"
        >
          Go to the English homepage
        </Link>
      </div>
    </div>
  );
}
