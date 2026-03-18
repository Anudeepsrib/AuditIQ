interface TokenCountDisplayProps {
  count: number;
  max: number;
}

export function TokenCountDisplay({ count, max }: TokenCountDisplayProps) {
  const percentage = (count / max) * 100;
  const isOverLimit = count > max;
  const isNearLimit = percentage > 90 && !isOverLimit;

  return (
    <span
      className={`text-xs font-mono ${
        isOverLimit
          ? 'text-[--error]'
          : isNearLimit
          ? 'text-[--warning]'
          : 'text-[--text-tertiary]'
      }`}
    >
      {count.toLocaleString()} / {max.toLocaleString()} tokens
    </span>
  );
}
