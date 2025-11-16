// src/app/ventajas/page.tsx
import Container from "@/components/layout/Container";
import { FaCheckCircle, FaGlobeEurope, FaLock, FaMoneyBillWave, FaWallet } from "react-icons/fa";
import { HiRocketLaunch } from "react-icons/hi2";

export default function VentajasPage() {
  return (
    <section className="py-12 md:py-16">
      <Container className="space-y-12">
        
        {/* Encabezado */}
        <header className="text-center space-y-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Ventajas
          </span>

          <h1 className="text-3xl md:text-4xl font-bold">
            ¿Por qué usar <span className="text-primary">Bancos Europa</span>?
          </h1>

          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            Te ayudamos a elegir la mejor cuenta o banco europeo según tu país, tus necesidades y tu estilo de vida.
            Todo explicado de manera clara, directa y sin letra pequeña.
          </p>
        </header>

        {/* Grid de ventajas */}
        <div className="grid gap-6 md:grid-cols-3">
          <VentajaCard
            icon={<FaGlobeEurope className="text-primary w-7 h-7" />}
            title="Cuentas que aceptan no residentes"
            description="Mostramos bancos y cuentas europeas que permiten abrir desde España, Latinoamérica o viviendo en otro país."
          />

          <VentajaCard
            icon={<FaMoneyBillWave className="text-primary w-7 h-7" />}
            title="Compara comisiones reales"
            description="Sin mareos. Comparamos límites, retiros en cajeros, cambios de divisas y costes ocultos."
          />

          <VentajaCard
            icon={<FaWallet className="text-primary w-7 h-7" />}
            title="Cuentas multidivisa"
            description="Encuentra fácilmente bancos con EUR, USD, GBP, CHF y más. Perfecto para freelancers o viajeros."
          />

          <VentajaCard
            icon={<FaLock className="text-primary w-7 h-7" />}
            title="Información segura y actualizada"
            description="Todos los datos se revisan constantemente para mantener precisión en fees, IBAN y requisitos."
          />

          <VentajaCard
            icon={<FaCheckCircle className="text-primary w-7 h-7" />}
            title="Recomendaciones según tu perfil"
            description="¿Eres viajero? ¿Autónomo? ¿Trabajas en Suiza? Te mostramos opciones concretas para tu caso."
          />

          <VentajaCard
            icon={<HiRocketLaunch className="text-primary w-7 h-7" />}
            title="Apertura rápida 100% online"
            description="Los bancos que recomendamos permiten abrir la cuenta en minutos, con verificación por móvil."
          />
        </div>

        {/* Sección comparativa */}
        <section className="rounded-3xl border border-border bg-background p-6 md:p-10 shadow-card">
          <h2 className="text-2xl font-bold mb-4 text-center">¿Cómo te ayudamos a elegir?</h2>

          <div className="grid gap-8 md:grid-cols-3">
            <StepCard
              number="1"
              title="Analizamos tus necesidades"
              description="Recomendamos bancos según si necesitas multidivisa, tarjeta física, IBAN europeo, o si estás fuera de la UE."
            />
            <StepCard
              number="2"
              title="Comparamos ventajas reales"
              description="Comparamos comisiones, límites, países aceptados y soporte. Nada de datos comerciales inflados."
            />
            <StepCard
              number="3"
              title="Te damos la mejor opción"
              description="Te indicamos qué banco encaja mejor contigo. Sin complicaciones, sin sesgos."
            />
          </div>
        </section>

        {/* CTA final */}
        <section className="rounded-3xl bg-hero-background/70 border border-border shadow-card p-6 md:p-10 text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold">
            ¿Quieres saber cuál es el mejor banco para ti?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Cuéntame en qué país vives, si necesitas tarjeta, o si trabajas en remoto.
            Te recomendaré la mejor cuenta según tu caso concreto.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3 text-sm md:text-base font-semibold text-black hover:brightness-105 transition shadow-soft"
          >
            Hablar conmigo →
          </a>
        </section>

      </Container>
    </section>
  );
}


// COMPONENTES DE APOYO
function VentajaCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-6 shadow-card flex flex-col gap-3">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center space-y-3">
      <div className="mx-auto w-14 h-14 rounded-full bg-primary text-black flex items-center justify-center text-xl font-bold shadow-soft">
        {number}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
