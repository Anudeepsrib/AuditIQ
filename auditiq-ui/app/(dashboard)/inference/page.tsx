'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { ExtractionForm } from '@/components/inference/ExtractionForm';
import { ExtractionResultPanel } from '@/components/inference/ExtractionResultPanel';
import { InferenceHistoryPanel } from '@/components/inference/InferenceHistoryPanel';
import { useExtract } from '@/lib/hooks/useInference';
import type { ExtractionResponse } from '@/lib/types/inference';

export default function InferencePage() {
  const [result, setResult] = useState<ExtractionResponse | null>(null);
  const extractMutation = useExtract();

  // Override the onSuccess to capture the result locally
  const handleExtract = async (data: { text: string; modelVersion?: string; documentType?: string }) => {
    const response = await extractMutation.mutateAsync(data);
    setResult(response);
    return response;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Extraction"
        description="Extract structured data from financial documents using fine-tuned models."
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Left Panel - Input */}
        <div className="col-span-7 space-y-6">
          <div className="bg-[--surface] border border-[--border] rounded-lg p-6">
            <ExtractionForm />
          </div>

          {/* History Panel */}
          <div className="bg-[--surface] border border-[--border] rounded-lg p-4">
            <InferenceHistoryPanel />
          </div>
        </div>

        {/* Right Panel - Results */}
        <div className="col-span-5">
          <div className="bg-[--surface] border border-[--border] rounded-lg h-[calc(100vh-200px)] sticky top-6">
            <ExtractionResultPanel result={result} />
          </div>
        </div>
      </div>
    </div>
  );
}
