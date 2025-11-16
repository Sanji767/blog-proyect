'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Shield, 
  Zap, 
  Globe, 
  CreditCard, 
  Lock, 
  ArrowRight,
  Euro,
  Users,
  Clock
} from 'lucide-react';

const advantages = [
  {
    icon: Shield,
    title: 'Seguridad bancaria europea',
    description: 'Todos los bancos están regulados por la UE. Tus depósitos están protegidos hasta 100.000€ por el Fondo de Garantía.',
    stat: '100.000€ protegidos',
    color: 'text-green-600',
    bg: 'bg-green-50'
  },
  {
    icon: Zap,
    title: 'Transferencias instantáneas',
    description: 'Envía y recibe dinero en segundos, incluso entre países. Olvídate de esperas de 3-5 días.',
    stat: '< 10 segundos',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50'
  },
  {
    icon: Globe,
    title: 'IBAN europeo incluido',
    description: 'Recibe tu sueldo, paga facturas o alquila en cualquier país de la UE con un solo IBAN.',
    stat: '30+ países',
    color: 'text-blue-600',
    bg: 'bg-blue-50'
  },
  {
    icon: CreditCard,
    title: 'Tarjetas sin comisiones ocultas',
    description: 'Pagos en el extranjero sin recargos por cambio de divisa. Algunas incluyen cashback.',
    stat: '0% comisiones',
    color: 'text-purple-600',
    bg: 'bg-purple-50'
  },
  {
    icon: Lock,
    title: 'Cifrado de grado bancario',
    description: 'Autenticación biométrica, 2FA y encriptación AES-256. Más seguro que muchos bancos tradicionales.',
    stat: '99.9% uptime',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50'
  },
  {
    icon: Users,
    title: 'Soporte 24/7 en español',
    description: 'Chat en vivo, email y teléfono. Respuesta media en menos de 2 minutos.',
    stat: '98% satisfacción',
    color: 'text-pink-600',
    bg: 'bg-pink-50'
  }
];

const Ventajas: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <section
      ref={ref}
      id="ventajas"
      className="py-20 md:py-28 px-5 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900"
    >
      <div className="max-w-7xl mx-auto">
        {/* Título */}
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-5xl font-bold text-foreground"
          >
            Por qué millones eligen bancos digitales
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-lg text-foreground-accent max-w-3xl mx-auto"
          >
            Ahorra tiempo, dinero y estrés. Todo lo que necesitas en una sola app.
          </motion.p>
        </div>

        {/* Grid de ventajas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {advantages.map((adv, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`relative p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-gray-800 ${adv.bg} backdrop-blur-sm transition-all duration-300 group`}
            >
              {/* Icono */}
              <div className={`inline-flex p-3 rounded-xl ${adv.bg} ring-4 ring-white/50 shadow-lg mb-5`}>
                <adv.icon className={`w-7 h-7 ${adv.color}`} />
              </div>

              {/* Título */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {adv.title}
              </h3>

              {/* Descripción */}
              <p className="text-foreground-accent mb-4 leading-relaxed">
                {adv.description}
              </p>

              {/* Estadística */}
              <div className="flex items-center justify-between">
                <span className={`text-2xl font-bold ${adv.color}`}>
                  {adv.stat}
                </span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-foreground transition-colors" />
              </div>

              {/* Efecto hover */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </div>

        {/* CTA Final */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-16 text-center"
        >
          <a
            href="#comparativa"
            className="inline-flex items-center gap-3 px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Ver todos los bancos
            <ArrowRight className="w-5 h-5" />
          </a>
        </motion.div>

        {/* Estadísticas globales */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 1, duration: 0.6 }}
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
        >
          {[
            { value: '+€2.3B', label: 'Ahorrados por usuarios en 2025' },
            { value: '4.8/5', label: 'Valoración media en Trustpilot' },
            { value: '30M+', label: 'Usuarios activos en Europa' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="text-3xl md:text-4xl font-bold text-primary">
                {stat.value}
              </div>
              <p className="mt-2 text-foreground-accent">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Ventajas;