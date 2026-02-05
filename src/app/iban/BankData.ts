// src/app/iban/BankData.ts

export interface BankInfo {
  name: string;
  bic: string;
  country: string;
  logo?: string; // Opcional, por si decides añadir iconos luego
}

/**
 * Registro de Entidades Bancarias
 * La clave (key) representa el código de entidad que se extrae del IBAN.
 * Nota: En España son los 4 primeros dígitos después del código de país y control.
 */
export const BANK_REGISTRY: Record<string, BankInfo> = {
  // --- ESPAÑA (Bancos Tradicionales) ---
  "2100": { name: "CaixaBank", bic: "CAIXESBB", country: "ES" },
  "0049": { name: "Banco Santander", bic: "BSANESMM", country: "ES" },
  "0182": { name: "BBVA", bic: "BBVAESMM", country: "ES" },
  "0081": { name: "Banco Sabadell", bic: "BSABESBB", country: "ES" },
  "0075": { name: "Banco Popular", bic: "POPUESMM", country: "ES" },
  "0128": { name: "Bankinter", bic: "BKNTERMM", country: "ES" },
  "2048": { name: "Liberbank / Unicaja", bic: "CARESMMB", country: "ES" },
  "2080": { name: "Abanca", bic: "CAGSESMM", country: "ES" },
  "3058": { name: "Cajamar", bic: "CAGRESMM", country: "ES" },
  "0061": { name: "Banca March", bic: "BAMRESMM", country: "ES" },

  // --- NEOBANCOS Y BANCA DIGITAL (Muy comunes en Finanzaseu) ---
  "1465": { name: "ING Bank NV", bic: "INGEESMM", country: "ES" },
  "0239": { name: "EVO Banco", bic: "EVOBESMM", country: "ES" },
  "0011": { name: "Revolut Bank (Sucursal ES)", bic: "REVOESMM", country: "ES" },
  "3159": { name: "Revolut Bank (Sede Central)", bic: "REVOVEE1", country: "LT" },
  "1544": { name: "Qonto", bic: "QNTOESMM", country: "ES" },
  "0152": { name: "Openbank", bic: "OTPBESMM", country: "ES" },
  "2038": { name: "Bankia (ahora CaixaBank)", bic: "CAIXESBB", country: "ES" },
  "0241": { name: "N26 Bank AG", bic: "N26EESMM", country: "ES" },
  "0232": { name: "Banco Inversis", bic: "INVESMM1", country: "ES" },
  "0019": { name: "Deutsche Bank", bic: "DEUTESMM", country: "ES" },

  // --- INTERNACIONAL / NEOBANCOS EUROPA ---
  "REVO": { name: "Revolut Bank UAB", bic: "REVOVEE1", country: "LT" },
  "N26B": { name: "N26 Bank AG", bic: "N26DEFFXXX", country: "DE" },
  "WISE": { name: "Wise (ex-TransferWise)", bic: "TRWIBE22", country: "BE" },
};

/**
 * Función de utilidad para obtener datos del banco basados en el código de entidad.
 * Soporta la lógica de extracción según el país.
 */
export const getBankInfo = (entityCode: string): BankInfo | undefined => {
  return BANK_REGISTRY[entityCode];
};