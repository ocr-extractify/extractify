export type DataExtractionRegexField = {
  name: string;
  regex: string;
};

export type DataExtractionRegexFieldSample = {
  label: string;
  name: string;
  regex: string;
};

// NOTE: THE REGEX SHOULD BE IN PYTHON FORMAT
// TODO: Find a way to use the i18n translation for the label
export const dataExtractionRegexFields: DataExtractionRegexFieldSample[] = [
  {
    label: 'Email',
    name: 'email',
    regex: '[a-z0-9_.+-]+@[a-z0-9-]+\\.[a-z0-9-.]+', // Note the double backslash
  },
  {
    label: 'CPF',
    name: 'cpf',
    regex: '(?:\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}|\\d{11})',
  },
  {
    label: 'CNPJ',
    name: 'cnpj',
    regex: '(?:\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}|\\d{14})',
  },
  {
    label: 'CEP',
    name: 'cep',
    regex: '\\b\\d{5}-?\\d{3}\\b',
  },
  {
    label: 'Telefone (Brasil, DDD + celular ou fixo)',
    name: 'br_phone',
    regex:
      '(?:(?:\\+|00)?55\\s?)?(?:\\(?[1-9][0-9]\\)?\\s?)(?:9\\d{4}|[2-8]\\d{3})-?\\d{4}',
  },
  {
    label: 'Placa de veículo (Mercosul ou antigo)',
    name: 'license_plate',
    regex: '\\b[A-Z]{3}-?\\d{4}\\b',
  },
  {
    label: 'Boleto / linha digitável',
    name: 'boleto',
    regex:
      '(?:\\d{5}\\.\\d{5}\\s\\d{5}\\.\\d{6}\\s\\d{5}\\.\\d{6}\\s\\d\\s\\d{14}|\\d{47,48})',
  },
  {
    label: 'Chave PIX aleatória (UUID-like)',
    name: 'pix_random_key',
    regex: '[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}',
  },
  {
    label: 'RNE (Estrangeiro)',
    name: 'rne',
    regex: '\\bRNE[A-Z\\d]\\d{6}[A-Z\\d]\\b',
  },
  {
    label: 'RENAVAM',
    name: 'renavam',
    regex: '(?:\\d{4}\\.\\d{6}-\\d|\\d{11})',
  },
  {
    label: 'UF (siglas de estados brasileiros)',
    name: 'br_state',
    regex:
      '\\b(?:AC|AL|AP|AM|BA|CE|DF|ES|GO|MA|MT|MS|MG|PA|PB|PR|PE|PI|RJ|RN|RS|RO|RR|SC|SP|SE|TO)\\b',
  },
  {
    label: 'Data (várias formas: YYYY‑MM‑DD, DD/MM/YYYY, D MMM YYYY)',
    name: 'date_generic',
    regex:
      '(?:\\d{4}[/-]\\d{1,2}[/-]\\d{1,2}|\\d{1,2}[/-]\\d{1,2}[/-]\\d{4}|\\d{1,2}\\s+[A-Z]{3}\\s+\\d{4})',
  },
  {
    label: 'Valor monetário (R$, $, €, etc.)',
    name: 'currency',
    regex: '(?:R\\$|\\$|€|£|¥|₩)\\s?\\d{1,3}(?:[\\.,]\\d{3})*(?:[\\.,]\\d{2})?',
  },
  {
    label: 'Porcentagem',
    name: 'percentage',
    regex: '\\d{1,3}(?:\\.\\d+)?%',
  },
  {
    label: 'URL',
    name: 'url',
    regex: 'https?://\\S+',
  },
];

export const defaultRegexFields = [dataExtractionRegexFields[0]];
