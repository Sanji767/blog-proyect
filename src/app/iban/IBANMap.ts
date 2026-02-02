// src/app/iban/IBANMap.ts

export interface IBANCountry {
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2 para react-country-flag
  isSEPA: boolean;
  length: number;
  example: string;
}

export const IBAN_MAP: Record<string, IBANCountry> = {
  AD: { country: "Andorra", countryCode: "AD", isSEPA: true, length: 24, example: "AD12 0001 2030 2003 5910 0100" },
  AT: { country: "Austria", countryCode: "AT", isSEPA: true, length: 20, example: "AT12 1234 5678 9012 3456" },
  BE: { country: "Bélgica", countryCode: "BE", isSEPA: true, length: 16, example: "BE12 3456 7890 1234" },
  DE: { country: "Alemania", countryCode: "DE", isSEPA: true, length: 22, example: "DE12 1234 5678 9012 3456 78" },
  ES: { country: "España", countryCode: "ES", isSEPA: true, length: 24, example: "ES12 1234 5678 9012 3456 7890" },
  FR: { country: "Francia", countryCode: "FR", isSEPA: true, length: 27, example: "FR12 1234 5678 9012 3456 7890 123" },
  GB: { country: "Reino Unido", countryCode: "GB", isSEPA: true, length: 22, example: "GB12 ABCD 1234 5678 9012 34" },
  IT: { country: "Italia", countryCode: "IT", isSEPA: true, length: 27, example: "IT12 A123 4567 8901 2345 6789 012" },
  LT: { country: "Lituania", countryCode: "LT", isSEPA: true, length: 20, example: "LT12 1234 5678 9012 3456" },
  PT: { country: "Portugal", countryCode: "PT", isSEPA: true, length: 25, example: "PT12 1234 5678 9012 3456 7890 1" },
  // Agrega aquí el resto de países de tu lista original
};