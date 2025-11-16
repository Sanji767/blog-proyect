// src/components/layout/MaxWidthWrapper.tsx
import React from "react";
import clsx from "clsx";

type MaxWidthWrapperProps = {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
};

/**
 * Contenedor para vistas más anchas (dashboards, grids grandes, etc.)
 *
 * Ejemplo:
 *  <MaxWidthWrapper>
 *    <Section>...</Section>
 *  </MaxWidthWrapper>
 */
export default function MaxWidthWrapper({
  children,
  className,
  as: Component = "div",
}: MaxWidthWrapperProps) {
  return (
    <Component
      className={clsx(
        "w-full max-w-screen-2xl mx-auto px-4 md:px-6",
        className
      )}
    >
      {children}
    </Component>
  );
}
