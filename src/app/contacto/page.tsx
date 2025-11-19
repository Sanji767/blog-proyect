// src/app/contacto/page.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Container from "@/components/layout/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Send,
  MessageCircle,
  CheckCircle,
  Globe,
  Briefcase,
  Plane,
  PiggyBank,
  Building2,
  Sparkles,
  ShieldCheck
} from "lucide-react";

type FormState = "idle" | "submitting" | "success" | "error";

const goals = [
  { value: "viajar", label: "Viajar y pagar en el extranjero", icon: Plane, color: "text-blue-600" },
  { value: "freelance", label: "Cobrar en USD/GBP como freelancer", icon: Briefcase, color: "text-purple-600" },
  { value: "empresa", label: "Cuenta para mi empresa o autónomo", icon: Building2, color: "text-emerald-600" },
  { value: "ahorro", label: "Ahorrar y separar gastos", icon: PiggyBank, color: "text-pink-600" },
  { value: "principal", label: "Cuenta principal (nómina, recibos)", icon: Sparkles, color: "text-yellow-600" },
  { value: "otro", label: "Otro objetivo", icon: Globe, color: "text-indigo-600" },
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
    };

    if (!data.name || !data.email || !data.message) {
      setFormState("error");
      setErrorMessage("Nombre, email y mensaje son obligatorios");
      return;
    }

    try {
      console.log("Enviando consulta:", data);
      await new Promise(resolve => setTimeout(resolve, 1200));
      setFormState("success");
      (e.target as HTMLFormElement).reset();
      setSelectedGoal("");
    } catch {
      setFormState("error");
      setErrorMessage("Error al enviar. Inténtalo de nuevo.");
    }
  }

  return (
    <section className="py-16 md:py-24 overflow-hidden bg-gradient-to-b from-background to-muted/30">
      <Container className="max-w-5xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6 mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary">
            <MessageCircle className="h-5 w-5" />
            Respondo en menos de 24h · 7 días a la semana
          </div>

          <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent leading-tight">
            Te ayudo a elegir<br />tu banco perfecto
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Cuéntame tu situación real (país, ingresos, viajes, empresa…) y en menos de 24h te digo
            <strong className="text-foreground"> exactamente cuál es el mejor banco para ti</strong>
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Formulario */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">Nombre</Label>
                  <Input id="name" name="name" type="text" required placeholder="Juan Pérez" className="h-14 text-base" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-base font-semibold">Email</Label>
                  <Input id="email" name="email" type="email" required placeholder="juan@ejemplo.com" className="h-14 text-base" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="country" className="text-base font-semibold">País donde vives ahora (importante)</Label>
                <Input id="country" name="country" type="text" placeholder="España, México, Argentina..." className="h-14 text-base" />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-semibold">¿Para qué necesitas la cuenta?</Label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {goals.map((goal) => {
                    const Icon = goal.icon;
                    const isSelected = selectedGoal === goal.value;
                    return (
                      <button
                        key={goal.value}
                        type="button"
                        onClick={() => setSelectedGoal(goal.value)}
                        className={`relative rounded-2xl border-2 p-4 text-left transition-all ${
                          isSelected ? "border-primary bg-primary/10 shadow-lg" : "border-border hover:border-primary/50 hover:bg-muted/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-xl ${isSelected ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            <Icon className={`h-5 w-5 ${isSelected ? "text-primary-foreground" : goal.color}`} />
                          </div>
                          <span className="font-medium text-sm">{goal.label}</span>
                        </div>
                        {isSelected && <CheckCircle className="absolute top-3 right-3 h-5 w-5 text-primary" />}
                        <input type="hidden" name="goal" value={selectedGoal} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="message" className="text-base font-semibold">Cuéntame tu caso</Label>
                <Textarea id="message" name="message" required rows={6} placeholder="Detalla tu situación para que pueda ayudarte mejor..." className="text-base resize-none" />
              </div>

              {formState === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-5 flex items-center gap-3"
                >
                  <CheckCircle className="h-8 w-8 text-emerald-600" />
                  <div>
                    <p className="font-bold text-emerald-800 dark:text-emerald-300">¡Mensaje enviado!</p>
                    <p className="text-sm text-emerald-700 dark:text-emerald-400">Te responderé en menos de 24h</p>
                  </div>
                </motion.div>
              )}

              {formState === "error" && errorMessage && (
                <div className="rounded-2xl bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 p-5 text-red-700 dark:text-red-300">
                  {errorMessage}
                </div>
              )}

              <Button type="submit" size="lg" disabled={formState === "submitting"} className="w-full h-16 text-lg font-bold rounded-2xl shadow-xl hover:scale-105 transition-all">
                {formState === "submitting" ? "Enviando..." : <>Enviar consulta <Send className="ml-3 h-5 w-5" /></>}
              </Button>

              <p className="text-center text-xs text-muted-foreground">
                <ShieldCheck className="inline h-3 w-3 mr-1" /> Tus datos solo se usan para responderte. Nunca spam.
              </p>
            </form>
          </motion.div>

          {/* Columna derecha sin WhatsApp */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-8"
          >
            {/* Stats */}
            <div className="rounded-3xl bg-gradient-to-br from-primary/10 to-primary/5 p-8 border border-primary/20">
              <h3 className="text-2xl font-bold mb-6">Ya ayudé a más de 25.000 personas</h3>
              <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-4xl font-black text-primary">25k+</div>
                  <div className="text-sm text-muted-foreground">Consultas respondidas</div>
                </div>
                <div>
                  <div className="text-4xl font-black text-primary">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Valoración media</div>
                </div>
              </div>
            </div>

            {/* Testimonio */}
            <div className="rounded-3xl bg-muted/50 p-6 border border-border">
              <p className="italic text-muted-foreground mb-4">
                “En 10 minutos me dijo exactamente qué banco abrir. Llevaba 3 meses dando vueltas.”
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-bold">M</div>
                <div>
                  <div className="font-semibold">Marcos (Argentina)</div>
                  <div className="text-xs text-muted-foreground">Freelancer UI/UX</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}