import { PageHeader } from '@/components/layout/PageHeader';

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="User Management"
        description="Manage users and their roles."
      />
      <div className="bg-[--surface] border border-[--border] rounded-lg p-8 text-center">
        <p className="text-[--text-secondary]">User management coming soon...</p>
      </div>
    </div>
  );
}
