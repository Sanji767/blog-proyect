"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import type { IBenefit } from "@/types/benefits";
import BenefitBullet from "./BenefitBullet";

type BenefitSectionProps = {
  benefit: IBenefit;
  index: number;
};

// Variantes para animación (padre)
export const containerVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Variantes para cada hijo (Bullet)
export const childVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const BenefitSection: React.FC<BenefitSectionProps> = ({ benefit, index }) => {
  const {
    eyebrow,
    title,
    description,
    image,
    bullets,
    ctaHref,
    ctaLabel,
    align,
  } = benefit;

  // Alternar imagen izquierda/derecha
  const isImageLeft =
    align === "image-left" || (align === undefined && index % 2 === 0);

  const imageBlock = (
    <div className="relative h-64 w-full overflow-hidden rounded-3xl border border-border bg-hero-background/50 shadow-card md:h-72">
      <Image
        src={image}
        alt={title}
        fill
        sizes="(min-width: 1024px) 480px, 100vw"
        className="object-cover"
        priority={index === 0}
      />
    </div>
  );

  const contentBlock = (
    <motion.div
      className="space-y-4"
      variants={containerVariants}
      initial="hidden"
      // 👇 OJO: aquí es **variants**, en plural
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
    >
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary">
          {eyebrow}
        </p>
      )}

      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>

      {description && (
        <p className="max-w-xl text-sm text-foreground-accent sm:text-base">
          {description}
        </p>
      )}

      <div className="mt-2 space-y-4">
        {bullets.map((bullet, idx) => (
          <BenefitBullet key={bullet.id ?? idx} {...bullet} />
        ))}
      </div>

      {ctaHref && ctaLabel && (
        <div className="pt-3">
          <Link
            href={ctaHref}
            className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-black shadow-soft transition hover:brightness-105"
          >
            {ctaLabel} →
          </Link>
        </div>
      )}
    </motion.div>
  );

  return (
    <section className="grid items-center gap-8 py-10 md:grid-cols-2 md:py-14">
      {isImageLeft ? (
        <>
          {imageBlock}
          {contentBlock}
        </>
      ) : (
        <>
          {contentBlock}
          {imageBlock}
        </>
      )}
    </section>
  );
};

export default BenefitSection;
