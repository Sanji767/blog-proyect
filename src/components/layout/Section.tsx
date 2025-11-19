// src/components/layout/Section.tsx
import React from "react";
import clsx from "clsx";

type SectionProps<T extends React.ElementType = "section"> = {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /**
   * Componente HTML o React a renderizar.
   * Por defecto <section>, pero puede ser "main", "header", etc.
   */
  as?: T;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "children" | "id" | "className">;

/**
 * Wrapper de sección con padding vertical estándar y scroll-mt
 * para que los anchors no queden tapados por el header fijo.
 *
 * Ejemplo:
 *  <Section id="ventajas">
 *    <Container>...</Container>
 *  </Section>
 */
export default function Section<T extends React.ElementType = "section">({
  children,
  className,
  id,
  as,
  ...rest
}: SectionProps<T>) {
  const Component = as || "section";

  return (
    <Component
      id={id}
      className={clsx("py-12 md:py-16 scroll-mt-24", className)}
      {...(rest as React.ComponentPropsWithoutRef<T>)}
    >
      {children}
    </Component>
  );
}
