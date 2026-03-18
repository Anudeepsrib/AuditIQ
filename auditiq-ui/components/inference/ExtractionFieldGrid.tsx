import type { ExtractedDocument } from '@/lib/types/inference';
import { formatCurrency, formatPercentage } from '@/lib/utils/formatters';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ExtractionFieldGridProps {
  data: ExtractedDocument;
}

export function ExtractionFieldGrid({ data }: ExtractionFieldGridProps) {
  const { fields, goingConcernFlag, monetaryValues, riskFactors, confidence } = data;

  return (
    <div className="space-y-6">
      {/* Going Concern Alert */}
      <div
        className={`p-4 rounded-lg border ${
          goingConcernFlag
            ? 'bg-red-950/20 border-[--error]'
            : 'bg-green-950/20 border-[--success]'
        }`}
      >
        <div className="flex items-center gap-3">
          {goingConcernFlag ? (
            <AlertTriangle className="h-5 w-5 text-[--error]" />
          ) : (
            <CheckCircle2 className="h-5 w-5 text-[--success]" />
          )}
          <div>
            <p
              className={`font-medium ${
                goingConcernFlag ? 'text-[--error]' : 'text-[--success]'
              }`}
            >
              {goingConcernFlag
                ? '⚠ Going Concern Flag Detected'
                : '✓ No Going Concern Issues'}
            </p>
            <p className="text-sm text-[--text-secondary]">
              {goingConcernFlag
                ? 'This document contains going concern warnings that require attention.'
                : 'No going concern warnings detected in this document.'}
            </p>
          </div>
        </div>
      </div>

      {/* Document Type & Confidence */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[--surface-raised] rounded-lg p-3">
          <p className="text-xs text-[--text-secondary] uppercase tracking-wider">
            Document Type
          </p>
          <p className="text-sm font-medium text-[--text-primary] capitalize">
            {data.documentType.replace(/_/g, ' ')}
          </p>
        </div>
        <div className="bg-[--surface-raised] rounded-lg p-3">
          <p className="text-xs text-[--text-secondary] uppercase tracking-wider">
            Confidence
          </p>
          <p className="text-sm font-mono text-[--accent]">
            {formatPercentage(confidence)}
          </p>
        </div>
      </div>

      {/* Extracted Fields */}
      <div>
        <h3 className="text-sm font-medium text-[--text-secondary] mb-3">
          Extracted Fields
        </h3>
        <div className="space-y-2">
          {Object.entries(fields).map(([key, field]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-[--surface-raised] rounded-lg"
            >
              <div className="flex-1">
                <p className="text-xs text-[--text-secondary] uppercase">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-sm text-[--text-primary]">
                  {Array.isArray(field.value)
                    ? field.value.join(', ')
                    : String(field.value)}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`text-xs font-mono px-2 py-1 rounded ${
                    field.confidence >= 0.9
                      ? 'bg-[--success]/10 text-[--success]'
                      : field.confidence >= 0.7
                      ? 'bg-[--warning]/10 text-[--warning]'
                      : 'bg-[--error]/10 text-[--error]'
                  }`}
                >
                  {formatPercentage(field.confidence)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monetary Values */}
      {Object.keys(monetaryValues).length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[--text-secondary] mb-3">
            Monetary Values
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(monetaryValues).map(([key, value]) => (
              <div
                key={key}
                className="bg-[--surface-raised] rounded-lg p-3"
              >
                <p className="text-xs text-[--text-secondary] uppercase">
                  {key.replace(/_/g, ' ')}
                </p>
                <p className="text-sm font-mono text-[--accent]">
                  {formatCurrency(value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Risk Factors */}
      {riskFactors.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-[--text-secondary] mb-3">
            Risk Factors
          </h3>
          <div className="flex flex-wrap gap-2">
            {riskFactors.slice(0, 5).map((factor, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-[--warning]/10 text-[--warning] text-xs rounded"
              >
                {factor}
              </span>
            ))}
            {riskFactors.length > 5 && (
              <span className="px-2 py-1 bg-[--surface-raised] text-[--text-secondary] text-xs rounded">
                +{riskFactors.length - 5} more
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
