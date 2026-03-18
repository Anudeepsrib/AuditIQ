'use client';

import { useModelVersions } from '@/lib/hooks/useInference';
import { formatPercentage } from '@/lib/utils/formatters';

interface ModelVersionSelectorProps {
  value?: string;
  onChange: (value: string) => void;
}

export function ModelVersionSelector({ value, onChange }: ModelVersionSelectorProps) {
  const { data: versions, isLoading } = useModelVersions();

  if (isLoading) {
    return (
      <select
        disabled
        className="flex h-10 w-full rounded-md border border-[--border] bg-[--surface] px-3 py-2 text-sm text-[--text-tertiary]"
      >
        <option>Loading models...</option>
      </select>
    );
  }

  const productionModel = versions?.find((v) => v.stage === 'production');
  const stagingModels = versions?.filter((v) => v.stage === 'staging') || [];

  return (
    <select
      value={value || productionModel?.version || ''}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border border-[--border] bg-[--surface] px-3 py-2 text-sm text-[--text-primary] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]"
    >
      {productionModel && (
        <optgroup label="Production">
          <option value={productionModel.version}>
            {productionModel.version} — {formatPercentage(productionModel.goingConcernRecall, 1)} recall
          </option>
        </optgroup>
      )}
      {stagingModels.length > 0 && (
        <optgroup label="Staging">
          {stagingModels.map((model) => (
            <option key={model.version} value={model.version}>
              {model.version} — {formatPercentage(model.goingConcernRecall, 1)} recall
            </option>
          ))}
        </optgroup>
      )}
    </select>
  );
}
