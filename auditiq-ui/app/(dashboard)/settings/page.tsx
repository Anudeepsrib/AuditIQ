import { PageHeader } from '@/components/layout/PageHeader';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage application settings and preferences."
      />
      <div className="bg-[--surface] border border-[--border] rounded-lg p-8 text-center">
        <p className="text-[--text-secondary]">Settings panel coming soon...</p>
      </div>
    </div>
  );
}
