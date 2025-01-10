import { GoogleDocumentAiAnalysis } from "@/utils/types/google_doc_ai";

/**
 * Represents a file object retrieve from API.
*/
export type APIFile = {
    _id: string;
    name: string;
    created_at: string;
    analysis: GoogleDocumentAiAnalysis;
};