import { PageHeader } from '@/components/layout/PageHeader';

export default function AuditPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Audit Log"
        description="Review system activity and user actions."
      />
      <div className="bg-[--surface] border border-[--border] rounded-lg p-8 text-center">
        <p className="text-[--text-secondary]">Audit log coming soon...</p>
      </div>
    </div>
  );
}
