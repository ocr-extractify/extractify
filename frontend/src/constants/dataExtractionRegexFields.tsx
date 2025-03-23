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
export const dataExtractionRegexFields: DataExtractionRegexFieldSample[] = [
    {
        label: "Email",
        name: "email",
        regex: "[a-z0-9_.+-]+@[a-z0-9-]+\.[a-z0-9-.]+",
    }
];

export const defaultRegexFields = [dataExtractionRegexFields[0]]