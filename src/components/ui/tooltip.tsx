"use client";
import React, { ReactNode, useState } from "react";

interface TooltipProps {
  content: string | ReactNode;
  children: ReactNode;
}

export function Tooltip({ content, children }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative inline-block" 
         onMouseEnter={() => setVisible(true)} 
         onMouseLeave={() => setVisible(false)}>
      {children}
      {visible && (
        <div className="absolute bottom-full mb-2 left-1/2 z-50 -translate-x-1/2 whitespace-nowrap rounded-xl border-2 border-border bg-secondary px-3 py-2 text-xs font-medium text-secondary-foreground shadow-soft">
          {content}
        </div>
      )}
    </div>
  );
}
