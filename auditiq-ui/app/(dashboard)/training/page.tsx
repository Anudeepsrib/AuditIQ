import { PageHeader } from '@/components/layout/PageHeader';

export default function TrainingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Pipeline"
        description="Manage and monitor model training runs."
      />
      <div className="bg-[--surface] border border-[--border] rounded-lg p-8 text-center">
        <p className="text-[--text-secondary]">Training dashboard coming soon...</p>
      </div>
    </div>
  );
}
