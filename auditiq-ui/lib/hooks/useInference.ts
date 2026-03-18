import { useMutation, useQuery } from '@tanstack/react-query';
import { inferenceApi } from '@/lib/api/inference';
import { useInferenceStore } from '@/lib/stores/inferenceStore';
import type { ExtractionRequest, ExtractionResponse, InferenceHistoryItem } from '@/lib/types/inference';

export function useExtract() {
  const addToHistory = useInferenceStore((state) => state.addToHistory);

  return useMutation({
    mutationFn: async (request: ExtractionRequest) => {
      const response = await inferenceApi.extract(request);
      return response;
    },
    onSuccess: (data) => {
      const historyItem: InferenceHistoryItem = {
        id: data.id,
        timestamp: data.timestamp,
        modelVersion: data.modelVersion,
        documentType: data.documentType,
        latency: data.latencyMs,
        input: '', // We don't store the full input for privacy
        output: data,
      };
      addToHistory(historyItem);
    },
  });
}

export function useClassify() {
  return useMutation({
    mutationFn: inferenceApi.classify,
  });
}

export function useModelVersions() {
  return useQuery({
    queryKey: ['model-versions'],
    queryFn: inferenceApi.getModelVersions,
  });
}

export function useInferenceHistory() {
  return useInferenceStore((state) => state.history);
}
