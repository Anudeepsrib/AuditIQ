'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, ArrowDown, ArrowUp, ChevronDown } from 'lucide-react';
import type { ModelVersion } from '@/lib/types/model';
import { ModelStageBadge } from './ModelStageBadge';
import { formatDate, formatPercentage } from '@/lib/utils/formatters';
import { ProgressRing } from '@/components/ui/ProgressRing';

interface ModelRegistryTableProps {
  models: ModelVersion[];
  isAdmin: boolean;
  onPromote: (model: ModelVersion) => void;
}

export function ModelRegistryTable({ models, isAdmin, onPromote }: ModelRegistryTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: keyof ModelVersion; direction: 'asc' | 'desc' } | null>(null);

  const sortedModels = [...models].sort((a, b) => {
    if (!sortConfig) return 0;
    const { key, direction } = sortConfig;
    if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
    if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (key: keyof ModelVersion) => {
    setSortConfig((current) => {
      if (current?.key === key) {
        return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[--border]">
            <th className="text-left py-3 px-4 text-sm font-medium text-[--text-secondary]">
              <button onClick={() => handleSort('version')} className="flex items-center gap-1">
                Version
                {sortConfig?.key === 'version' && (
                  sortConfig.direction === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                )}
              </button>
            </th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[--text-secondary]">Base Model</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[--text-secondary]">Stage</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[--text-secondary]">JSON Validity</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[--text-secondary]">Going Concern Recall</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[--text-secondary]">Created</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-[--text-secondary]">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedModels.map((model) => (
            <tr
              key={model.id}
              className="border-b border-[--border] hover:bg-[--surface-raised] transition-colors"
            >
              <td className="py-3 px-4">
                <Link
                  href={`/models/${model.version}`}
                  className="font-mono text-sm text-[--accent] hover:underline"
                >
                  {model.version}
                </Link>
              </td>
              <td className="py-3 px-4 text-sm text-[--text-primary]">{model.baseModel}</td>
              <td className="py-3 px-4">
                <ModelStageBadge stage={model.stage} />
              </td>
              <td className="py-3 px-4">
                <span className="font-mono text-sm">
                  {formatPercentage(model.metrics.jsonValidityRate)}
                </span>
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <ProgressRing
                    value={model.metrics.goingConcernRecall}
                    max={1}
                    size={32}
                    strokeWidth={3}
                    color={model.metrics.goingConcernRecall >= 0.95 ? '--stage-production' : '--error'}
                  />
                  <span className="font-mono text-sm">
                    {formatPercentage(model.metrics.goingConcernRecall)}
                  </span>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-[--text-secondary]">
                {formatDate(model.createdAt)}
              </td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/models/${model.version}`}
                    className="p-2 hover:bg-[--surface-raised] rounded-md transition-colors"
                    title="View details"
                  >
                    <ArrowUpRight className="h-4 w-4 text-[--text-secondary]" />
                  </Link>
                  {isAdmin && model.stage !== 'production' && (
                    <button
                      onClick={() => onPromote(model)}
                      disabled={model.metrics.goingConcernRecall < 0.95}
                      className="px-3 py-1 text-xs font-medium bg-[--accent] text-[--background] rounded-md hover:bg-[--accent-hover] disabled:opacity-50 disabled:cursor-not-allowed"
                      title={model.metrics.goingConcernRecall < 0.95 ? 'Cannot promote: recall < 95%' : 'Promote to production'}
                    >
                      Promote
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
