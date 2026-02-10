import Link from "next/link";
import { CheckCircle2, FileText, Info, Scale, ShieldCheck } from "lucide-react";
import Container from "@/components/layout/Container";

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
      "Licencia, supervisión, garantía de depósitos (según la entidad) y soporte en español.",
    icon: ShieldCheck,
  },
];

export default function RankingMethodology({ lastUpdatedLabel }: Props) {
  return (
    <section className="border-t border-border bg-background py-12 md:py-16">
      <Container className="space-y-8">
        <header className="space-y-3 text-center">
          <h2 className="text-2xl font-bold md:text-3xl">
            Metodología del ranking
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground md:text-base">
            Ordenamos las recomendaciones con criterios claros y comparables.
            Siempre te dejamos enlaces oficiales para verificar condiciones.
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
              className="rounded-2xl border border-border bg-background/80 p-5 shadow-card"
            >
              <div className="mb-3 inline-flex items-center gap-2">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <item.icon className="h-4 w-4" />
                </span>
                <h3 className="text-base font-semibold md:text-lg">
                  {item.title}
                </h3>
              </div>
              <p className="text-sm text-muted-foreground">
                {item.description}
              </p>
            </article>
          ))}
        </div>

        <div className="flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-2xl border border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground">
            <Info className="h-4 w-4" />
            <p>
              La información puede cambiar. Revisa siempre la web oficial antes
              de abrir cuenta.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/comparativa"
              className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/30 hover:brightness-110"
            >
              Ver comparativa
            </Link>
            <Link
              href="/aviso-afiliados"
              className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-2.5 text-xs font-semibold text-foreground hover:bg-muted"
            >
              Transparencia (afiliados)
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}

