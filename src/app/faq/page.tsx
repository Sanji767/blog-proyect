// src/app/faq/page.tsx
import Container from "@/components/layout/Container";

type FaqItem = {
  question: string;
  answer: string;
};

type FaqGroup = {
  title: string;
  items: FaqItem[];
};

const faqGroups: FaqGroup[] = [
  {
    title: "Generales",
    items: [
      {
        question: "¿Qué es exactamente Bancos Europa?",
        answer:
          "Bancos Europa es una web informativa donde recopilo, analizo y comparo distintos bancos y cuentas que operan en Europa. No soy un banco ni una entidad financiera: mi objetivo es ayudarte a entender las opciones que tienes y a elegir la que mejor encaje contigo.",
      },
      {
        question: "¿En qué países aplican las recomendaciones?",
        answer:
          "Principalmente me centro en bancos y cuentas que se pueden abrir viviendo en España o en otros países de Europa. Algunos bancos aceptan también clientes desde Latinoamérica u otras regiones; cuando es así, lo indico en la ficha de cada programa.",
      },
      {
        question: "¿La información está siempre actualizada?",
        answer:
          "Intento mantener la información lo más actualizada posible: comisiones, límites, países admitidos, etc. Aun así, los bancos pueden cambiar condiciones en cualquier momento, por lo que siempre recomiendo revisar la web oficial antes de abrir la cuenta.",
      },
    ],
  },
  {
    title: "Sobre bancos y cuentas",
    items: [
      {
        question: "¿Qué diferencia hay entre neobancos y bancos tradicionales?",
        answer:
          "Un neobanco suele operar principalmente a través de una app móvil, con menos oficinas físicas y procesos más rápidos. Los bancos tradicionales tienen estructuras más grandes, más productos y muchas veces más burocracia. En Bancos Europa incluyo ambos tipos y lo indico en la ficha de cada entidad.",
      },
      {
        question: "¿Puedo usar estos bancos como cuenta principal?",
        answer:
          "Depende del banco y de tu situación. Algunos neobancos funcionan muy bien como cuenta principal (nómina, recibos, gastos diarios) y otros son mejores como cuenta secundaria para viajes, multidivisa o compras online. En la ficha de cada banco suelo indicar para qué casos es más recomendable.",
      },
      {
        question: "¿Qué es una cuenta multidivisa y cuándo me interesa?",
        answer:
          "Una cuenta multidivisa te permite tener saldo en distintas monedas (por ejemplo EUR, USD, GBP, CHF…) dentro de la misma app o banco. Es interesante si cobras en varias divisas, trabajas en remoto para otros países, viajas mucho o haces compras online frecuentes en otras monedas.",
      },
    ],
  },
  {
    title: "Apertura de cuenta y requisitos",
    items: [
      {
        question: "¿Puedo abrir cuenta si no vivo en Europa?",
        answer:
          "Algunos bancos sí aceptan clientes no residentes en la UE, otros no. Depende de la regulación de cada entidad y de tu país de residencia. En cada ficha indico si el banco suele aceptar no residentes, pero en casos muy concretos conviene confirmar siempre en la web oficial.",
      },
      {
        question: "¿Qué documentos suelen pedir para abrir la cuenta?",
        answer:
          "Lo más habitual es que pidan un documento de identidad (DNI, NIE o pasaporte), un selfie o verificación con la cámara del móvil, y en algunos casos un justificante de domicilio o datos fiscales. El proceso suele ser 100% online y bastante rápido.",
      },
      {
        question: "¿Cuánto tarda en abrirse la cuenta?",
        answer:
          "En muchos neobancos, la cuenta se abre en cuestión de minutos si todo va bien con la verificación. En bancos más tradicionales puede tardar algo más. Si hay revisiones adicionales (por ejemplo por tu país de residencia o actividad), el proceso puede alargarse varios días.",
      },
    ],
  },
  {
    title: "Seguridad, comisiones y afiliación",
    items: [
      {
        question: "¿Es seguro usar estos bancos y tarjetas?",
        answer:
          "Los bancos que se listan suelen estar regulados en su país de origen y muchos cuentan con sistemas de protección de depósitos (como el fondo de garantía hasta 100.000 € en la UE). Aun así, siempre es buena práctica no concentrar todos tus ahorros en una sola entidad y usar contraseñas seguras y autenticación en dos pasos.",
      },
      {
        question: "¿Ganas dinero si abro una cuenta desde tus enlaces?",
        answer:
          "En algunos bancos utilizo enlaces de afiliado. Eso significa que, si finalmente abres cuenta desde uno de esos enlaces, puedo recibir una pequeña comisión sin que a ti te cueste más. Esto me ayuda a mantener el proyecto, pero no cambia mi objetivo: explicar pros y contras de cada banco de forma clara.",
      },
      {
        question: "¿Me cobras algo por usar la web o pedir recomendación?",
        answer:
          "No. La web es gratuita para ti. Si me escribes por el formulario de contacto para comentarme tu caso, tampoco tiene ningún coste. Mi objetivo es ayudarte a entender mejor tus opciones y, si te encaja, que uses mis enlaces para apoyar el proyecto.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <section className="py-12 md:py-16">
      <Container className="space-y-10">
        {/* Encabezado */}
        <header className="text-center space-y-3">
          <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            Preguntas frecuentes
          </span>
          <h1 className="text-3xl md:text-4xl font-bold">
            FAQ sobre bancos europeos, cuentas y apertura online
          </h1>
          <p className="max-w-2xl mx-auto text-sm md:text-base text-muted-foreground">
            Aquí respondo a las dudas más habituales sobre el uso de bancos y
            cuentas en Europa: requisitos, seguridad, tipos de cuentas y cómo
            encaja todo esto si vives o trabajas fuera de tu país.
          </p>
        </header>

        {/* Listado de grupos */}
        <div className="space-y-8">
          {faqGroups.map((group) => (
            <section key={group.title} className="space-y-4">
              <h2 className="text-xl md:text-2xl font-semibold">
                {group.title}
              </h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-2xl border border-border bg-background p-4 md:p-5 text-sm"
                  >
                    <summary className="cursor-pointer list-none font-medium flex items-center justify-between gap-3">
                      <span>{item.question}</span>
                      <span className="text-xs text-muted-foreground group-open:hidden">
                        Ver respuesta
                      </span>
                      <span className="text-xs text-muted-foreground hidden group-open:inline">
                        Ocultar
                      </span>
                    </summary>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* CTA final */}
        <section className="rounded-3xl bg-hero-background/70 border border-border p-6 md:p-8 text-center space-y-4">
          <h2 className="text-xl md:text-2xl font-bold">
            ¿Sigues teniendo dudas sobre qué banco elegir?
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
            Si tu caso es un poco más especial (trabajas en remoto, vives fuera
            de España, tienes empresa, etc.), puedes escribirme y te doy una
            recomendación más ajustada a tu situación.
          </p>
          <a
            href="/contacto"
            className="inline-flex items-center justify-center rounded-full bg-primary px-7 py-3 text-sm font-semibold text-black shadow-soft hover:brightness-105 transition"
          >
            Ir a contacto →
          </a>
        </section>
      </Container>
    </section>
  );
}
