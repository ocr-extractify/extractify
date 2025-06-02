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
        label: 'BRL Currency',
        name: "brl_currency",
        regex: "(?:R\\$|\\$|€|£|¥|₩)\\s?\\d{1,3}(?:[\\.,]\\d{3})*(?:[\\.,]\\d{2})?",
    }
];

export const defaultRegexFields = [dataExtractionRegexFields[0]]