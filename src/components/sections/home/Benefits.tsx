// src/components/sections/home/Benefits.tsx
import { ShieldCheck, Clock3, Globe2, CreditCard, CheckCircle2 } from "lucide-react";
import Container from "@/components/layout/Container";

type Benefit = {
  icon: React.ReactNode;
  title: string;
  description: string;
  tag?: string;
};

const BENEFITS: Benefit[] = [
  {
    icon: <ShieldCheck className="h-6 w-6" />,
    title: "Bancos regulados en Europa",
    description:
      "Solo analizamos bancos y fintech con licencia y supervisión en la UE o Reino Unido, con protección sobre tus depósitos.",
    tag: "Seguridad",
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Tarjetas sin comisiones ocultas",
    description:
      "Seleccionamos cuentas con tarjetas competitivas para viajar, pagar online y sacar dinero sin sustos.",
    tag: "Uso diario",
  },
  {
    icon: <Globe2 className="h-6 w-6" />,
    title: "Pensado para moverte por Europa",
    description:
      "IBAN europeo, multidivisa y soporte en varios idiomas para quienes viven, trabajan o viajan entre países.",
    tag: "Movilidad",
  },
  {
    icon: <Clock3 className="h-6 w-6" />,
    title: "Te ahorra horas de búsqueda",
    description:
      "En lugar de comparar webs, foros y opiniones una por una, aquí tienes un resumen filtrado y actualizado.",
    tag: "Ahorro de tiempo",
  },
];

export default function Benefits() {
  return (
    <section className="bg-gradient-to-b from-background to-hero-background/40 py-16 md:py-20">
      <Container className="space-y-10">
        {/* Cabecera */}
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-200">
            <CheckCircle2 className="h-3 w-3" />
            Por qué usar Finanzas Eu
          </span>
          <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
            Menos bancos, más claridad. Solo lo que te afecta de verdad.
          </h2>
          <p className="text-sm text-muted-foreground md:text-base">
            En lugar de mostrarte 50 opciones y liarte aún más, filtramos por
            seguridad, comisiones reales, facilidad para abrir cuenta y uso
            práctico en tu día a día.
          </p>
        </div>

        {/* Grid de beneficios */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <article
              key={benefit.title}
              className="flex flex-col gap-3 rounded-2xl border border-border bg-background/75 p-4 shadow-sm backdrop-blur transition-all hover:-translate-y-0.5 hover:border-emerald-500/40 hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-200">
                  {benefit.icon}
                </div>
                {benefit.tag && (
                  <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {benefit.tag}
                  </span>
                )}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">{benefit.title}</h3>
                <p className="text-xs text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
