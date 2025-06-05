export type DataExtractionRegexField = {
    name: string;
    regex: string;
}

export type DataExtractionRegexFieldSample = {
    label: string
    name: string;
    regex: string;
}

// THE REGEX SHOULD BE IN PYTHON FORMAT
// TODO: Find a way to use the i18n translation for the label
export const dataExtractionRegexFields: DataExtractionRegexFieldSample[] = [
    {
        label: "Email",
        name: "email",
        regex: "[a-z0-9_.+-]+@[a-z0-9-]+\\.[a-z0-9-.]+",  // Note the double backslash
    },
    {
        label: 'Valor (dinheiro)',
        name: "brl_currency",
        regex: "(?:R\\$|\\$|€|£|¥|₩)\\s?\\d{1,3}(?:[\\.,]\\d{3})*(?:[\\.,]\\d{2})?",
    },
    {
        label: 'Data',
        name: 'date',
        regex: '(?:\\d{4}[/-]\\d{1,2}[/-]\\d{1,2})|(?:\\d{1,2}[/-]\\d{1,2}[/-]\\d{4})|(?:\\d{1,2}\\s+[A-Z]{3}\\s+\\d{4})'
    },
    {
        label: "Código de barras",
        name: "barcode",
        regex: "(?:\\d{11}\\s*){4}\\d{1,5}\\b|\\b\\d{47,48}\\b"
    },
    {
        label: "CPF/CNPJ",
        name: "cpf_cnpj",
        regex: "(\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}|\\d{11})|(\\d{2}\\.\\d{3}\\.\\d{3}/\\d{4}-\\d{2}|\\d{14})"
    }
];

export const defaultRegexFields = [dataExtractionRegexFields[0]]