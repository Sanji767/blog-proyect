"use client";

import { useState, useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import { IBAN_MAP } from "./IBANMap";
import { BANK_REGISTRY } from "./BankData"; // Asegúrate de crear este archivo con los BICs
import { 
  ShieldCheck, Landmark, Globe, Check, Copy, 
  Zap, Info, Search, AlertCircle, ArrowRight, ExternalLink 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Container from "@/components/layout/Container";
import Link from "next/link";

// --- TIPADOS PARA TRABAJO A LARGO PLAZO ---
type SuccessResult = {
  type: 'success';
  country: string;
  countryCode: string;
  isSEPA: boolean;
  length: number;
  example: string;
  isValid: boolean | undefined;
  cleanValue: string;
  bankInfo?: { name: string; bic: string };
};

type ErrorResult = { type: 'error'; error: string };
type ScanResult = SuccessResult | ErrorResult | null;

export default function IBANPage() {
  const [input, setInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [copied, setCopied] = useState("");

  // 1. FORMATEO DE ENTRADA (Espacios cada 4 caracteres)
  const displayInput = useMemo(() => {
    return input.replace(/[^\dA-Z]/gi, '').replace(/(.{4})/g, '$1 ').trim();
  }, [input]);

  // 2. LÓGICA DE ESCANEO Y ANÁLISIS
  const result = useMemo((): ScanResult => {
    const clean = input.replace(/\s/g, "").toUpperCase();
    if (clean.length < 2) return null;

    const prefix = clean.slice(0, 2);
    const countryData = IBAN_MAP[prefix as keyof typeof IBAN_MAP];

    if (!countryData) return { type: 'error', error: "Prefijo de país no identificado en la red internacional." };

    // Identificación de Banco y BIC (Basado en los primeros 4 dígitos del banco)
    const bankCode = clean.slice(4, 8);
    const bankInfo = BANK_REGISTRY[bankCode as keyof typeof BANK_REGISTRY];

    // Validación Algorítmica MOD97
    let isValid = undefined;
    if (clean.length === countryData.length) {
      const rearranged = clean.slice(4) + clean.slice(0, 4);
      let numStr = "";
      for (const char of rearranged) {
        const code = char.charCodeAt(0);
        numStr += (code >= 48 && code <= 57) ? char : (code - 55).toString();
      }
      try {
        isValid = BigInt(numStr) % BigInt(97) === BigInt(1);
      } catch { isValid = false; }
    }

    return {
      type: 'success',
      ...countryData,
      countryCode: prefix,
      isValid,
      cleanValue: clean,
      bankInfo
    };
  }, [input]);

  // 3. FILTRADO PARA EL DIRECTORIO (SEO)
  const filteredCountries = useMemo(() => {
    return Object.entries(IBAN_MAP).filter(([code, data]) => 
      data.country.toLowerCase().includes(searchQuery.toLowerCase()) || code.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 6);
  }, [searchQuery]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(""), 2000);
  };

  return (
    <div className="bg-white dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100">
      <Container className="max-w-6xl py-16 md:py-24">
        
        {/* SECCIÓN 1: HERO & SCANNER */}
        <section className="text-center mb-20">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6 border border-emerald-100 dark:border-emerald-500/20">
            <ShieldCheck className="h-3.5 w-3.5" /> Seguridad Bancaria Certificada
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 italic">
            IBAN<span className="text-emerald-500">SCANNER</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg font-medium">
            Valida cuentas bancarias, extrae códigos BIC/SWIFT e identifica bancos emisores al instante.
          </p>
        </section>

        {/* SECCIÓN 2: INPUT MAESTRO */}
        <div className="relative max-w-4xl mx-auto mb-20 group">
          <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-emerald-300 rounded-[3rem] blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
          <div className="relative flex items-center bg-white dark:bg-zinc-900 border-2 border-zinc-100 dark:border-zinc-800 rounded-[2.8rem] p-4 shadow-2xl transition-all group-focus-within:border-emerald-500/50">
            <div className="pl-6 text-zinc-400"><Search className="h-8 w-8" /></div>
            <input
              type="text"
              value={displayInput}
              onChange={(e) => setInput(e.target.value.toUpperCase())}
              placeholder="Introduce tu IBAN para analizar..."
              className="w-full bg-transparent p-8 md:p-10 text-2xl md:text-4xl font-mono outline-none uppercase placeholder:text-zinc-200 dark:placeholder:text-zinc-800 tracking-wider"
            />
          </div>
        </div>

        {/* SECCIÓN 3: RESULTADOS DINÁMICOS */}
        <div className="min-h-[450px] mb-32">
          <AnimatePresence mode="wait">
            {result?.type === 'success' ? (
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} className="grid lg:grid-cols-12 gap-8">
                
                {/* Panel de Identidad Bancaria */}
                <div className="lg:col-span-8 bg-zinc-50 dark:bg-zinc-900/50 rounded-[3.5rem] p-10 md:p-14 border border-zinc-100 dark:border-zinc-800">
                  <div className="flex flex-col md:flex-row md:items-center gap-8 mb-12">
                    <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-800 shrink-0">
                      <ReactCountryFlag countryCode={result.countryCode} svg style={{ width: '100px', height: 'auto', display: 'block' }} />
                    </div>
                    <div>
                      <h2 className="text-4xl font-black mb-1 tracking-tight">{result.country}</h2>
                      <p className="text-emerald-600 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        <Globe className="h-3.5 w-3.5" /> Territorio {result.isSEPA ? 'SEPA' : 'Internacional'}
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-12 pt-10 border-t border-zinc-200 dark:border-zinc-800">
                    <div className="space-y-4">
                      <h4 className="font-black text-xs uppercase text-zinc-400 tracking-widest">Entidad Bancaria</h4>
                      <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700">
                        <span className="font-bold text-xl">{result.bankInfo?.name || "No Detectado"}</span>
                        <Link href="/bancos" className="text-emerald-500 hover:scale-110 transition-transform"><ExternalLink className="h-5 w-5" /></Link>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h4 className="font-black text-xs uppercase text-zinc-400 tracking-widest">Código BIC / SWIFT</h4>
                      <div className="flex items-center justify-between p-6 bg-white dark:bg-zinc-800 rounded-3xl border border-zinc-100 dark:border-zinc-700 font-mono">
                        <span className="font-bold text-xl text-emerald-600">{result.bankInfo?.bic || "--------"}</span>
                        {result.bankInfo?.bic && (
                          <button onClick={() => handleCopy(result.bankInfo!.bic, 'bic')} className="text-zinc-300 hover:text-emerald-500 transition-colors">
                            {copied === 'bic' ? <Check className="h-5 w-5" /> : <Copy className="h-5 w-5" />}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Status de Validación */}
                <div className="lg:col-span-4 space-y-6">
                  <div className={`rounded-[3rem] p-12 text-center border-2 transition-all duration-500 ${result.isValid ? 'bg-emerald-500 border-emerald-400 text-white shadow-xl shadow-emerald-500/20' : 'bg-zinc-50 dark:bg-zinc-900 border-zinc-100 dark:border-zinc-800'}`}>
                    {result.isValid ? (
                      <div className="space-y-4">
                        <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="h-10 w-10" /></div>
                        <p className="text-3xl font-black italic tracking-tighter leading-none">IBAN VÁLIDO</p>
                        <p className="text-emerald-100 text-sm font-medium">Algoritmo MOD97 verificado</p>
                      </div>
                    ) : (
                      <div className="space-y-4 opacity-40">
                        <Info className="h-12 w-12 mx-auto mb-4" />
                        <p className="text-xs font-bold tracking-widest uppercase">Esperando longitud exacta</p>
                        <p className="text-[10px] leading-tight">Requerido: {result.length} caracteres</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-zinc-900 p-10 rounded-[3rem] text-white flex flex-col justify-between min-h-[200px] group cursor-pointer overflow-hidden relative">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase text-emerald-400 mb-2">Recomendación FinWise</p>
                      <h3 className="text-2xl font-bold mb-6 italic italic tracking-tighter leading-tight">¿Pagas comisiones en tus transferencias?</h3>
                      <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest group-hover:gap-4 transition-all">
                        Ver mejores neobancos <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                    <Zap className="absolute -bottom-4 -right-4 h-32 w-32 text-white/5 group-hover:text-emerald-500/10 transition-colors" />
                  </div>
                </div>
              </motion.div>
            ) : result?.type === 'error' ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto p-12 bg-red-50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/20 rounded-[3.5rem] text-center">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-6" />
                <h3 className="text-2xl font-black text-red-600 dark:text-red-400 mb-2">{result.error}</h3>
                <p className="text-zinc-500 text-sm italic">Comprueba que el código empiece por dos letras válidas (ES, DE, FR...)</p>
              </motion.div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 opacity-10">
                <Landmark className="h-24 w-24 mb-6" />
                <p className="text-2xl font-medium italic italic">Esperando señal de red financiera...</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* SECCIÓN 4: DIRECTORIO IBAN (SEO) */}
        <section className="pt-24 border-t border-zinc-100 dark:border-zinc-900">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-12">
            <div className="max-w-xl">
              <h2 className="text-4xl font-black tracking-tighter mb-4">Directorio de Estructuras IBAN</h2>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                Cada país tiene una longitud y estructura única. Nuestro directorio te ayuda a entender el formato oficial de cada jurisdicción bajo la normativa ISO 13616.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar país..." 
                className="w-full pl-12 pr-6 py-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl text-sm outline-none focus:border-emerald-500 transition-all"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCountries.map(([code, data]) => (
              <div key={code} className="p-8 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-[2.5rem] hover:shadow-xl hover:border-emerald-500/20 transition-all group">
                <div className="flex items-center gap-4 mb-6">
                   <ReactCountryFlag countryCode={code} svg style={{ width: '32px', borderRadius: '4px' }} />
                   <h4 className="font-bold text-lg">{data.country}</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                    <span>Longitud Oficial</span>
                    <span className="text-zinc-900 dark:text-zinc-100">{data.length} Caracteres</span>
                  </div>
                  <div className="p-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl font-mono text-xs text-zinc-500 break-all leading-relaxed">
                    Ejemplo: <span className="text-zinc-900 dark:text-zinc-200">{data.example}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </Container>
    </div>
  );
}