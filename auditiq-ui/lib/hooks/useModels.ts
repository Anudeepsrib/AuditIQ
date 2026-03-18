import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { modelsApi } from '@/lib/api/models';
import { toast } from 'sonner';

export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: modelsApi.getModels,
  });
}

export function useModelDetail(version: string) {
  return useQuery({
    queryKey: ['model', version],
    queryFn: () => modelsApi.getModelDetail(version),
    enabled: !!version,
  });
}

export function usePromoteModel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modelsApi.promoteModel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['models'] });
      toast.success('Model promoted to production successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to promote model: ${error.message}`);
    },
  });
}

export function useModelComparison(version: string) {
  return useQuery({
    queryKey: ['model', version, 'comparison'],
    queryFn: () => modelsApi.getModelComparison(version),
    enabled: !!version,
  });
}
