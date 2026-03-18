import { PageHeader } from '@/components/layout/PageHeader';

export default function EvaluationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Evaluations"
        description="View model evaluation results and metrics."
      />
      <div className="bg-[--surface] border border-[--border] rounded-lg p-8 text-center">
        <p className="text-[--text-secondary]">Evaluations dashboard coming soon...</p>
      </div>
    </div>
  );
}
