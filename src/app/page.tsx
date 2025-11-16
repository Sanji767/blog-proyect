// src/app/page.tsx

import Link from "next/link";
import Container from "@/components/layout/Container";

export default function HomePage() {
  return (
    <>
      {/* HERO PRINCIPAL */}
      <section className="bg-hero-background py-16 md:py-24">
        <Container className="grid items-center gap-10 md:grid-cols-2">
          <div className="space-y-5">
            <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              Bancos Europa
            </span>

            <h1 className="text-3xl font-bold md:text-5xl">
              Abre tu cuenta en bancos europeos{" "}
              <span className="text-primary">sin complicaciones</span>.
            </h1>

            <p className="max-w-xl text-sm text-muted-foreground md:text-base">
              Comparamos bancos como Revolut, N26, Wise o Bunq para ayudarte a
              elegir la mejor cuenta según tu país, tu forma de trabajar y si
              necesitas multidivisa, tarjeta física o IBAN europeo.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/programas/revolut"
                className="inline-flex items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-black shadow-md hover:brightness-105"
              >
                Ver banco recomendado →
              </Link>
              <Link
                href="/bancos"
                className="inline-flex items-center justify-center rounded-full border border-border px-6 py-2.5 text-sm font-semibold text-foreground hover:bg-background/60"
              >
                Ver todos los bancos
              </Link>
            </div>

            <ul className="mt-4 grid gap-2 text-xs text-muted-foreground md:text-sm">
              <li>• Bancos que aceptan no residentes en varios casos.</li>
              <li>• Información clara sobre comisiones y límites.</li>
              <li>• Ideal para viajeros, remotos, freelancers y expatriados.</li>
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-background p-5 shadow-card">
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
              Resumen rápido
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">
                  Bancos analizados
                </span>
                <span className="font-semibold">Revolut, N26, Wise, Bunq…</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Tipo de cuentas</span>
                <span className="font-semibold">
                  Neobancos, multidivisa, online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Enfoque</span>
                <span className="font-semibold">Claro y sin letra pequeña</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Coste para ti</span>
                <span className="font-semibold">0€ (web gratuita)</span>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* BLOQUE VENTAJAS RÁPIDAS */}
      <section className="py-12 md:py-16">
        <Container>
          <div className="mb-8 space-y-2 text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              ¿Qué consigues usando Bancos Europa?
            </h2>
            <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
              En lugar de perder horas saltando entre webs de bancos, tienes una
              comparativa clara y recomendaciones concretas según tu caso.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <AdvantageCard
              title="Ahorro de tiempo"
              description="Te resumo lo importante: comisiones, países aceptados, IBAN, límites y para quién tiene sentido cada banco."
            />
            <AdvantageCard
              title="Mejor decisión"
              description="No se trata solo de abrir cuenta, sino de elegir la que encaje con tu forma de vivir, trabajar o viajar."
            />
            <AdvantageCard
              title="Ayuda personalizada"
              description="Si tienes dudas concretas, puedes escribirme en la sección de contacto y te oriento sin coste."
            />
          </div>
        </Container>
      </section>

      {/* CTA FINAL SIMPLE */}
      <section className="border-t border-border bg-hero-background/70 py-12 md:py-16">
        <Container className="text-center space-y-4">
          <h2 className="text-2xl font-bold md:text-3xl">
            ¿No sabes por dónde empezar?
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            Empieza comparando los bancos más utilizados por viajeros, remotos
            y personas que trabajan con varias divisas. Luego, si quieres, me
            preguntas por tu caso concreto.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/bancos"
              className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-2.5 text-sm font-semibold text-black shadow-md hover:brightness-105"
            >
              Ver bancos recomendados →
            </Link>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center rounded-full border border-border px-7 py-2.5 text-sm font-semibold text-foreground hover:bg-background/70"
            >
              Preguntarme directamente
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

function AdvantageCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex h-full flex-col gap-2 rounded-2xl border border-border bg-background p-5 shadow-card">
      <h3 className="text-base font-semibold md:text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
