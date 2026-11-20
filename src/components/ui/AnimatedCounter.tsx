// src/components/ui/AnimatedCounter.tsx
// Count-up number that animates from 0 to `value` the first time it scrolls
// into view. The real number is rendered server-side (SEO + no-JS friendly);
// the animation only runs on the client when the element is visible.
// With prefers-reduced-motion the final value is shown with no animation.
"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type AnimatedCounterProps = {
  value: number;
  /** Suffix rendered after the number, e.g. "+" for "60+". */
  suffix?: string;
  durationMs?: number;
  className?: string;
};

export default function AnimatedCounter({
  value,
  suffix = "",
  durationMs = 1400,
  className,
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setDisplay(Math.round(value * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    setDisplay(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduceMotion, value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {display}
      {suffix}
    </span>
  );
}
