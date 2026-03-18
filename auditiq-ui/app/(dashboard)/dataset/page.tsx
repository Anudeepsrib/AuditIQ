import { PageHeader } from '@/components/layout/PageHeader';

export default function DatasetPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dataset Management"
        description="Manage training datasets and versions."
      />
      <div className="bg-[--surface] border border-[--border] rounded-lg p-8 text-center">
        <p className="text-[--text-secondary]">Dataset management coming soon...</p>
      </div>
    </div>
  );
}
