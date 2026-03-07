import Link from "next/link";
import { CheckCircle2, FileText, Info, Scale, ShieldCheck } from "lucide-react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";

type Props = {
  lastUpdatedLabel?: string;
};

const criteria = [
  {
    title: "Costes y letra pequeña",
    description:
      "Cuota, cajeros, cambio de divisa, transferencias y condiciones del plan gratuito.",
    icon: Scale,
  },
  {
    title: "IBAN y operativa real",
    description:
      "Prefijo/país de IBAN, SEPA y detalles prácticos para cobrar nómina, pagar y domiciliar.",
    icon: CheckCircle2,
  },
  {
    title: "Requisitos y países admitidos",
    description:
      "Documentación, residencia, proceso de alta y lista de países aceptados cuando aplica.",
    icon: FileText,
  },
  {
    title: "Seguridad y soporte",
    description:
      "Licencia, supervisión, garantías (según entidad) y soporte en español.",
    icon: ShieldCheck,
  },
];

export default function RankingMethodology({ lastUpdatedLabel }: Props) {
  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <Container className="space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            Transparencia
          </p>

          <h2 className="text-balance text-3xl font-black tracking-tight md:text-5xl">
            Metodología del{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              ranking
            </span>
          </h2>

          <p className="mx-auto max-w-2xl text-pretty text-sm leading-relaxed text-muted-foreground md:text-base">
            Ordenamos recomendaciones con criterios comparables y enlaces
            oficiales para verificar condiciones.
          </p>

          {lastUpdatedLabel ? (
            <p className="text-xs text-muted-foreground">
              Última actualización del dataset:{" "}
              <strong className="font-semibold text-foreground">
                {lastUpdatedLabel}
              </strong>
            </p>
          ) : null}
        </header>

        <div className="grid gap-4 md:grid-cols-2">
          {criteria.map((item) => (
            <article
              key={item.title}
              className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft"
            >
              <div className="mb-3 inline-flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border-2 border-border bg-muted text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <h3 className="text-base font-black tracking-tight md:text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl border-2 border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>
              La información puede cambiar. Revisa siempre la web oficial antes
              de abrir cuenta.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button asChild>
              <Link href="/comparativa">Ver comparativa</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/aviso-afiliados">Transparencia (afiliados)</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

