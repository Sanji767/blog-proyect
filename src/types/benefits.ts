// src/types/benefits.ts
import type { ReactNode } from "react";

export interface IBenefitBullet {
  id?: number | string;
  title: string;
  description: string;
  icon: ReactNode;
  stat?: string; // ej: "24h", "100K€"
}

export interface IBenefit {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;

  // Ruta de la imagen en /public
  image: string;

  bullets: IBenefitBullet[];

  // CTA opcional
  ctaLabel?: string;
  ctaHref?: string;

  // Layout opcional
  align?: "image-left" | "image-right";
}
