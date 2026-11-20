// src/components/ui/Reveal.tsx
// Shared scroll-reveal wrapper (framer-motion). Sections fade/slide in once
// when they enter the viewport. Respects prefers-reduced-motion: with reduced
// motion the content renders plainly, with no animation.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Stagger delay in seconds (default 0). */
  delay?: number;
  /** Vertical travel in px (default 16). Keep subtle. */
  y?: number;
  className?: string;
};

export default function Reveal({ children, delay = 0, y = 16, className }: RevealProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
