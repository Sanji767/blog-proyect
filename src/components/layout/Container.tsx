// src/components/layout/Container.tsx
import React from "react";
import clsx from "clsx";

type ContainerProps<T extends React.ElementType = "div"> = {
  /**
   * Componente HTML o React a renderizar (div por defecto).
   * Ej: as="section" o as={motion.div}
   */
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Contenedor centrado con ancho máximo estándar para páginas.
 *
 * Ejemplo:
 *  <Container as="section" aria-labelledby="titulo">
 *    ...
 *  </Container>
 */
export default function Container<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: ContainerProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={clsx(
        "mx-auto w-full max-w-7xl px-4 md:px-6 lg:px-8",
        className
      )}
      {...(rest as React.ComponentPropsWithoutRef<T>)}
    >
      {children}
    </Component>
  );
}
