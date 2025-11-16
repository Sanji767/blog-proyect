// src/components/layout/Section.tsx
import React from "react";
import clsx from "clsx";

type SectionProps = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  as?: React.ElementType;
};

/**
 * Wrapper de sección con padding vertical estándar.
 *
 * Ejemplo:
 *  <Section id="ventajas">
 *    <Container>...</Container>
 *  </Section>
 */
export default function Section({
  children,
  className,
  id,
  as: Component = "section",
}: SectionProps) {
  return (
    <Component
      id={id}
      className={clsx("py-12 md:py-16", className)}
    >
      {children}
    </Component>
  );
}
