export interface ExtractionField {
  value: string | number | boolean | string[];
  confidence: number;
}

export interface ExtractedDocument {
  documentType: string;
  confidence: number;
  fields: Record<string, ExtractionField>;
  goingConcernFlag: boolean;
  monetaryValues: Record<string, number>;
  riskFactors: string[];
}

export interface ExtractionRequest {
  text: string;
  modelVersion?: string;
  documentType?: string;
}

export interface ExtractionResponse {
  id: string;
  modelVersion: string;
  documentType: string;
  documentTypeConfidence: number;
  extractedData: ExtractedDocument;
  rawOutput: string;
  latencyMs: number;
  timestamp: string;
  tokenCount: {
    input: number;
    output: number;
    total: number;
  };
}

export interface ClassificationResult {
  documentType: string;
  confidence: number;
  allScores: Record<string, number>;
}

export interface InferenceHistoryItem {
  id: string;
  timestamp: string;
  modelVersion: string;
  documentType: string;
  latency: number;
  input: string;
  output: ExtractionResponse;
}
