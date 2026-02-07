"use client";

import Image from "next/image";
import { useState, useMemo, useEffect, useRef } from "react";
import ReactCountryFlag from "react-country-flag";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Search, Check, Copy, X, Globe, AlertCircle, 
  Clock, Trash2, Download, Share2, Zap 
} from "lucide-react";

import Container from "@/components/layout/Container";
import { IBAN_MAP } from "./IBANMap";
import { BANK_REGISTRY } from "./BankData";

// ==================== TIPOS ====================
type SuccessResult = {
  type: "success";
  country: string;
  countryCode: string;
  isSEPA: boolean;
  length: number;
  example: string;
  isValid: boolean;
  cleanValue: string;
  bankInfo?: { name: string; bic: string };
  breakdown: Array<{ label: string; value: string; desc?: string }>;
};

type ErrorResult = { type: "error"; error: string };
type ScanResult = SuccessResult | ErrorResult | null;

type HistoryEntry = {
  id: string;
  iban: string;
  formatted: string;
  result: SuccessResult;
  timestamp: string;
};

// ==================== VALIDACIÓN ====================
const validateIBAN = (input: string): ScanResult => {
  const clean = input.replace(/\s/g, "").toUpperCase();
  if (clean.length < 2) return null;

  const prefix = clean.slice(0, 2);
  const countryData = IBAN_MAP[prefix as keyof typeof IBAN_MAP];
  if (!countryData) return { type: "error", error: "Prefijo de país no reconocido" };

  // Intentar extraer banco (ES: 4 dígitos tras los 4 primeros)
  const bankCode = clean.slice(4, 8); 
  const bankInfo = BANK_REGISTRY[bankCode as keyof typeof BANK_REGISTRY];

  let isValid = false;
  if (clean.length === countryData.length) {
    const rearranged = clean.slice(4) + clean.slice(0, 4);
    let numStr = "";
    for (const char of rearranged) {
      const code = char.charCodeAt(0);
      numStr += code >= 65 && code <= 90 ? (code - 55).toString() : char;
    }
    try {
      isValid = BigInt(numStr) % BigInt(97) === BigInt(1);
    } catch {
      isValid = false;
    }
  }

  const breakdown = [
    { label: "País", value: clean.slice(0, 2), desc: countryData.country },
    { label: "Control", value: clean.slice(2, 4) },
    { label: "Entidad", value: clean.slice(4, 8), desc: bankInfo?.name },
    { label: "Sucursal", value: clean.slice(8, 12) },
    { label: "Cuenta", value: clean.slice(12) },
  ].filter(p => p.value.length > 0);

  return {
    type: "success",
    ...countryData,
    countryCode: prefix,
    isValid,
    cleanValue: clean,
    bankInfo,
    breakdown,
  };
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function IBANPage() {
  const [rawInput, setRawInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const displayInput = useMemo(() => 
    rawInput.replace(/[^\dA-Z]/gi, "").replace(/(.{4})/g, "$1 ").trim(), 
  [rawInput]);

  const result = useMemo(() => validateIBAN(rawInput), [rawInput]);

  // CORRECCIÓN DEL ERROR DE TYPESCRIPT AQUÍ
  const bulkResults = useMemo(() => {
    return bulkInput
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const res = validateIBAN(line);
        return res ? { iban: line, result: res } : null;
      })
      .filter((item): item is { iban: string; result: SuccessResult | ErrorResult } => item !== null);
  }, [bulkInput]);

  // Efectos de carga y guardado
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const iban = params.get("iban");
    if (iban) { setRawInput(iban); setIsBulkMode(false); }
    
    const saved = localStorage.getItem("ibanHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("ibanHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (!result || result.type !== "success" || !result.isValid) return;

    setHistory((prev) => {
      const alreadyExists = prev.some((h) => h.iban === result.cleanValue);
      if (alreadyExists) return prev;

      const entry: HistoryEntry = {
        id: Date.now().toString(),
        iban: result.cleanValue,
        formatted: displayInput,
        result,
        timestamp: new Date().toISOString(),
      };

      return [entry, ...prev].slice(0, 15);
    });
  }, [result, displayInput]);

  const showToast = (msg: string) => {
    setToast({ msg, type: "success" });
    setTimeout(() => setToast(null), 2000);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copiado al portapapeles");
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 pb-20">
      <Container className="max-w-7xl py-12">
        
        {/* HERO SECTION */}
        <header className="text-center mb-16">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 px-5 py-2 rounded-full border border-emerald-100 dark:border-emerald-900 text-xs font-bold tracking-widest mb-6">
            <ShieldCheck className="w-4 h-4" /> VALIDACIÓN BANCARIA PROFESIONAL
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            IBAN<span className="text-emerald-600">SCANNER</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto text-lg">
            Verifica la validez de cualquier cuenta bancaria internacional y extrae información detallada de la entidad.
          </p>
        </header>

        {/* MODO SELECTOR */}
        <div className="flex justify-center mb-12">
          <div className="bg-zinc-200 dark:bg-zinc-800 p-1 rounded-2xl flex gap-1">
            <button onClick={() => setIsBulkMode(false)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${!isBulkMode ? "bg-white dark:bg-zinc-900 shadow-sm" : "text-zinc-500"}`}>Individual</button>
            <button onClick={() => setIsBulkMode(true)} className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${isBulkMode ? "bg-white dark:bg-zinc-900 shadow-sm" : "text-zinc-500"}`}>Masivo</button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* COLUMNA IZQUIERDA: INPUT Y RESULTADOS */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* INPUT PRINCIPAL */}
            <section>
              {!isBulkMode ? (
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-focus-within:opacity-40 transition" />
                  <div className="relative bg-white dark:bg-zinc-900 p-4 rounded-[2.25rem] border border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 rounded-3xl px-6 py-5">
                      <Search className="w-6 h-6 text-zinc-400 mr-4" />
                      <input 
                        ref={inputRef}
                        value={displayInput}
                        onChange={(e) => setRawInput(e.target.value.toUpperCase())}
                        placeholder="ES21 0000 0000 0000..."
                        className="flex-1 bg-transparent text-2xl md:text-3xl font-mono outline-none"
                      />
                      {rawInput && <button onClick={() => setRawInput("")} className="p-2 hover:bg-zinc-200 dark:hover:bg-zinc-800 rounded-full transition"><X className="w-5 h-5"/></button>}
                    </div>
                  </div>
                </div>
              ) : (
                <textarea 
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value.toUpperCase())}
                  placeholder="Introduce un IBAN por línea..."
                  className="w-full h-64 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-8 text-xl font-mono outline-none focus:border-emerald-500 transition-colors"
                />
              )}
            </section>

            {/* RESULTADO INDIVIDUAL */}
            <AnimatePresence mode="wait">
              {!isBulkMode && result?.type === "success" && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
                  className="bg-white dark:bg-zinc-900 rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 shadow-xl overflow-hidden">
                  
                  <div className="p-8 md:p-12 border-b border-zinc-100 dark:border-zinc-800 flex flex-wrap items-center gap-8">
                    <div className="w-24 h-16 rounded-xl overflow-hidden shadow-lg border-2 border-white dark:border-zinc-800">
                      <ReactCountryFlag countryCode={result.countryCode} svg style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-4xl font-black">{result.country}</h2>
                      <p className="text-emerald-600 font-bold flex items-center gap-2 mt-1 uppercase text-sm tracking-tighter">
                        <Globe className="w-4 h-4" /> {result.isSEPA ? "Zona SEPA (Pagos inmediatos)" : "Internacional (SWIFT)"}
                      </p>
                    </div>
                    <div className={`px-8 py-4 rounded-2xl flex flex-col items-center justify-center text-white ${result.isValid ? "bg-emerald-500" : "bg-red-500"}`}>
                      {result.isValid ? <Check className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
                      <span className="font-black uppercase text-xs mt-1">{result.isValid ? "Válido" : "Inválido"}</span>
                    </div>
                  </div>

                  <div className="p-8 md:p-12">
                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Banco Emisor</label>
                        <div className="text-2xl font-bold">{result.bankInfo?.name || "Entidad no identificada"}</div>
                        <div className="text-emerald-600 font-mono text-xl">{result.bankInfo?.bic || "BIC No disponible"}</div>
                      </div>
                      <div className="flex justify-end items-center">
                        <Image
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
                            result.cleanValue
                          )}`}
                          width={96}
                          height={96}
                          className="w-24 h-24 rounded-lg bg-white p-1"
                          alt="QR"
                          unoptimized
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                      {result.breakdown.map((item, i) => (
                        <div key={i} className="bg-zinc-50 dark:bg-zinc-950 p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800">
                          <p className="text-[9px] font-black text-zinc-400 uppercase mb-1">{item.label}</p>
                          <p className="font-mono font-bold text-lg break-all">{item.value}</p>
                          {item.desc && <p className="text-[10px] text-emerald-500 mt-1 font-medium">{item.desc}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="mt-10 flex flex-wrap gap-4">
                      <button onClick={() => handleCopy(result.cleanValue)} className="flex-1 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition">
                        <Copy className="w-5 h-5" /> Copiar IBAN
                      </button>
                      <button onClick={() => window.print()} className="px-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:bg-zinc-50 dark:hover:bg-zinc-800 transition">
                        <Download className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* RESULTADOS MASIVOS */}
            {isBulkMode && bulkResults.length > 0 && (
              <div className="grid gap-4">
                {bulkResults.map((item, i) => (
                  <div key={i} className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {item.result.type === "success" && <ReactCountryFlag countryCode={item.result.countryCode} svg />}
                      <span className="font-mono text-sm">{item.iban}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      {item.result.type === "success" ? (
                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.result.isValid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                          {item.result.isValid ? "VÁLIDO" : "INVÁLIDO"}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-red-500">ERROR PAÍS</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* COLUMNA DERECHA: HISTORIAL Y TIPS */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2rem] border border-zinc-200 dark:border-zinc-800 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-xs uppercase tracking-[2px] text-zinc-400 flex items-center gap-2">
                  <Clock className="w-4 h-4"/> RECIENTES
                </h3>
                {history.length > 0 && <button onClick={() => setHistory([])} className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition"><Trash2 className="w-4 h-4"/></button>}
              </div>
              <div className="space-y-3">
                {history.map(h => (
                  <button key={h.id} onClick={() => setRawInput(h.iban)} className="w-full text-left p-4 bg-zinc-50 dark:bg-zinc-950 rounded-xl hover:scale-[1.02] transition-transform border border-transparent hover:border-emerald-500/30 flex items-center gap-3">
                    <ReactCountryFlag countryCode={h.result.countryCode} svg />
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-mono truncate opacity-60">{h.formatted}</p>
                      <p className="text-xs font-bold">{h.result.bankInfo?.name || h.result.country}</p>
                    </div>
                  </button>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-12 opacity-30 italic text-sm">No hay escaneos recientes</div>
                )}
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-600 to-cyan-700 p-8 rounded-[2rem] text-white relative overflow-hidden group">
              <Zap className="absolute -right-6 -bottom-6 w-32 h-32 opacity-20 group-hover:rotate-12 transition-transform duration-500" />
              <p className="font-black text-[10px] tracking-widest mb-2 opacity-80 uppercase">Educación Financiera</p>
              <h4 className="text-xl font-bold mb-4 leading-tight">¿Quieres dominar tus finanzas más allá del IBAN?</h4>
              <p className="text-sm text-emerald-100 mb-6 leading-relaxed">
                Entender cómo se mueve el dinero es el primer paso hacia la libertad. Hemos preparado guías exclusivas para ti.
              </p>
              <a href="/ebooks" className="inline-flex items-center gap-2 bg-white text-emerald-700 px-6 py-3 rounded-xl font-bold text-xs uppercase hover:bg-emerald-50 transition-colors">
                Explorar eBooks <Share2 className="w-4 h-4" />
              </a>
            </div>
          </aside>
        </div>

        {/* DIRECTORIO DE PAÍSES */}
        <section className="mt-24">
           <h2 className="text-4xl font-black mb-12 flex items-center gap-4">
            <Globe className="text-emerald-500" /> Estándares Internacionales
           </h2>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Object.entries(IBAN_MAP).slice(0, 8).map(([code, data]) => (
                <div key={code} className="bg-white dark:bg-zinc-900 p-6 rounded-3xl border border-zinc-100 dark:border-zinc-800">
                  <div className="flex items-center gap-3 mb-4">
                    <ReactCountryFlag countryCode={code} svg />
                    <span className="font-bold">{data.country}</span>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase">Longitud</p>
                      <p className="text-3xl font-black text-emerald-600">{data.length}</p>
                    </div>
                    <button onClick={() => setRawInput(data.example)} className="text-[10px] font-bold text-zinc-400 hover:text-emerald-500 underline uppercase tracking-tighter">Ejemplo</button>
                  </div>
                </div>
              ))}
           </div>
        </section>

      </Container>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 right-10 bg-zinc-900 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-50">
            <Check className="text-emerald-500" /> {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
