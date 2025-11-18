'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ArrowRight, Shield, Zap, Globe } from "lucide-react";


const heroDetails = {
  heading: 'Los mejores bancos digitales de Europa',
  subheading: 'Compara cuentas sin comisiones, transferencias internacionales gratis y tarjetas premium. Elige el que más te conviene.',
  ctaText: 'Ver comparativa completa',
  ctaUrl: '#comparativa',
  mockupSrc: '/mockups/comparison-dashboard.webp',
};

const Hero: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const words = heroDetails.heading.split(' ');

  return (
    <section ref={ref} className="relative pt-32 md:pt-40 pb-24 px-5 bg-gradient-to-b from-white to-gray-50">
      {/* Fondo grid */}
      <div className="absolute inset-0 -z-10 opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:60px_60px]" />
      </div>

      <div className="max-w-6xl mx-auto text-center">
        {/* Título */}
        <motion.h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.08 }}
              className="inline-block mr-3"
            >
              {word}
            </motion.span>
          ))}
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.7 }}
          className="mt-6 text-lg text-foreground-accent max-w-3xl mx-auto"
        >
          {heroDetails.subheading}
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1 }}
          className="mt-10"
        >
          <a
            href={heroDetails.ctaUrl}
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            {heroDetails.ctaText}
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Beneficios rápidos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1.2 }}
          className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto"
        >
          {[
            { icon: Shield, text: 'Cuentas seguras con encriptación bancaria' },
            { icon: Zap, text: 'Transferencias en segundos, sin esperas' },
            { icon: Globe, text: 'IBAN europeo, funciona en 30+ países' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 text-foreground-accent">
              <item.icon className="w-6 h-6 text-blue-600" />
              <span className="text-sm md:text-base">{item.text}</span>
            </div>
          ))}
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1.4 }}
          className="mt-20 mx-auto max-w-4xl"
        >
          <Image
            src={heroDetails.mockupSrc}
            width={900}
            height={500}
            quality={95}
            sizes="(max-width: 768px) 100vw, 900px"
            priority
            alt="Comparativa de bancos digitales"
            className="rounded-2xl shadow-2xl border border-gray-200"
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;