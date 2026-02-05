// src/app/iban/IBANMap.ts

export interface IBANCountry {
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2 (compatible con react-country-flag)
  isSEPA: boolean;
  length: number;
  example: string;
}

export const IBAN_MAP: Record<string, IBANCountry> = {
  AD: { country: "Andorra", countryCode: "AD", isSEPA: true, length: 24, example: "AD00 0001 2345 6789 0123 4567" },
  AL: { country: "Albania", countryCode: "AL", isSEPA: false, length: 28, example: "AL00 1234 5678 9012 3456 7890 1234" },
  AT: { country: "Austria", countryCode: "AT", isSEPA: true, length: 20, example: "AT00 1234 5678 9012 3456" },
  BE: { country: "Bélgica", countryCode: "BE", isSEPA: true, length: 16, example: "BE00 1234 5678 9012" },
  BG: { country: "Bulgaria", countryCode: "BG", isSEPA: true, length: 22, example: "BG00 BNBG 1234 5678 9012 34" },
  CH: { country: "Suiza", countryCode: "CH", isSEPA: true, length: 21, example: "CH00 1234 5678 9012 3456 7" },
  CY: { country: "Chipre", countryCode: "CY", isSEPA: true, length: 28, example: "CY00 1234 5678 9012 3456 7890 1234" },
  CZ: { country: "República Checa", countryCode: "CZ", isSEPA: true, length: 24, example: "CZ00 1234 5678 9012 3456 7890" },
  DE: { country: "Alemania", countryCode: "DE", isSEPA: true, length: 22, example: "DE00 1234 5678 9012 3456 78" },
  DK: { country: "Dinamarca", countryCode: "DK", isSEPA: true, length: 18, example: "DK00 1234 5678 9012 34" },
  EE: { country: "Estonia", countryCode: "EE", isSEPA: true, length: 20, example: "EE00 1234 5678 9012 3456" },
  ES: { country: "España", countryCode: "ES", isSEPA: true, length: 24, example: "ES00 1234 5678 9012 3456 7890" },
  FI: { country: "Finlandia", countryCode: "FI", isSEPA: true, length: 18, example: "FI00 1234 5678 9012 34" },
  FR: { country: "Francia", countryCode: "FR", isSEPA: true, length: 27, example: "FR00 1234 5678 9012 3456 7890 123" },
  GB: { country: "Reino Unido", countryCode: "GB", isSEPA: true, length: 22, example: "GB00 ABCD 1234 5678 9012 34" },
  GI: { country: "Gibraltar", countryCode: "GI", isSEPA: true, length: 23, example: "GI00 ABCD 1234 5678 9012 345" },
  GR: { country: "Grecia", countryCode: "GR", isSEPA: true, length: 27, example: "GR00 1234 5678 9012 3456 7890 123" },
  HR: { country: "Croacia", countryCode: "HR", isSEPA: true, length: 21, example: "HR00 1234 5678 9012 3456 7" },
  HU: { country: "Hungría", countryCode: "HU", isSEPA: true, length: 28, example: "HU00 1234 5678 9012 3456 7890 1234" },
  IE: { country: "Irlanda", countryCode: "IE", isSEPA: true, length: 22, example: "IE00 ABCD 1234 56 7890 1234" },
  IS: { country: "Islandia", countryCode: "IS", isSEPA: true, length: 26, example: "IS00 1234 5678 9012 3456 7890 12" },
  IT: { country: "Italia", countryCode: "IT", isSEPA: true, length: 27, example: "IT00 A123 4567 8901 2345 6789 012" },
  LI: { country: "Liechtenstein", countryCode: "LI", isSEPA: true, length: 21, example: "LI00 1234 5678 9012 3456 7" },
  LT: { country: "Lituania", countryCode: "LT", isSEPA: true, length: 20, example: "LT00 1234 5678 9012 3456" },
  LU: { country: "Luxemburgo", countryCode: "LU", isSEPA: true, length: 20, example: "LU00 1234 5678 9012 3456" },
  LV: { country: "Letonia", countryCode: "LV", isSEPA: true, length: 21, example: "LV00 ABCD 1234 5678 9012 3" },
  MC: { country: "Mónaco", countryCode: "MC", isSEPA: true, length: 27, example: "MC00 1234 5678 9012 3456 7890 123" },
  MT: { country: "Malta", countryCode: "MT", isSEPA: true, length: 31, example: "MT00 ABCD 1234 5678 9012 3456 7890 123" },
  NL: { country: "Países Bajos", countryCode: "NL", isSEPA: true, length: 18, example: "NL00 ABCD 1234 5678 90" },
  NO: { country: "Noruega", countryCode: "NO", isSEPA: true, length: 15, example: "NO00 1234 5678 901" },
  PL: { country: "Polonia", countryCode: "PL", isSEPA: true, length: 28, example: "PL00 1234 5678 9012 3456 7890 1234" },
  PT: { country: "Portugal", countryCode: "PT", isSEPA: true, length: 25, example: "PT00 1234 5678 9012 3456 7890 1" },
  RO: { country: "Rumanía", countryCode: "RO", isSEPA: true, length: 24, example: "RO00 ABCD 1234 5678 9012 3456" },
  SE: { country: "Suecia", countryCode: "SE", isSEPA: true, length: 24, example: "SE00 1234 5678 9012 3456 7890" },
  SI: { country: "Eslovenia", countryCode: "SI", isSEPA: true, length: 19, example: "SI00 1234 5678 901" },
  SK: { country: "Eslovaquia", countryCode: "SK", isSEPA: true, length: 24, example: "SK00 1234 5678 9012 3456 7890" },
  SM: { country: "San Marino", countryCode: "SM", isSEPA: true, length: 27, example: "SM00 A123 4567 8901 2345 6789 012" },
  TR: { country: "Turquía", countryCode: "TR", isSEPA: false, length: 26, example: "TR00 1234 5678 9012 3456 7890 12" },
  AE: { country: "EAU", countryCode: "AE", isSEPA: false, length: 23, example: "AE00 1234 5678 9012 3456 789" },
};