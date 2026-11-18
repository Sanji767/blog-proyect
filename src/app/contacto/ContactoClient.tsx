// src/app/contacto/ContactoClient.tsx
"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Building2,
  CheckCircle,
  Globe,
  MessageCircle,
  PiggyBank,
  Plane,
  Send,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useState, type ComponentType } from "react";

import Container from "@/components/layout/Container";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/lib/i18n";

type FormState = "idle" | "submitting" | "success" | "error";

type GoalItem = {
  value: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const GOALS_BY_LOCALE: Record<Locale, GoalItem[]> = {
  es: [
    { value: "viajar", label: "Viajar y pagar en el extranjero", icon: Plane },
    { value: "freelance", label: "Cobrar en USD/GBP como freelancer", icon: Briefcase },
    { value: "empresa", label: "Cuenta para mi empresa o autónomo", icon: Building2 },
    { value: "ahorro", label: "Ahorrar y separar gastos", icon: PiggyBank },
    { value: "principal", label: "Cuenta principal (nómina, recibos)", icon: Sparkles },
    { value: "otro", label: "Otro objetivo", icon: Globe },
  ],
  en: [
    { value: "viajar", label: "Travel and pay abroad", icon: Plane },
    { value: "freelance", label: "Get paid in USD/GBP as a freelancer", icon: Briefcase },
    { value: "empresa", label: "Account for my business / self-employed", icon: Building2 },
    { value: "ahorro", label: "Save and separate expenses", icon: PiggyBank },
    { value: "principal", label: "Main account (salary, bills)", icon: Sparkles },
    { value: "otro", label: "Other goal", icon: Globe },
  ],
};

const COPY = {
  es: {
    headerKicker: "Respondo en menos de 24h · 7 días a la semana",
    h1Prefix: "Te ayudo a elegir",
    h1Highlight: "tu banco",
    intro:
      "Cuéntame tu situación real (país, ingresos, viajes, empresa…) y te digo 1–3 opciones claras que encajan contigo, con criterios y enlaces oficiales.",
    nameLabel: "Nombre",
    namePlaceholder: "Tu nombre",
    emailLabel: "Email",
    emailPlaceholder: "tu@email.com",
    countryLabel: "País (opcional)",
    countryPlaceholder: "España, Argentina, México…",
    goalLabel: "¿Cuál es tu objetivo?",
    messageLabel: "Cuéntame tu caso",
    messagePlaceholder: "Detalla tu situación para que pueda ayudarte mejor…",
    successTitle: "¡Mensaje enviado!",
    successDesc: "Te responderé en menos de 24h.",
    submitting: "Enviando…",
    submit: "Enviar consulta",
    privacyNote: "Tus datos solo se usan para responderte. Nunca spam.",
    errorRequired: "Nombre, email y mensaje son obligatorios",
    errorSend: "Error al enviar. Inténtalo de nuevo.",
    asideKicker: "Respuesta clara",
    asideTitle: "Personalizada, sin vueltas",
    statResponse: "Objetivo de respuesta",
    statOptions: "Opciones recomendadas",
    testimonial:
      "“En 10 minutos me dijo exactamente qué banco abrir. Llevaba 3 meses dando vueltas.”",
    testimonialName: "Marcos (Argentina)",
    testimonialRole: "Freelancer UI/UX",
    notProvided: "No indicado",
  },
  en: {
    headerKicker: "Reply within 24h · 7 days a week",
    h1Prefix: "I help you choose",
    h1Highlight: "the right bank",
    intro:
      "Tell me your real situation (country, income, travel, business…) and I’ll point you to 1–3 clear options that fit you, with criteria and official links.",
    nameLabel: "Name",
    namePlaceholder: "Your name",
    emailLabel: "Email",
    emailPlaceholder: "you@email.com",
    countryLabel: "Country (optional)",
    countryPlaceholder: "Spain, Argentina, Mexico…",
    goalLabel: "What’s your goal?",
    messageLabel: "Tell me about your situation",
    messagePlaceholder: "Share details so I can help you better…",
    successTitle: "Message sent!",
    successDesc: "I’ll reply within 24 hours.",
    submitting: "Sending…",
    submit: "Send message",
    privacyNote: "Your data is only used to reply. No spam.",
    errorRequired: "Name, email and message are required",
    errorSend: "Could not send. Please try again.",
    asideKicker: "Clear answer",
    asideTitle: "Personalized, straight to the point",
    statResponse: "Response goal",
    statOptions: "Recommended options",
    testimonial:
      "“In 10 minutes he told me exactly which bank to open. I’d been going in circles for 3 months.”",
    testimonialName: "Marcos (Argentina)",
    testimonialRole: "UI/UX freelancer",
    notProvided: "Not provided",
  },
} as const;

export default function ContactoPage() {
  const { locale } = useLocale();
  const copy = COPY[locale];
  const goals = GOALS_BY_LOCALE[locale];

  const [formState, setFormState] = useState<FormState>("idle");
  const [selectedGoal, setSelectedGoal] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString().trim() || "",
      email: formData.get("email")?.toString().trim() || "",
      country: formData.get("country")?.toString().trim() || copy.notProvided,
      goal: selectedGoal || formData.get("goal")?.toString() || copy.notProvided,
      message: formData.get("message")?.toString().trim() || "",
      website: formData.get("website")?.toString().trim() || "",
    };

    if (!data.name || !data.email || !data.message) {
      setFormState("error");
      setErrorMessage(copy.errorRequired);
      return;
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = (await response.json().catch(() => null)) as
        | { ok?: boolean; error?: string }
        | null;

      if (!response.ok) {
        setFormState("error");
        setErrorMessage(locale === "en" ? copy.errorSend : (result?.error || copy.errorSend));
        return;
      }

      setFormState("success");
      (e.target as HTMLFormElement).reset();
      setSelectedGoal("");
    } catch {
      setFormState("error");
      setErrorMessage(copy.errorSend);
    }
  }

  return (
    <section className="border-t border-border bg-background py-16 md:py-24">
      <Container className="max-w-6xl">
        <motion.header
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mx-auto mb-14 max-w-4xl space-y-6 text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border-2 border-secondary bg-accent px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-foreground shadow-offset-accent">
            <MessageCircle className="h-4 w-4" />
            {copy.headerKicker}
          </div>

          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            {copy.h1Prefix}{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              {copy.h1Highlight}
            </span>
            .
          </h1>

          <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            {copy.intro}
          </p>
        </motion.header>

        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft md:p-8"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Honeypot anti-spam (debe quedar vacío) */}
              <input
                type="text"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-semibold">
                    {copy.nameLabel}
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder={copy.namePlaceholder}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    {copy.emailLabel}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder={copy.emailPlaceholder}
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold">
                  {copy.countryLabel}
                </Label>
                <Input
                  id="country"
                  name="country"
                  placeholder={copy.countryPlaceholder}
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  {copy.goalLabel}
                </Label>
                <div className="grid gap-3 sm:grid-cols-2">
                  {goals.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = selectedGoal === goal.value;

                    return (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setSelectedGoal(goal.value)}
                        className={[
                          "relative rounded-xl border-2 p-4 text-left transition-colors",
                          isSelected
                            ? "border-secondary bg-secondary text-secondary-foreground shadow-offset-accent"
                            : "border-border bg-background hover:border-secondary/35 hover:bg-muted/60",
                        ].join(" ")}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={[
                              "rounded-xl border-2 p-2",
                              isSelected
                                ? "border-secondary-foreground/12 bg-secondary-foreground/5 text-accent"
                                : "border-border bg-muted text-primary",
                            ].join(" ")}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-sm font-semibold">
                            {goal.label}
                          </span>
                        </div>

                        {isSelected ? (
                          <CheckCircle className="absolute right-3 top-3 h-5 w-5 text-accent" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
                <input type="hidden" name="goal" value={selectedGoal} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-sm font-semibold">
                  {copy.messageLabel}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder={copy.messagePlaceholder}
                  className="resize-none text-base"
                />
              </div>

              {formState === "success" ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl border-2 border-secondary bg-secondary p-5 text-secondary-foreground shadow-offset-accent"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-7 w-7 text-accent" />
                    <div>
                      <p className="font-black text-accent">{copy.successTitle}</p>
                      <p className="text-sm text-secondary-foreground/80">
                        {copy.successDesc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : null}

              {formState === "error" && errorMessage ? (
                <div className="rounded-2xl border-2 border-destructive bg-destructive/10 p-5 text-sm text-destructive">
                  {errorMessage}
                </div>
              ) : null}

              <Button
                type="submit"
                size="lg"
                disabled={formState === "submitting"}
                className="w-full gap-2"
              >
                {formState === "submitting" ? (
                  copy.submitting
                ) : (
                  <>
                    {copy.submit} <Send className="h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                <ShieldCheck className="mr-1 inline h-3 w-3" /> {copy.privacyNote}
              </p>
            </form>
          </motion.div>

          <motion.aside
            initial={{ opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            <div className="rounded-2xl border-2 border-secondary bg-secondary p-8 text-secondary-foreground shadow-offset-accent">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                {copy.asideKicker}
              </p>
              <h3 className="mt-4 text-balance text-2xl font-black text-accent">
                {copy.asideTitle}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-accent">24h</div>
                  <div className="mt-1 text-[11px] text-secondary-foreground/75">
                    {copy.statResponse}
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-accent">1–3</div>
                  <div className="mt-1 text-[11px] text-secondary-foreground/75">
                    {copy.statOptions}
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                {copy.testimonial}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-muted font-black text-foreground">
                  M
                </div>
                <div>
                  <div className="font-semibold">{copy.testimonialName}</div>
                  <div className="text-xs text-muted-foreground">
                    {copy.testimonialRole}
                  </div>
                </div>
              </div>
            </div>
          </motion.aside>
        </div>
      </Container>
    </section>
  );
}
