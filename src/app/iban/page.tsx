"use client";

import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import ReactCountryFlag from "react-country-flag";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, Search, Check, Copy, X, Globe, AlertCircle, 
  Clock, Trash2, Download, Share2, Dice5, Zap 
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

  const bankCode = clean.slice(4, 12);
  const bankInfo = BANK_REGISTRY[bankCode as keyof typeof BANK_REGISTRY] ||
                   BANK_REGISTRY[clean.slice(4, 8) as keyof typeof BANK_REGISTRY];

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
    } catch {}
  }

  const breakdown = [
    { label: "País", value: clean.slice(0, 2), desc: countryData.country },
    { label: "Dígitos de control", value: clean.slice(2, 4) },
    { label: "Código bancario", value: clean.slice(4, 12), desc: bankInfo?.name },
    { label: "Sucursal", value: clean.slice(12, 16) },
    { label: "Número de cuenta", value: clean.slice(16) },
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

// ==================== COMPONENTE COMPLETO ====================
export default function IBANPage() {
  const [rawInput, setRawInput] = useState("");
  const [bulkInput, setBulkInput] = useState("");
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [copiedId, setCopiedId] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const displayInput = useMemo(() => rawInput.replace(/[^\dA-Z]/gi, "").replace(/(.{4})/g, "$1 ").trim(), [rawInput]);
  const result = useMemo(() => validateIBAN(rawInput), [rawInput]);

  const bulkResults = useMemo(() => {
    return bulkInput
      .split("\n")
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => {
        const res = validateIBAN(line);
        return res ? { iban: line, result: res } : null;
      })
      .filter((item): item is { iban: string; result: ScanResult } => item !== null);
  }, [bulkInput]);

  // Cargar IBAN desde URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const iban = params.get("iban");
    if (iban) {
      setRawInput(iban);
      setIsBulkMode(false);
    }
  }, []);

  // Historial
  useEffect(() => {
    const saved = localStorage.getItem("ibanHistory");
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("ibanHistory", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    if (result?.type === "success" && result.isValid) {
      const alreadyExists = history.some(h => h.iban === result.cleanValue);
      if (!alreadyExists) {
        const entry: HistoryEntry = {
          id: Date.now().toString(),
          iban: result.cleanValue,
          formatted: displayInput,
          result,
          timestamp: new Date().toISOString(),
        };
        setHistory(prev => [entry, ...prev].slice(0, 20));
      }
    }
  }, [result, displayInput, history]);

  const showToast = (msg: string) => {
    setToast({ msg, type: "success" });
    setTimeout(() => setToast(null), 2200);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast("¡Copiado!");
    setTimeout(() => setCopiedId(""), 1800);
  };

  const shareLink = () => {
    if (result?.type !== "success") return;
    const url = `${window.location.origin}${window.location.pathname}?iban=${result.cleanValue}`;
    navigator.clipboard.writeText(url);
    showToast("Enlace copiado");
  };

  const downloadHistory = () => {
    const dataStr = JSON.stringify(history, null, 2);
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);
    const link = document.createElement("a");
    link.href = dataUri;
    link.download = `iban-history-${new Date().toISOString().slice(0,10)}.json`;
    link.click();
    showToast("Historial descargado");
  };

  const generateRandom = () => {
    const entries = Object.entries(IBAN_MAP);
    const random = entries[Math.floor(Math.random() * entries.length)][1];
    setRawInput(random.example.replace(/\s/g, ""));
    setIsBulkMode(false);
    showToast("IBAN aleatorio generado");
  };

  const loadFromHistory = (entry: HistoryEntry) => {
    setRawInput(entry.iban);
    setIsBulkMode(false);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("ibanHistory");
  };

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 relative">
      <Container className="max-w-7xl py-12 md:py-20">

        {/* HERO */}
        <div className="text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 text-xs font-bold uppercase tracking-[3px] px-6 py-2 rounded-full mb-6 border border-emerald-200 dark:border-emerald-800">
            <ShieldCheck className="w-4 h-4" /> Validación en tiempo real • 100% client-side
          </motion.div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4">
            IBAN<span className="text-emerald-600">SCANNER</span>
          </h1>
          <p className="text-xl text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto">
            Valida, desglosa y extrae BIC/SWIFT al instante con el algoritmo oficial MOD97-10
          </p>
        </div>

        {/* Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-zinc-200 dark:bg-zinc-800 rounded-full p-1 flex">
            <button onClick={() => setIsBulkMode(false)} className={`px-8 py-2 text-sm font-semibold rounded-full transition-all ${!isBulkMode ? "bg-white dark:bg-zinc-900 shadow" : "text-zinc-500"}`}>
              Modo individual
            </button>
            <button onClick={() => setIsBulkMode(true)} className={`px-8 py-2 text-sm font-semibold rounded-full transition-all ${isBulkMode ? "bg-white dark:bg-zinc-900 shadow" : "text-zinc-500"}`}>
              Modo masivo
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-10">

          {/* COLUMNA PRINCIPAL */}
          <div className="lg:col-span-8 space-y-10">

            {/* Input / Textarea */}
            {!isBulkMode ? (
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500 rounded-[2.75rem] opacity-30 blur-xl group-focus-within:opacity-50 transition-all" />
                <div className="relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-[2.5rem] p-3 shadow-xl">
                  <div className="flex items-center bg-zinc-50 dark:bg-zinc-950 rounded-[2rem] px-6 py-5">
                    <Search className="w-7 h-7 text-zinc-400 mr-5" />
                    <input
                      ref={inputRef}
                      value={displayInput}
                      onChange={e => setRawInput(e.target.value.toUpperCase())}
                      placeholder="ES91 2100 0418 4500 1234 5678"
                      className="flex-1 bg-transparent text-3xl font-mono tracking-[4px] outline-none placeholder-zinc-300 dark:placeholder-zinc-700"
                    />
                    {rawInput && <button onClick={() => setRawInput("")} className="ml-4 text-zinc-400 hover:text-red-500"><X className="w-6 h-6" /></button>}
                    <button onClick={generateRandom} className="ml-3 text-emerald-600 hover:text-emerald-700" title="Generar IBAN aleatorio">
                      <Dice5 className="w-6 h-6" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <textarea
                value={bulkInput}
                onChange={e => setBulkInput(e.target.value.toUpperCase())}
                placeholder="Pega varios IBANs (uno por línea)"
                className="w-full h-56 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl p-8 text-xl font-mono resize-y outline-none"
              />
            )}

            {/* Resultado individual */}
            {!isBulkMode && (
              <AnimatePresence mode="wait">
                {result?.type === "success" ? (
                  <motion.div key="success" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="bg-white dark:bg-zinc-900 rounded-[3rem] shadow-2xl overflow-hidden border border-zinc-100 dark:border-zinc-800">
                    <div className="flex items-center gap-6 p-10 border-b border-zinc-100 dark:border-zinc-800">
                      <div className="shrink-0 w-24 h-16 rounded-2xl overflow-hidden shadow-xl border-4 border-white dark:border-zinc-900">
                        <ReactCountryFlag countryCode={result.countryCode} svg style={{ width: "100%", height: "100%" }} />
                      </div>
                      <div>
                        <h2 className="text-4xl font-black tracking-tighter">{result.country}</h2>
                        <p className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 text-sm font-bold uppercase tracking-widest mt-1">
                          <Globe className="w-4 h-4" /> {result.isSEPA ? "Zona SEPA" : "Internacional"}
                        </p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 p-10">
                      <div>
                        <div className="uppercase text-xs font-black tracking-widest text-zinc-400 mb-3">Entidad emisora</div>
                        <div className="bg-zinc-50 dark:bg-zinc-950 rounded-3xl p-6 border border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-2xl">{result.bankInfo?.name || "Banco no identificado"}</div>
                            {result.bankInfo?.bic && <div className="font-mono text-emerald-600 text-xl mt-1">{result.bankInfo.bic}</div>}
                          </div>
                          {result.bankInfo?.bic && (
                            <button onClick={() => handleCopy(result.bankInfo!.bic, "bic")} className="text-emerald-500 hover:scale-110 transition-transform">
                              {copiedId === "bic" ? <Check className="w-8 h-8" /> : <Copy className="w-8 h-8" />}
                            </button>
                          )}
                        </div>
                      </div>

                      <div className={`rounded-3xl p-10 text-center transition-all ${result.isValid ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-xl shadow-emerald-500/30" : "bg-zinc-100 dark:bg-zinc-800"}`}>
                        {result.isValid ? (
                          <>
                            <div className="mx-auto w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mb-6">
                              <Check className="w-12 h-12" />
                            </div>
                            <div className="text-4xl font-black tracking-tighter">¡IBAN VÁLIDO!</div>
                            <div className="text-emerald-100 text-sm mt-2">Checksum MOD97-10 correcto</div>
                          </>
                        ) : (
                          <div className="opacity-75">
                            <AlertCircle className="mx-auto w-12 h-12 mb-4" />
                            <div className="uppercase text-xs font-bold tracking-widest">Longitud incorrecta</div>
                            <div className="text-sm mt-1">Necesita {result.length} caracteres</div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="px-10 pb-10">
                      <div className="uppercase text-xs font-black tracking-widest text-zinc-400 mb-4">Desglose estructural</div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {result.breakdown.map((part, i) => (
                          <div key={i} className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-5 border border-zinc-100 dark:border-zinc-800 group relative">
                            <div className="text-[10px] font-bold uppercase text-zinc-400 tracking-widest mb-1">{part.label}</div>
                            <div className="font-mono text-xl font-semibold break-all">{part.value}</div>
                            {part.desc && <div className="text-xs text-emerald-600 mt-2 line-clamp-1">{part.desc}</div>}
                            <button onClick={() => handleCopy(part.value, `part-${i}`)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all text-emerald-500 hover:text-emerald-600">
                              {copiedId === `part-${i}` ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-4 mt-8 flex-wrap">
                        <button onClick={shareLink} className="flex-1 bg-zinc-900 text-white py-4 rounded-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                          <Share2 className="w-5 h-5" /> Compartir enlace
                        </button>
                        <button onClick={() => handleCopy(result.cleanValue, "clean")} className="flex-1 border border-zinc-300 dark:border-zinc-700 py-4 rounded-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest">
                          <Copy className="w-5 h-5" /> Copiar limpio
                        </button>
                        <div className="bg-zinc-100 dark:bg-zinc-950 rounded-2xl p-4 flex items-center justify-center">
                          <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${result.cleanValue}`} alt="QR IBAN" className="rounded-xl shadow-sm" />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : result?.type === "error" ? (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-900 rounded-[3rem] p-16 text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h3 className="text-3xl font-bold text-red-600 dark:text-red-400">{result.error}</h3>
                  </motion.div>
                ) : (
                  <div className="h-96 flex flex-col items-center justify-center opacity-50">
                    <div className="text-6xl mb-6">🏦</div>
                    <p className="text-2xl font-light italic text-zinc-400">Introduce un IBAN para comenzar el análisis</p>
                  </div>
                )}
              </AnimatePresence>
            )}

            {/* Resultados masivos */}
            {isBulkMode && bulkResults.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {bulkResults.map((item, i) => {
                  const res = item.result;
                  const isSuccess = res.type === "success";
                  const isValid = isSuccess && (res as SuccessResult).isValid;

                  return (
                    <div key={i} className={`p-6 rounded-3xl border ${isSuccess && isValid ? "bg-emerald-50 dark:bg-emerald-950 border-emerald-200" : "bg-white dark:bg-zinc-900 border-zinc-200"}`}>
                      <div className="font-mono text-lg mb-3 break-all">{item.iban}</div>
                      {isSuccess ? (
                        <div className="flex items-center gap-3 text-sm">
                          <ReactCountryFlag countryCode={(res as SuccessResult).countryCode} svg style={{ width: "28px" }} />
                          <span>{(res as SuccessResult).country}</span>
                          <span className={isValid ? "text-emerald-600 font-bold" : "text-amber-600"}>
                            {isValid ? "✓ VÁLIDO" : "✕ Inválido"}
                          </span>
                        </div>
                      ) : (
                        <div className="text-red-600 text-sm">País desconocido</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4 space-y-10">
            <div className="bg-white dark:bg-zinc-900 rounded-[2.5rem] p-8 shadow-xl border border-zinc-100 dark:border-zinc-800">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-zinc-400">
                  <Clock className="w-4 h-4" /> Recientes
                </div>
                {history.length > 0 && <button onClick={clearHistory} className="text-red-400 hover:text-red-600"><Trash2 className="w-5 h-5" /></button>}
              </div>

              <div className="space-y-4 max-h-96 overflow-auto pr-2">
                {history.length === 0 ? (
                  <div className="text-zinc-400 text-sm italic py-8 text-center">Aún no hay escaneos</div>
                ) : (
                  history.map(entry => (
                    <div key={entry.id} onClick={() => loadFromHistory(entry)} className="bg-zinc-50 dark:bg-zinc-950 rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all group flex gap-4 items-center">
                      <ReactCountryFlag countryCode={entry.result.countryCode} svg style={{ width: "42px", height: "auto" }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-mono text-sm truncate">{entry.formatted}</div>
                        <div className="text-xs text-emerald-600 font-medium">{entry.result.country}</div>
                      </div>
                      <div className={entry.result.isValid ? "text-emerald-500" : "text-amber-500"}>
                        {entry.result.isValid ? <Check className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {history.length > 0 && (
              <button onClick={downloadHistory} className="w-full bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 py-4 rounded-2xl flex items-center justify-center gap-3 text-sm uppercase tracking-widest hover:bg-emerald-50">
                <Download className="w-5 h-5" /> Descargar historial JSON
              </button>
            )}

            <div className="bg-gradient-to-br from-emerald-600 to-cyan-600 text-white rounded-[2.5rem] p-8 relative overflow-hidden">
              <Zap className="absolute -bottom-10 -right-10 w-40 h-40 opacity-10" />
              <div className="uppercase text-emerald-200 text-xs font-black tracking-[2px] mb-2">¿Sabías que?</div>
              <p className="text-xl font-medium leading-snug">El dígito de control del IBAN protege contra errores de tipeo en más del 99% de los casos.</p>
            </div>
          </div>
        </div>

        {/* DIRECTORIO */}
        <section className="mt-24 pt-20 border-t border-zinc-200 dark:border-zinc-800">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-8">
            <div>
              <h2 className="text-5xl font-black tracking-tighter">Directorio IBAN mundial</h2>
              <p className="text-zinc-500 mt-3 text-lg">Longitud oficial y ejemplos por país según ISO 13616</p>
            </div>
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Buscar país o código..."
                className="w-full pl-14 pr-6 py-4 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 rounded-3xl focus:border-emerald-500 outline-none text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Object.entries(IBAN_MAP)
              .filter(([code, data]) =>
                code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                data.country.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .map(([code, data]) => (
                <div
                  key={code}
                  onClick={() => setRawInput(data.example.replace(/\s/g, ""))}
                  className="bg-white dark:bg-zinc-900 border border-transparent hover:border-emerald-500/30 rounded-3xl p-7 cursor-pointer transition-all group hover:-translate-y-1"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <ReactCountryFlag countryCode={code} svg style={{ width: "42px", borderRadius: "6px" }} />
                    <div className="font-bold text-xl">{data.country}</div>
                  </div>
                  <div className="text-xs uppercase font-black tracking-widest text-zinc-400 mb-2">Longitud</div>
                  <div className="text-4xl font-black tabular-nums text-emerald-600">{data.length}</div>
                  <div className="mt-6 text-[11px] font-mono bg-zinc-100 dark:bg-zinc-950 p-4 rounded-2xl break-all leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {data.example}
                  </div>
                  <div className="mt-4 text-emerald-600 text-xs font-medium flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    Cargar ejemplo <span className="text-base">→</span>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </Container>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-white font-medium bg-emerald-600"
          >
            <Check className="w-6 h-6" />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}