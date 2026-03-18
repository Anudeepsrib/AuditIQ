'use client';

import { Bell, HelpCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { cn } from '@/lib/utils/cn';

interface TopbarProps {
  title?: string;
}

export function Topbar({ title }: TopbarProps) {
  const user = useAuthStore((state) => state.user);

  return (
    <header className="h-16 bg-[--surface] border-b border-[--border] flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        {title && (
          <h1 className="text-lg font-heading font-medium text-[--text-primary]">
            {title}
          </h1>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--surface-raised] rounded-md transition-colors">
          <HelpCircle className="h-5 w-5" />
        </button>
        <button className="p-2 text-[--text-secondary] hover:text-[--text-primary] hover:bg-[--surface-raised] rounded-md transition-colors relative">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 bg-[--accent] rounded-full" />
        </button>
        <div className="flex items-center gap-2 pl-4 border-l border-[--border]">
          <div className="h-8 w-8 rounded-full bg-[--accent-muted] flex items-center justify-center">
            <span className="text-sm font-mono text-[--accent]">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="hidden md:block">
            <p className="text-sm font-medium text-[--text-primary]">
              {user?.name}
            </p>
            <p className="text-xs text-[--text-secondary] capitalize">
              {user?.role?.replace('_', ' ')}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
