// src/types/benefits.ts
import type { ReactNode } from "react";

export interface IBenefitBullet {
  id?: number | string;
  title: string;
  description: string;
  icon: ReactNode;   // necesario para <Zap />, <Bell />, etc.
  stat?: string;
}

export interface IBenefit {
  id: string;
  eyebrow?: string;
  title: string;
  description?: string;

  image: string; // ruta en /public/images/benefits

  bullets: IBenefitBullet[];

  // CTA opcional
  ctaLabel?: string;
  ctaHref?: string;

  // Layout (izquierda/derecha)
  align?: "image-left" | "image-right";
}
