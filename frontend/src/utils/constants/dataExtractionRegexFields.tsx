export type DataExtractionRegexField = {
    name: string;
    regex: string;
}

export type DataExtractionRegexFieldSample = {
    label: string
    name: string;
    regex: string;
}

export const dataExtractionRegexFields: DataExtractionRegexFieldSample[] = [
    {
        label: "Email",
        name: "email",
        regex: "/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i",
    }
];
