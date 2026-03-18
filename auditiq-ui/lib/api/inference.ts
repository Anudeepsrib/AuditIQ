import { apiClient } from './client';
import type { 
  ExtractionRequest, 
  ExtractionResponse, 
  ClassificationResult 
} from '@/lib/types/inference';

export const inferenceApi = {
  extract: async (request: ExtractionRequest): Promise<ExtractionResponse> => {
    const response = await apiClient.post<ExtractionResponse>('/inference/extract', request);
    return response.data;
  },

  classify: async (request: { text: string }): Promise<ClassificationResult> => {
    const response = await apiClient.post<ClassificationResult>('/inference/classify', request);
    return response.data;
  },

  getModelVersions: async (): Promise<Array<{ version: string; stage: string; goingConcernRecall: number }>> => {
    // In production, this would fetch from /models endpoint
    // For now, returning mock data
    return [
      { version: 'v1.2.3', stage: 'production', goingConcernRecall: 0.967 },
      { version: 'v1.2.4-rc1', stage: 'staging', goingConcernRecall: 0.972 },
      { version: 'v1.2.2', stage: 'archived', goingConcernRecall: 0.958 },
    ];
  },
};
