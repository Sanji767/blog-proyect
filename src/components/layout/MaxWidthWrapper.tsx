// src/components/layout/MaxWidthWrapper.tsx
import React from "react";
import clsx from "clsx";

type MaxWidthWrapperProps<T extends React.ElementType = "div"> = {
  /**
   * Componente HTML o React a renderizar (div por defecto).
   * Útil para dashboards, tablas anchas, grids, etc.
   */
  as?: T;
  className?: string;
  children: React.ReactNode;
} & Omit<React.ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

/**
 * Contenedor para vistas más anchas (dashboards, grids grandes, etc.)
 *
 * Ejemplo:
 *  <MaxWidthWrapper as="main">
 *    <Section>...</Section>
 *  </MaxWidthWrapper>
 */
export default function MaxWidthWrapper<T extends React.ElementType = "div">({
  as,
  className,
  children,
  ...rest
}: MaxWidthWrapperProps<T>) {
  const Component = as || "div";

  return (
    <Component
      className={clsx(
        "w-full max-w-screen-2xl mx-auto px-4 md:px-6",
        className
      )}
      {...(rest as React.ComponentPropsWithoutRef<T>)}
    >
      {children}
    </Component>
  );
}
