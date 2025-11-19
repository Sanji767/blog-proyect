// src/app/faq/page.tsx
"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Container from "@/components/layout/Container";
import {
  ChevronDown,
  MessageCircle,
  Sparkles,
  Shield,
  Globe,
  Clock,
  Euro,
  HelpCircle,
  ArrowRight,
} from "lucide-react";

type FaqItem = { question: string; answer: string };
type FaqGroup = { title: string; items: FaqItem[]; icon?: React.ReactNode };

const faqGroups: FaqGroup[] = [
  {
    title: "Generales",
    icon: <HelpCircle className="h-6 w-6" />,
    items: [
      {
        question: "¿Qué es exactamente Bancos Europa?",
        answer:
          "Bancos Europa es la guía independiente más completa de banca digital en Europa. Analizo personalmente cada banco: comisiones reales, requisitos, velocidad de apertura, soporte en español… Todo sin filtros ni patrocinados ocultos. Mi objetivo: que elijas la cuenta perfecta sin perder tiempo ni dinero.",
      },
      {
        question: "¿En qué países aplican las recomendaciones?",
        answer:
          "Me centro en cuentas que puedes abrir desde España y cualquier país de la Unión Europea. También incluyo opciones para residentes en Latinoamérica, nómadas digitales y freelancers internacionales. En cada ficha indico exactamente qué países acepta cada banco.",
      },
      {
        question: "¿La información está siempre actualizada?",
        answer:
          "Sí. Reviso condiciones cada semana. Cuando un banco cambia comisiones, requisitos o países admitidos, actualizo la ficha en muy poco tiempo. Si ves algo raro, escríbeme y lo corrijo cuanto antes.",
      },
    ],
  },
  {
    title: "Tipos de bancos y cuentas",
    icon: <Sparkles className="h-6 w-6" />,
    items: [
      {
        question: "¿Qué diferencia hay entre neobancos y bancos tradicionales?",
        answer:
          "Neobancos (N26, Revolut, Bunq…) = 100% app, apertura en 5 minutos, pocas oficinas.\nBancos tradicionales (ING, Santander, Deutsche Bank…) = más productos (hipotecas, préstamos), pero más burocracia.\nYo te digo cuál usar como cuenta principal y cuál como secundaria según tu estilo de vida.",
      },
      {
        question: "¿Puedo usar estos bancos como cuenta principal?",
        answer:
          "Sí. Miles de usuarios ya usan N26, Revolut o Bunq como cuenta principal para nómina, recibos y gastos diarios. En cada análisis te digo si el banco permite domiciliaciones SEPA, ingreso de nómina, recibos habituales, etc.",
      },
      {
        question: "¿Qué es una cuenta multidivisa y cuándo me interesa?",
        answer:
          "Es una cuenta donde puedes tener EUR, USD, GBP, CHF, etc. al mismo tiempo y cambiar entre ellas al tipo de cambio real (sin comisiones ocultas).\nTe interesa si:\n• Cobras en dólares o libras\n• Viajas mucho\n• Haces compras en Amazon USA, UK, etc.\n• Eres nómada digital o freelancer internacional",
      },
    ],
  },
  {
    title: "Apertura y requisitos",
    icon: <Clock className="h-6 w-6" />,
    items: [
      {
        question: "¿Puedo abrir cuenta si no vivo en Europa?",
        answer:
          "Sí, cada vez más. Hay bancos que aceptan residentes en México, Argentina, Colombia, Perú, Chile… y hasta en países fuera de Latinoamérica. En cada ficha tienes un apartado “Países aceptados” con la lista actualizada.",
      },
      {
        question: "¿Qué documentos suelen pedir?",
        answer:
          "99% online:\n• DNI / NIE / Pasaporte\n• Selfie + verificación facial\n• A veces: justificante de domicilio o vídeo-identificación\nNo necesitas ir a ninguna oficina.",
      },
      {
        question: "¿Cuánto tarda en abrirse la cuenta?",
        answer:
          "• Neobancos: 3–10 minutos (Revolut, N26, Wise)\n• Bancos tradicionales online: 1–3 días (ING, Bunq Premium)\n• Con revisión manual: hasta 7 días (si tu país de residencia no es de la UE)",
      },
    ],
  },
  {
    title: "Seguridad, dinero y transparencia",
    icon: <Shield className="h-6 w-6" />,
    items: [
      {
        question: "¿Es seguro usar estos bancos?",
        answer:
          "Sí. Todos los bancos que recomiendo están regulados en la UE y tus depósitos están protegidos hasta 100.000 € por el fondo de garantía del país correspondiente (Alemania, Lituania, Países Bajos…). Además usan autenticación biométrica, tarjetas virtuales desechables y bloqueo instantáneo desde la app.",
      },
      {
        question: "¿Ganas dinero si abro cuenta desde tus enlaces?",
        answer:
          "Sí, en algunos bancos tengo acuerdo de afiliación. Eso significa que si abres cuenta desde mi enlace, yo recibo una comisión (entre 10 y 100 €) que el banco paga de su bolsillo. A ti NO te cuesta nada extra, y muchas veces consigues bonus exclusivos que no están en la web oficial.",
      },
      {
        question: "¿Me cobras algo por la web o por ayudarte?",
        answer:
          "Nunca. La web es 100% gratuita. Si me escribes por email o a través del formulario de contacto para que te recomiende el mejor banco para tu caso concreto (freelancer, empresa, nómada, etc.), también es gratis. Solo te pido que, si te ayudo, uses mis enlaces para apoyar el proyecto.",
      },
    ],
  },
];

const quickFacts = [
  {
    icon: <Globe className="h-5 w-5" />,
    label: "Países",
    value: "Europa + Latam",
    description: "Opciones para residentes en la UE y fuera de ella.",
  },
  {
    icon: <Clock className="h-5 w-5" />,
    label: "Tiempo medio",
    value: "5–10 min",
    description: "Aperturas 100% online en los principales neobancos.",
  },
  {
    icon: <Euro className="h-5 w-5" />,
    label: "Coste",
    value: "Desde 0 €/mes",
    description: "Cuentas gratuitas y planes avanzados según tu perfil.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="py-16 md:py-24 overflow-hidden">
      <Container className="max-w-6xl space-y-16">
        {/* Hero épico */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs md:text-sm font-semibold text-primary">
            <MessageCircle className="h-4 w-4" />
            Más de 25.000 personas ya han usado esta guía
          </div>

          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
            Todas tus dudas de banca,<br className="hidden md:block" />
            resueltas en minutos
          </h1>

          <p className="text-base md:text-xl text-muted-foreground max-w-3xl md:max-w-4xl mx-auto">
            Esta página reúne las preguntas que más se repiten sobre bancos europeos, neobancos
            y cuentas para nómadas, freelancers y empresas. Si tu caso es más raro, al final
            encontrarás cómo contarme tu situación para que te responda personalmente.
          </p>
        </motion.div>

        {/* Quick facts / resumen visual */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid gap-4 md:grid-cols-3"
        >
          {quickFacts.map((fact) => (
            <div
              key={fact.label}
              className="rounded-2xl border border-border/60 bg-card/80 p-5 flex flex-col gap-2 shadow-sm"
            >
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {fact.icon}
                </span>
                {fact.label}
              </div>
              <div className="text-2xl font-bold text-foreground">{fact.value}</div>
              <p className="text-sm text-muted-foreground">{fact.description}</p>
            </div>
          ))}
        </motion.div>

        {/* FAQ con acordeón brutal */}
        <div className="space-y-12">
          {faqGroups.map((group, groupIdx) => (
            <motion.section
              key={group.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: groupIdx * 0.08 }}
              className="space-y-6"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="rounded-2xl bg-primary/10 p-4 text-primary">
                    {group.icon}
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold">{group.title}</h2>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground max-w-md md:text-right">
                  Preguntas reales que me han hecho cientos de veces sobre{" "}
                  <span className="font-semibold lowercase">{group.title}</span>.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {group.items.map((item, idx) => {
                  const globalIndex = groupIdx * 10 + idx;
                  const isOpen = openIndex === globalIndex;

                  return (
                    <motion.article
                      key={globalIndex}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ delay: idx * 0.04 }}
                      className="group"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenIndex(isOpen ? null : globalIndex)
                        }
                        className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 rounded-2xl"
                      >
                        <div className="rounded-2xl border-2 border-border/50 bg-card/80 p-6 transition-all hover:border-primary/60 hover:shadow-xl group-hover:bg-card">
                          <div className="flex items-start justify-between gap-4">
                            <h3 className="text-base md:text-lg font-semibold text-foreground pr-6">
                              {item.question}
                            </h3>
                            <motion.div
                              animate={{ rotate: isOpen ? 180 : 0 }}
                              transition={{ duration: 0.25 }}
                              className="flex-shrink-0 mt-1"
                            >
                              <ChevronDown className="h-5 w-5 text-primary" />
                            </motion.div>
                          </div>

                          <motion.div
                            initial={false}
                            animate={{
                              height: isOpen ? "auto" : 0,
                              marginTop: isOpen ? 16 : 0,
                              opacity: isOpen ? 1 : 0,
                            }}
                            className="overflow-hidden"
                          >
                            <p className="text-sm md:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                              {item.answer}
                            </p>
                          </motion.div>
                        </div>
                      </button>
                    </motion.article>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>

        {/* CTA Final épico – sin WhatsApp, full pro */}
        <motion.section
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-1 shadow-2xl"
        >
          <div className="rounded-3xl bg-background p-8 md:p-12 lg:p-16 text-center space-y-8">
            <div className="flex justify-center">
              <div className="rounded-full bg-primary/10 p-6">
                <MessageCircle className="h-12 w-12 md:h-16 md:w-16 text-primary" />
              </div>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-black">
                ¿Tu caso es un poco “complicado”?
              </h2>
              <p className="text-base md:text-xl text-muted-foreground">
                Freelancer en dólares, empresa en Estonia, nómada digital, residente en Latinoamérica,
                familia con cuentas conjuntas… Si tu situación no encaja en las FAQ, escríbeme
                y te digo qué banco usar como principal y cuál como apoyo.
              </p>
              <p className="text-sm md:text-base text-muted-foreground">
                Me lees gratis, te respondo gratis. Lo único que te pido es que, si te ayudo,
                uses mis enlaces para abrir tu cuenta y así apoyas el proyecto.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href="/contacto"
                className="inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 md:py-5 text-base md:text-lg font-bold text-primary-foreground shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                Analiza mi caso
                <ArrowRight className="h-5 w-5 md:h-6 md:w-6" />
              </Link>

              <Link
                href="/"
                className="inline-flex items-center gap-3 rounded-full bg-background/80 px-8 py-4 md:py-5 text-base md:text-lg font-semibold text-primary border border-primary/40 shadow-sm hover:border-primary hover:shadow-md hover:scale-105 transition-all"
              >
                Ver bancos recomendados
                <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
              </Link>
            </div>
          </div>
        </motion.section>
      </Container>
    </section>
  );
}
