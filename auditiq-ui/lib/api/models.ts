import { apiClient } from './client';
import type { ModelVersion, PromoteModelRequest, ModelComparison } from '@/lib/types/model';

export const modelsApi = {
  getModels: async (): Promise<ModelVersion[]> => {
    const response = await apiClient.get<ModelVersion[]>('/models');
    return response.data;
  },

  getModelDetail: async (version: string): Promise<ModelVersion> => {
    const response = await apiClient.get<ModelVersion>(`/models/${version}`);
    return response.data;
  },

  promoteModel: async (request: PromoteModelRequest): Promise<ModelVersion> => {
    const response = await apiClient.post<ModelVersion>('/models/promote', request);
    return response.data;
  },

  getModelComparison: async (version: string): Promise<ModelComparison> => {
    const response = await apiClient.get<ModelComparison>(`/models/${version}/comparison`);
    return response.data;
  },
};
