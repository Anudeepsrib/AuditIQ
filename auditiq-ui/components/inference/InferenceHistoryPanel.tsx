'use client';

import { useInferenceHistory } from '@/lib/hooks/useInference';
import { formatDate, formatDuration } from '@/lib/utils/formatters';
import { Clock, FileText } from 'lucide-react';

interface InferenceHistoryPanelProps {
  onSelectItem?: (id: string) => void;
}

export function InferenceHistoryPanel({ onSelectItem }: InferenceHistoryPanelProps) {
  const history = useInferenceHistory();

  if (history.length === 0) {
    return (
      <div className="text-center py-8 text-[--text-tertiary]">
        <Clock className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">No recent extractions</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-[--text-secondary] mb-3">
        Recent Extractions (Session)
      </h3>
      {history.map((item) => (
        <button
          key={item.id}
          onClick={() => onSelectItem?.(item.id)}
          className="w-full text-left p-3 bg-[--surface-raised] hover:bg-[--border-strong] rounded-lg transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[--accent]" />
              <span className="text-sm font-medium text-[--text-primary]">
                {item.documentType}
              </span>
            </div>
            <span className="text-xs text-[--text-tertiary]">
              {formatDuration(item.latency / 1000)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[--text-secondary]">
            <span className="font-mono">{item.modelVersion}</span>
            <span>{formatDate(item.timestamp)}</span>
          </div>
        </button>
      ))}
    </div>
  );
}
