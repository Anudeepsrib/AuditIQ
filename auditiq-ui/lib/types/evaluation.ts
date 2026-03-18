export interface EvaluationRun {
  id: string;
  modelVersion: string;
  trainingRunId?: string;
  datasetVersionId: string;
  status: 'running' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  duration?: number;
  metrics: EvaluationMetrics;
  confusionMatrix: ConfusionMatrix;
  failureExamples: FailureExample[];
}

export interface EvaluationMetrics {
  totalSamples: number;
  jsonValidityRate: number;
  exactMatchRate: number;
  partialMatchRate: number;
  goingConcernRecall: number;
  goingConcernPrecision: number;
  goingConcernF1: number;
  documentTypeAccuracy: number;
  averageConfidence: number;
  confidenceCalibrationError: number;
  latencyP50: number;
  latencyP95: number;
  tokenEfficiency: number;
  fieldLevelAccuracy: Record<string, number>;
  fieldLevelRecall: Record<string, number>;
  fieldLevelPrecision: Record<string, number>;
}

export interface ConfusionMatrix {
  labels: string[];
  matrix: number[][];
}

export interface FailureExample {
  id: string;
  inputExcerpt: string;
  expectedOutput: string;
  actualOutput: string;
  errorType: 'json_invalid' | 'schema_mismatch' | 'value_extraction_error' | 'document_type_error' | 'other';
  documentType: string;
  confidence: number;
}

export interface BaselineComparison {
  metric: string;
  baselineValue: number;
  fineTunedValue: number;
  delta: number;
  deltaPercent: number;
}
