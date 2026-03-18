'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/layout/PageHeader';
import { Button } from '@/components/ui/button';
import { ModelRegistryTable } from '@/components/models/ModelRegistryTable';
import { useModels, usePromoteModel } from '@/lib/hooks/useModels';
import { useAuthStore } from '@/lib/stores/authStore';
import { permissions } from '@/lib/utils/permissions';
import type { ModelVersion } from '@/lib/types/model';
import { Loader2 } from 'lucide-react';

export default function ModelsPage() {
  const { data: models, isLoading } = useModels();
  const promoteMutation = usePromoteModel();
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role ? permissions.canPromoteModel(user.role) : false;

  const handlePromote = async (model: ModelVersion) => {
    if (confirm(`Promote ${model.version} to production?`)) {
      await promoteMutation.mutateAsync({
        version: model.version,
        confirmed: true,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[--accent]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Model Registry"
        description="Browse and manage fine-tuned model versions."
      >
        {isAdmin && (
          <Button variant="outline">Promote to Production</Button>
        )}
      </PageHeader>

      <div className="bg-[--surface] border border-[--border] rounded-lg">
        {models && (
          <ModelRegistryTable
            models={models}
            isAdmin={isAdmin}
            onPromote={handlePromote}
          />
        )}
      </div>
    </div>
  );
}
