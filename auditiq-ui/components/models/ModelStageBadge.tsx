import type { ModelStage } from '@/lib/types/model';

interface ModelStageBadgeProps {
  stage: ModelStage;
}

export function ModelStageBadge({ stage }: ModelStageBadgeProps) {
  const styles = {
    production: 'bg-[--stage-production]/10 text-[--stage-production] border-[--stage-production]/30',
    staging: 'bg-[--stage-staging]/10 text-[--stage-staging] border-[--stage-staging]/30',
    archived: 'bg-[--stage-archived]/10 text-[--stage-archived] border-[--stage-archived]/30',
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[stage]}`}
    >
      {stage}
    </span>
  );
}
