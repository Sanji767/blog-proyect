// src/components/sections/home/HomeVlogsPreview.tsx

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { vlogs } from "@/lib/vlogs";
import VlogCard from "@/components/vlogs/VlogCard";
import Container from "@/components/layout/Container";

export default function HomeVlogsPreview() {
  const recentVlogs = vlogs.slice(0, 3); // Los 3 más recientes

  return (
    <section className="bg-background py-16 md:py-20">
      <Container className="space-y-6">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold md:text-3xl">
              Últimos vlogs y artículos
            </h2>
            <p className="text-sm text-muted-foreground md:text-base">
              Guías sinceras sobre bancos, comisiones, cuentas multidivisa y cómo
              no liarla al mover tu dinero.
            </p>
          </div>

          <Link
            href="/vlogs"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-5 py-2 text-xs font-semibold text-foreground shadow-sm hover:bg-background/80"
          >
            Ver todos
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {recentVlogs.map((vlog) => (
            <VlogCard key={vlog.slug} vlog={vlog} />
          ))}
        </div>
      </Container>
    </section>
  );
}
