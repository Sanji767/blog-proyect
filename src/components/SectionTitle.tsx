import React from "react";

interface SectionTitleProps {
  // Indicamos que el hijo es un elemento que puede tener className
  children: React.ReactElement<{ className?: string }>;
}

const SectionTitle: React.FC<SectionTitleProps> = ({ children }) => {
  const existingClassName = children.props.className ?? "";

  return React.cloneElement(children, {
    className: `${existingClassName} text-3xl lg:text-5xl lg:leading-tight font-bold`.trim(),
  });
};

export default SectionTitle;
