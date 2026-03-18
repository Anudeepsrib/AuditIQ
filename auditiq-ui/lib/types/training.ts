export type TrainingStatus = 'queued' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface TrainingRun {
  id: string;
  status: TrainingStatus;
  datasetVersionId: string;
  config: TrainingConfig;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  duration?: number;
  bestEpoch?: number;
  currentEpoch?: number;
  totalEpochs: number;
  currentLoss?: number;
  bestEvalLoss?: number;
  finalMetrics?: TrainingMetrics;
  artifacts?: TrainingArtifacts;
}

export interface TrainingConfig {
  baseModel: string;
  loraR: number;
  loraAlpha: number;
  loraDropout: number;
  targetModules: string[];
  learningRate: number;
  numEpochs: number;
  batchSize: number;
  gradientAccumulationSteps: number;
  warmupSteps: number;
  maxSeqLength: number;
  seed: number;
}

export interface TrainingMetrics {
  jsonValidityRate: number;
  exactMatchRate: number;
  goingConcernRecall: number;
  averageConfidence: number;
  finalTrainLoss: number;
  finalEvalLoss: number;
}

export interface TrainingArtifacts {
  adapterWeightsUrl: string;
  configUrl: string;
  evalResultsUrl: string;
  trainingLogUrl: string;
}

export interface EpochMetrics {
  epoch: number;
  trainLoss: number;
  evalLoss: number;
  jsonValidityRate: number;
  exactMatchRate: number;
  learningRate: number;
}

export interface TriggerTrainingRequest {
  datasetVersionId: string;
}

export interface LiveTrainingProgress {
  runId: string;
  status: TrainingStatus;
  currentEpoch: number;
  totalEpochs: number;
  currentLoss: number;
  bestEvalLoss: number;
  elapsedTime: number;
  estimatedRemaining: number;
  metrics: EpochMetrics[];
}
