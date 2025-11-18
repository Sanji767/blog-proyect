// src/components/benefits/data/benefits.tsx
import { Zap, Bell, Building2, Euro, Eye, Scale } from "lucide-react";
import type { IBenefit } from "@/types/benefits";

export const benefits: IBenefit[] = [
  {
    id: "payments",
    eyebrow: "Pagos inteligentes",
    title: "Centraliza todos tus pagos en un solo panel",
    description:
      "Conecta tus cuentas en neobancos y fintech para controlar suscripciones, recibos y transferencias sin perderte nada.",
    image: "/images/benefits/payments.webp",
    align: "image-right",
    ctaLabel: "Ver bancos para pagos",
    ctaHref: "/bancos",
    bullets: [
      {
        id: 1,
        title: "Resumen diario de movimientos",
        description:
          "Detecta gastos recurrentes, suscripciones olvidadas y cargos duplicados.",
        icon: <Zap size={28} className="text-primary" />,
        stat: "24h",
      },
      {
        id: 2,
        title: "Alertas inteligentes",
        description: "Avisos cuando una comisión se dispara.",
        icon: <Bell size={28} className="text-primary" />,
      },
      {
        id: 3,
        title: "Multi-banco",
        description: "Gestiona todos tus bancos europeos desde un solo sitio.",
        icon: <Building2 size={28} className="text-primary" />,
      },
    ],
  },
  {
    id: "security",
    eyebrow: "Seguridad y control",
    title: "Ten el control real de tu dinero en Europa",
    description:
      "Te mostramos qué garantía tiene tu dinero en cada banco europeo y cómo están protegidos tus depósitos.",
    image: "/images/benefits/security.webp",
    align: "image-left",
    ctaLabel: "Ver garantías por país",
    ctaHref: "/garantias",
    bullets: [
      {
        id: 1,
        title: "Garantías de depósitos",
        description: "100.000€ en la mayoría de países de la UE.",
        icon: <Euro size={28} className="text-primary" />,
        stat: "100K€",
      },
      {
        id: 2,
        title: "Transparencia 100%",
        description: "Explicamos comisiones sin letra pequeña ni jerga bancaria.",
        icon: <Eye size={28} className="text-primary" />,
      },
      {
        id: 3,
        title: "Comparativas reales",
        description: "No marketing. Datos y condiciones que puedes verificar.",
        icon: <Scale size={28} className="text-primary" />,
      },
    ],
  },
];
