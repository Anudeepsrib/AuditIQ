export type ModelStage = 'production' | 'staging' | 'archived';

export interface ModelVersion {
  id: string;
  version: string;
  baseModel: string;
  stage: ModelStage;
  createdAt: string;
  trainingRunId: string;
  datasetVersionId: string;
  loraConfig: LoRAConfig;
  metrics: ModelMetrics;
  isProduction: boolean;
}

export interface LoRAConfig {
  r: number;
  alpha: number;
  targetModules: string[];
  dropout: number;
  bias: string;
}

export interface ModelMetrics {
  jsonValidityRate: number;
  exactMatchRate: number;
  goingConcernRecall: number;
  averageConfidence: number;
  latencyP50: number;
  latencyP95: number;
  tokenEfficiency: number;
}

export interface ModelComparison {
  modelVersion: ModelVersion;
  baseModelMetrics: ModelMetrics;
  fineTunedMetrics: ModelMetrics;
  improvements: Record<string, number>;
}

export interface PromoteModelRequest {
  version: string;
  confirmed: boolean;
}
