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
import { useState } from "react";

import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type FormState = "idle" | "submitting" | "success" | "error";

const goals = [
  { value: "viajar", label: "Viajar y pagar en el extranjero", icon: Plane },
  { value: "freelance", label: "Cobrar en USD/GBP como freelancer", icon: Briefcase },
  { value: "empresa", label: "Cuenta para mi empresa o autónomo", icon: Building2 },
  { value: "ahorro", label: "Ahorrar y separar gastos", icon: PiggyBank },
  { value: "principal", label: "Cuenta principal (nómina, recibos)", icon: Sparkles },
  { value: "otro", label: "Otro objetivo", icon: Globe },
];

export default function ContactoPage() {
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
      country: formData.get("country")?.toString().trim() || "No indicado",
      goal: selectedGoal || formData.get("goal")?.toString() || "No indicado",
      message: formData.get("message")?.toString().trim() || "",
      website: formData.get("website")?.toString().trim() || "",
    };

    if (!data.name || !data.email || !data.message) {
      setFormState("error");
      setErrorMessage("Nombre, email y mensaje son obligatorios");
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
        setErrorMessage(result?.error || "Error al enviar. Inténtalo de nuevo.");
        return;
      }

      setFormState("success");
      (e.target as HTMLFormElement).reset();
      setSelectedGoal("");
    } catch {
      setFormState("error");
      setErrorMessage("Error al enviar. Inténtalo de nuevo.");
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
            Respondo en menos de 24h · 7 días a la semana
          </div>

          <h1 className="text-balance text-4xl font-black tracking-tight md:text-6xl">
            Te ayudo a elegir{" "}
            <span className="inline-block border-2 border-secondary bg-accent px-3 py-2 text-accent-foreground shadow-offset-accent">
              tu banco
            </span>
            .
          </h1>

          <p className="mx-auto max-w-3xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg">
            Cuéntame tu situación real (país, ingresos, viajes, empresa…) y te
            digo 1–3 opciones claras que encajan contigo, con criterios y enlaces
            oficiales.
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
                    Nombre
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    required
                    placeholder="Tu nombre"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="tu@email.com"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-sm font-semibold">
                  País (opcional)
                </Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="España, Argentina, México…"
                  className="h-12"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-sm font-semibold">
                  ¿Cuál es tu objetivo?
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
                  Cuéntame tu caso
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  rows={7}
                  placeholder="Detalla tu situación para que pueda ayudarte mejor…"
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
                      <p className="font-black text-accent">¡Mensaje enviado!</p>
                      <p className="text-sm text-secondary-foreground/80">
                        Te responderé en menos de 24h.
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
                  "Enviando…"
                ) : (
                  <>
                    Enviar consulta <Send className="h-5 w-5" />
                  </>
                )}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                <ShieldCheck className="mr-1 inline h-3 w-3" /> Tus datos solo se
                usan para responderte. Nunca spam.
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
                Respuesta clara
              </p>
              <h3 className="mt-4 text-balance text-2xl font-black text-accent">
                Personalizada, sin vueltas
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-3xl font-black text-accent">24h</div>
                  <div className="mt-1 text-[11px] text-secondary-foreground/75">
                    Objetivo de respuesta
                  </div>
                </div>
                <div>
                  <div className="text-3xl font-black text-accent">1–3</div>
                  <div className="mt-1 text-[11px] text-secondary-foreground/75">
                    Opciones recomendadas
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border-2 border-border bg-card p-6 shadow-soft">
              <p className="text-sm italic leading-relaxed text-muted-foreground">
                “En 10 minutos me dijo exactamente qué banco abrir. Llevaba 3
                meses dando vueltas.”
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-border bg-muted font-black text-foreground">
                  M
                </div>
                <div>
                  <div className="font-semibold">Marcos (Argentina)</div>
                  <div className="text-xs text-muted-foreground">
                    Freelancer UI/UX
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
