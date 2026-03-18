'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface JsonViewerProps {
  data: unknown;
}

export function JsonViewer({ data }: JsonViewerProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-[--surface-raised] hover:bg-[--border-strong] rounded-md transition-colors"
        title="Copy to clipboard"
      >
        {copied ? (
          <Check className="h-4 w-4 text-[--success]" />
        ) : (
          <Copy className="h-4 w-4 text-[--text-secondary]" />
        )}
      </button>
      <pre className="bg-[--surface-raised] rounded-lg p-4 overflow-auto max-h-[600px] text-sm font-mono text-[--text-primary]">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}
