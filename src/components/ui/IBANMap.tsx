// 🌍 IBAN_MAP completo 2026

export const IBAN_MAP: Record<
  string,
  {
    country: string;     // Nombre del país
    flag: string;        // Código ISO del país (para react-country-flag)
    isSEPA: boolean;     // Si pertenece a SEPA
    length: number;      // Longitud total del IBAN para validación
    example: string;     // Ejemplo de IBAN
  }
> = {





  AD: { country: "Andorra", flag: "AD", isSEPA: true, length: 24, example: "AD12 0001 2030 2003 5910 0100" },
  AE: { country: "Emiratos Árabes Unidos", flag: "AE", isSEPA: false, length: 23, example: "AE07 0331 2345 6789 0123 456" },
  AL: { country: "Albania", flag: "AL", isSEPA: true, length: 28, example: "AL47 2121 1009 0000 0002 3569 8741" },
  AT: { country: "Austria", flag: "AT", isSEPA: true, length: 20, example: "AT61 1904 3002 3457 3201" },
  AZ: { country: "Azerbaiyán", flag: "AZ", isSEPA: false, length: 28, example: "AZ21 NABZ 0000 0000 1370 1000 1944" },
  BA: { country: "Bosnia y Herzegovina", flag: "BA", isSEPA: false, length: 20, example: "BA39 1290 0794 0102 8494" },
  BE: { country: "Bélgica", flag: "BE", isSEPA: true, length: 16, example: "BE68 5390 0754 7034" },
  BG: { country: "Bulgaria", flag: "BG", isSEPA: true, length: 22, example: "BG80 BNBG 9661 1020 3456 78" },
  BH: { country: "Baréin", flag: "BH", isSEPA: false, length: 22, example: "BH67 BMAG 0000 1299 1234 56" },
  BI: { country: "Burundi", flag: "BI", isSEPA: false, length: 27, example: "BI29 0011 2345 6789 0123 4567 8" },
  BR: { country: "Brasil", flag: "BR", isSEPA: false, length: 29, example: "BR97 0036 0305 0000 1000 9795 493P1" },
  BY: { country: "Bielorrusia", flag: "BY", isSEPA: false, length: 28, example: "BY13 NBRB 3600 9000 0000 2Z00 AB00" },
  CH: { country: "Suiza", flag: "CH", isSEPA: true, length: 21, example: "CH93 0076 2011 6238 5295 7" },
  CY: { country: "Chipre", flag: "CY", isSEPA: true, length: 28, example: "CY17 0020 0128 0000 0012 0052 7600" },
  CZ: { country: "República Checa", flag: "CZ", isSEPA: true, length: 24, example: "CZ65 0800 0000 1920 0014 5399" },
  DE: { country: "Alemania", flag: "DE", isSEPA: true, length: 22, example: "DE89 3704 0044 0532 0130 00" },
  DK: { country: "Dinamarca", flag: "DK", isSEPA: true, length: 18, example: "DK50 0040 0440 1162 43" },
  DO: { country: "República Dominicana", flag: "DO", isSEPA: false, length: 28, example: "DO28 BAGR 0000 1234 5678 9012 3456" },
  EE: { country: "Estonia", flag: "EE", isSEPA: true, length: 20, example: "EE38 2200 2210 2014 5685" },
  EG: { country: "Egipto", flag: "EG", isSEPA: false, length: 29, example: "EG15 0100 0001 2345 6789 0123 456" },
  ES: { country: "España", flag: "ES", isSEPA: true, length: 24, example: "ES91 2100 0418 4502 0005 1332" },
  FI: { country: "Finlandia", flag: "FI", isSEPA: true, length: 18, example: "FI21 1234 5600 0007 85" },
  FO: { country: "Islas Feroe", flag: "FO", isSEPA: false, length: 18, example: "FO62 6460 0001 6312 3456" },
  FR: { country: "Francia", flag: "FR", isSEPA: true, length: 27, example: "FR14 2004 1010 0505 0001 3M02 606" },
  GB: { country: "Reino Unido", flag: "GB", isSEPA: true, length: 22, example: "GB29 RBKC 6016 1331 9268 19" },
  GE: { country: "Georgia", flag: "GE", isSEPA: false, length: 22, example: "GE29 NB00 0000 0101 9040 0070" },
  GI: { country: "Gibraltar", flag: "GI", isSEPA: true, length: 23, example: "GI75 NWBK 0000 0000 0000 1234" },
  GL: { country: "Groenlandia", flag: "GL", isSEPA: false, length: 18, example: "GL56 1400 0001 2345 67" },
  GR: { country: "Grecia", flag: "GR", isSEPA: true, length: 27, example: "GR16 0110 1250 0000 0001 2300 695" },
  HR: { country: "Croacia", flag: "HR", isSEPA: true, length: 21, example: "HR12 1001 0051 8630 0016 0" },
  HU: { country: "Hungría", flag: "HU", isSEPA: true, length: 28, example: "HU42 1177 3016 1111 1018 0000 0000" },
  IE: { country: "Irlanda", flag: "IE", isSEPA: true, length: 22, example: "IE29 AIBK 9311 5212 3456 78" },
  IL: { country: "Israel", flag: "IL", isSEPA: false, length: 23, example: "IL62 0108 0000 0009 9999 999" },
  IS: { country: "Islandia", flag: "IS", isSEPA: true, length: 26, example: "IS14 0159 2600 7654 5510 7303 39" },
  IT: { country: "Italia", flag: "IT", isSEPA: true, length: 27, example: "IT60 X054 2811 1010 0000 0123 456" },
  JO: { country: "Jordania", flag: "JO", isSEPA: false, length: 30, example: "JO94 CBJO 0010 0000 0000 0000 0131 0003" },
  KW: { country: "Kuwait", flag: "KW", isSEPA: false, length: 30, example: "KW81 CBKU 0000 0000 0000 1234 5601 01" },
  KZ: { country: "Kazajistán", flag: "KZ", isSEPA: false, length: 20, example: "KZ86 125K ZT20 0410 0100" },
  LB: { country: "Líbano", flag: "LB", isSEPA: false, length: 28, example: "LB62 0999 0000 0001 0019 0122 9114" },
  LI: { country: "Liechtenstein", flag: "LI", isSEPA: true, length: 21, example: "LI21 0881 0000 2324 013A A" },
  LT: { country: "Lituania", flag: "LT", isSEPA: true, length: 20, example: "LT12 1000 0111 0100 1000" },
  LU: { country: "Luxemburgo", flag: "LU", isSEPA: true, length: 20, example: "LU28 0019 4006 4475 0000" },
  LV: { country: "Letonia", flag: "LV", isSEPA: true, length: 21, example: "LV80 BANK 0000 4351 9500 1" },
  MC: { country: "Mónaco", flag: "MC", isSEPA: true, length: 27, example: "MC58 1122 2000 0101 2345 6789 030" },
  MD: { country: "Moldavia", flag: "MD", isSEPA: true, length: 24, example: "MD24 AG00 0225 1000 1310 4168" },
  ME: { country: "Montenegro", flag: "ME", isSEPA: true, length: 22, example: "ME25 5050 0001 2345 6789 51" },
  MK: { country: "Macedonia del Norte", flag: "MK", isSEPA: true, length: 19, example: "MK07 2501 2000 0058 984" },
  MT: { country: "Malta", flag: "MT", isSEPA: true, length: 31, example: "MT84 MALT 0110 0001 2345 MTLC AST0 01S" },
  NL: { country: "Países Bajos", flag: "NL", isSEPA: true, length: 18, example: "NL91 ABNA 0417 1643 00" },
  NO: { country: "Noruega", flag: "NO", isSEPA: true, length: 15, example: "NO93 8601 1117 947" },
  PL: { country: "Polonia", flag: "PL", isSEPA: true, length: 28, example: "PL60 1020 1026 0000 0422 7020 1111" },
  PT: { country: "Portugal", flag: "PT", isSEPA: true, length: 25, example: "PT50 0002 0123 1234 5678 9015 4" },
  RO: { country: "Rumanía", flag: "RO", isSEPA: true, length: 24, example: "RO49 AAAA 1B31 0075 9384 0000" },
  RS: { country: "Serbia", flag: "RS", isSEPA: true, length: 22, example: "RS35 2600 0560 1001 6113 79" },
  SE: { country: "Suecia", flag: "SE", isSEPA: true, length: 24, example: "SE45 5000 0000 0583 9825 7466" },
  SI: { country: "Eslovenia", flag: "SI", isSEPA: true, length: 19, example: "SI56 1910 0000 0123 438" },
  SK: { country: "Eslovaquia", flag: "SK", isSEPA: true, length: 24, example: "SK31 1200 0000 1987 4263 7541" },
  SM: { country: "San Marino", flag: "SM", isSEPA: true, length: 27, example: "SM86 U032 2509 8000 0000 0270 100" },
  TR: { country: "Turquía", flag: "TR", isSEPA: false, length: 26, example: "TR33 0006 1005 1978 6457 8413 26" },
  UA: { country: "Ucrania", flag: "UA", isSEPA: false, length: 29, example: "UA21 3996 2200 0000 2600 2300 1399" },
  VA: { country: "Vaticano", flag: "VA", isSEPA: true, length: 22, example: "VA59 0012 3000 0000 0012 345" },
};
