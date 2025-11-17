// src/components/benefits/BenefitBullet.tsx
"use client";

import { motion } from "framer-motion";
import type { IBenefitBullet } from "@/types/benefits";
import { childVariants } from "./BenefitSection";

const BenefitBullet: React.FC<IBenefitBullet> = ({
  title,
  description,
  icon,
  stat,
}) => {
  const safeTitle = title?.trim() || "Ventaja";

  return (
    <motion.article
      className="mt-6 flex flex-col items-center gap-3 lg:mt-8 lg:flex-row lg:items-start lg:gap-5"
      variants={childVariants}
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      aria-label={safeTitle}
    >
      {/* ICONO + STAT */}
      <div className="mx-auto mt-1 flex w-fit flex-shrink-0 items-center justify-center rounded-2xl bg-primary/5 p-3 lg:mx-0">
        <div className="flex items-center gap-2">
          {icon}
          {stat && (
            <span className="rounded-full bg-background px-2 py-0.5 text-[10px] font-semibold text-primary">
              {stat}
            </span>
          )}
        </div>
      </div>

      {/* TEXTO */}
      <div className="text-center lg:text-left">
        <h4 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">
          {safeTitle}
        </h4>
        {description && (
          <p className="mt-1 text-sm leading-relaxed text-foreground-accent">
            {description}
          </p>
        )}
      </div>
    </motion.article>
  );
};

export default BenefitBullet;
