// src/app/contacto/page.tsx
"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormState("submitting");
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name")?.toString().trim(),
      email: formData.get("email")?.toString().trim(),
      topic: formData.get("topic")?.toString().trim(),
      message: formData.get("message")?.toString().trim(),
      country: formData.get("country")?.toString().trim(),
      goal: formData.get("goal")?.toString().trim(),
    };

    // Validación básica en cliente
    if (!data.name || !data.email || !data.message) {
      setFormState("error");
      setErrorMessage("Por favor, rellena al menos nombre, email y mensaje.");
      return;
    }

    try {
      // Aquí en el futuro puedes llamar a un endpoint:
      // await fetch("/api/contact", { method: "POST", body: JSON.stringify(data) })
      console.log("Mensaje de contacto:", data);

      setFormState("success");
      (e.currentTarget as HTMLFormElement).reset();
    } catch (error) {
      console.error(error);
      setFormState("error");
      setErrorMessage(
        "Ha ocurrido un error al enviar el mensaje. Inténtalo de nuevo.",
      );
    }
  }

  const isSubmitting = formState === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-border bg-background p-5 shadow-card md:p-6"
    >
      <div className="space-y-1">
        <h2 className="text-lg font-semibold md:text-xl">Envíame tu consulta</h2>
        <p className="text-xs text-muted-foreground md:text-sm">
          Cuanta más información me des sobre tu situación, mejor podré
          orientarte con el banco o cuenta que más encaje contigo.
        </p>
      </div>

      {/* Nombre */}
      <div className="space-y-1.5">
        <label htmlFor="name" className="text-sm font-medium">
          Nombre
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="Tu nombre"
        />
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="tunombre@correo.com"
        />
      </div>

      {/* País de residencia */}
      <div className="space-y-1.5">
        <label htmlFor="country" className="text-sm font-medium">
          País de residencia (opcional)
        </label>
        <input
          id="country"
          name="country"
          type="text"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="España, Suiza, Alemania…"
        />
      </div>

      {/* Objetivo principal */}
      <div className="space-y-1.5">
        <label htmlFor="goal" className="text-sm font-medium">
          ¿Para qué quieres la cuenta?
        </label>
        <select
          id="goal"
          name="goal"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          defaultValue=""
        >
          <option value="" disabled>
            Selecciona una opción
          </option>
          <option value="viajar">Viajar y pagar en otras divisas</option>
          <option value="cobrar">Cobrar nómina o ingresos</option>
          <option value="freelance">Trabajar como freelance / remoto</option>
          <option value="ahorro">Ahorro y cuentas separadas</option>
          <option value="empresa">Empresa / autónomo</option>
          <option value="otro">Otro</option>
        </select>
      </div>

      {/* Tema */}
      <div className="space-y-1.5">
        <label htmlFor="topic" className="text-sm font-medium">
          Asunto (opcional)
        </label>
        <input
          id="topic"
          name="topic"
          type="text"
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="Ej: Duda entre Revolut y N26"
        />
      </div>

      {/* Mensaje */}
      <div className="space-y-1.5">
        <label htmlFor="message" className="text-sm font-medium">
          Mensaje
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          placeholder="Cuéntame brevemente tu situación: país, si tienes ya cuenta, si necesitas tarjeta física, etc."
        />
      </div>

      {/* Estado / errores */}
      {formState === "success" && (
        <p className="text-sm text-green-600">
          ✅ Mensaje enviado. Te responderé lo antes posible a tu correo.
        </p>
      )}
      {formState === "error" && errorMessage && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      {/* Botón */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-black shadow-soft disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? "Enviando..." : "Enviar mensaje"}
      </button>

      <p className="text-[11px] text-muted-foreground">
        Al enviar este formulario aceptas que use tus datos solo para responder
        a tu consulta. No se enviará publicidad ni se compartirán tus datos con
        terceros.
      </p>
    </form>
  );
}
