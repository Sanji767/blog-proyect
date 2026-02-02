// src/app/iban/BankData.ts

export interface BankInfo {
  name: string;
  bic: string;
  country: string;
}

// Ejemplo enfocado a España y Neobancos (puedes ampliarlo)
export const BANK_REGISTRY: Record<string, BankInfo> = {
  "2100": { name: "CaixaBank", bic: "CAIXESBB", country: "ES" },
  "0049": { name: "Banco Santander", bic: "BSANESMM", country: "ES" },
  "0081": { name: "Banco Sabadell", bic: "BSABESBB", country: "ES" },
  "0182": { name: "BBVA", bic: "BBVAESMM", country: "ES" },
  "0011": { name: "Revolut Bank", bic: "REVOVEE1", country: "LT" }, // Para IBANs LT
  "0239": { name: "EVO Banco", bic: "EVOBESMM", country: "ES" },
  "1465": { name: "ING Bank NV", bic: "INGEESMM", country: "ES" },
};