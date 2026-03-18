'use client';

import { useState } from 'react';
import { FileJson, List, Tag } from 'lucide-react';
import type { ExtractionResponse } from '@/lib/types/inference';
import { ExtractionFieldGrid } from './ExtractionFieldGrid';
import { JsonViewer } from '@/components/ui/JsonViewer';

type Tab = 'fields' | 'json' | 'classify';

interface ExtractionResultPanelProps {
  result: ExtractionResponse | null;
}

export function ExtractionResultPanel({ result }: ExtractionResultPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>('fields');

  if (!result) {
    return (
      <div className="h-full flex items-center justify-center text-[--text-secondary]">
        <div className="text-center">
          <List className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Extracted data will appear here</p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'fields', label: 'Extracted Fields', icon: List },
    { id: 'json', label: 'Raw JSON', icon: FileJson },
    { id: 'classify', label: 'Classify Only', icon: Tag },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Tabs */}
      <div className="flex border-b border-[--border]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-[--accent] border-b-2 border-[--accent]'
                : 'text-[--text-secondary] hover:text-[--text-primary]'
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === 'fields' && (
          <ExtractionFieldGrid data={result.extractedData} />
        )}
        {activeTab === 'json' && (
          <JsonViewer data={result} />
        )}
        {activeTab === 'classify' && (
          <div className="space-y-4">
            <div className="bg-[--surface-raised] rounded-lg p-4">
              <p className="text-sm text-[--text-secondary] mb-1">Document Type</p>
              <p className="text-lg font-mono text-[--text-primary]">
                {result.documentType}
              </p>
            </div>
            <div className="bg-[--surface-raised] rounded-lg p-4">
              <p className="text-sm text-[--text-secondary] mb-1">Confidence</p>
              <p className="text-lg font-mono text-[--accent]">
                {(result.documentTypeConfidence * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
