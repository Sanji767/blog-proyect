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
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs rounded px-2 py-1 shadow-lg z-50 whitespace-nowrap">
          {content}
        </div>
      )}
    </div>
  );
}
