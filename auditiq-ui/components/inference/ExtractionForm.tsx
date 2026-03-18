'use client';

import { useState } from 'react';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useExtract } from '@/lib/hooks/useInference';
import { TokenCountDisplay } from './TokenCountDisplay';
import { ModelVersionSelector } from './ModelVersionSelector';

const extractionSchema = z.object({
  text: z.string().min(1, 'Document text is required').max(8000, 'Text exceeds maximum token limit'),
  modelVersion: z.string().optional(),
  documentType: z.string().optional(),
});

type ExtractionFormData = z.infer<typeof extractionSchema>;

const MAX_TOKENS = 8000;
const WARNING_THRESHOLD = 7500;

export function ExtractionForm() {
  const [tokenCount, setTokenCount] = useState(0);
  const extractMutation = useExtract();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<ExtractionFormData>({
    resolver: zodResolver(extractionSchema),
    defaultValues: {
      modelVersion: undefined,
      documentType: 'auto-detect',
    },
  });

  const text = watch('text') || '';

  // Simple token estimation (rough approximation)
  const estimateTokens = (text: string) => {
    return Math.ceil(text.length / 4);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setValue('text', newText);
    setTokenCount(estimateTokens(newText));
  };

  const onSubmit = async (data: ExtractionFormData) => {
    await extractMutation.mutateAsync({
      text: data.text,
      modelVersion: data.modelVersion,
      documentType: data.documentType === 'auto-detect' ? undefined : data.documentType,
    });
  };

  const isOverLimit = tokenCount > MAX_TOKENS;
  const isNearLimit = tokenCount > WARNING_THRESHOLD && tokenCount <= MAX_TOKENS;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="document-text">Document Text</Label>
          <TokenCountDisplay count={tokenCount} max={MAX_TOKENS} />
        </div>
        <Textarea
          id="document-text"
          placeholder="Paste financial document text here..."
          rows={12}
          {...register('text')}
          onChange={handleTextChange}
          className={`font-body resize-none ${
            isOverLimit
              ? 'border-[--error] focus-visible:ring-[--error]'
              : isNearLimit
              ? 'border-[--warning] focus-visible:ring-[--warning]'
              : ''
          }`}
        />
        {errors.text && (
          <p className="text-sm text-[--error]">{errors.text.message}</p>
        )}
        {isOverLimit && (
          <p className="text-sm text-[--error] flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Text exceeds maximum token limit of {MAX_TOKENS}
          </p>
        )}
        {isNearLimit && !isOverLimit && (
          <p className="text-sm text-[--warning] flex items-center gap-1">
            <AlertTriangle className="h-4 w-4" />
            Approaching token limit
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="model-version">Model Version</Label>
          <ModelVersionSelector
            value={watch('modelVersion')}
            onChange={(value) => setValue('modelVersion', value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="document-type">Document Type (Optional)</Label>
          <select
            id="document-type"
            {...register('documentType')}
            className="flex h-10 w-full rounded-md border border-[--border] bg-[--surface] px-3 py-2 text-sm text-[--text-primary] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--accent]"
          >
            <option value="auto-detect">Auto-detect</option>
            <option value="10-K">10-K (Annual Report)</option>
            <option value="10-Q">10-Q (Quarterly Report)</option>
            <option value="8-K">8-K (Current Report)</option>
            <option value="loan_memo">Loan Memo</option>
            <option value="audit_report">Audit Report</option>
          </select>
        </div>
      </div>

      <Button
        type="submit"
        disabled={extractMutation.isPending || isOverLimit || !text.trim()}
        className="w-full"
      >
        {extractMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Extracting...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Extract Information
          </>
        )}
      </Button>
    </form>
  );
}
