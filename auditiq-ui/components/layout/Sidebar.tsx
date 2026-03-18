'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Bot,
  Dumbbell,
  Package,
  BarChart3,
  ClipboardList,
  Users,
  Settings,
  LogOut,
  ChevronRight,
} from 'lucide-react';

import { useAuthStore } from '@/lib/stores/authStore';
import { permissions } from '@/lib/utils/permissions';
import { cn } from '@/lib/utils/cn';
import type { Role } from '@/lib/types/auth';
import type { ModelVersion } from '@/lib/types/model';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  allowedRoles: Role[];
}

const navItems: NavItem[] = [
  { label: 'Inference', href: '/inference', icon: Search, allowedRoles: ['admin', 'analyst'] },
  { label: 'Models', href: '/models', icon: Bot, allowedRoles: ['admin', 'ml_engineer', 'analyst', 'auditor'] },
  { label: 'Training', href: '/training', icon: Dumbbell, allowedRoles: ['admin', 'ml_engineer'] },
  { label: 'Dataset', href: '/dataset', icon: Package, allowedRoles: ['admin', 'ml_engineer'] },
  { label: 'Evaluations', href: '/evaluations', icon: BarChart3, allowedRoles: ['admin', 'ml_engineer', 'analyst', 'auditor'] },
  { label: 'Audit Log', href: '/audit', icon: ClipboardList, allowedRoles: ['admin', 'auditor'] },
  { label: 'Users', href: '/settings/users', icon: Users, allowedRoles: ['admin'] },
  { label: 'Settings', href: '/settings', icon: Settings, allowedRoles: ['admin', 'ml_engineer', 'analyst', 'auditor'] },
];

interface SidebarProps {
  productionModel?: ModelVersion | null;
}

export function Sidebar({ productionModel }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const filteredNavItems = navItems.filter((item) =>
    user?.role && item.allowedRoles.includes(user.role)
  );

  return (
    <aside className="w-64 bg-[--surface] border-r border-[--border] flex flex-col h-screen fixed left-0 top-0">
      {/* Logo */}
      <div className="p-6 border-b border-[--border]">
        <Link href="/" className="flex items-center gap-2">
          <img 
            src="/logo.png"
            alt="AuditIQ" 
            className="h-6 object-contain"
          />
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[--accent-muted] text-[--accent]'
                  : 'text-[--text-secondary] hover:bg-[--surface-raised] hover:text-[--text-primary]'
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
            </Link>
          );
        })}
      </nav>

      {/* Production Model Indicator */}
      <div className="p-4 border-t border-[--border]">
        <div className="bg-[--surface-raised] rounded-md p-3">
          <p className="text-xs text-[--text-secondary] mb-2 font-mono uppercase tracking-wider">
            Production Model
          </p>
          {productionModel ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[--stage-production] production-glow" />
                <span className="font-mono text-sm text-[--text-primary]">
                  {productionModel.version}
                </span>
              </div>
              <p className="text-xs text-[--text-tertiary] truncate">
                {productionModel.baseModel}
              </p>
            </div>
          ) : (
            <p className="text-xs text-[--text-tertiary]">No production model</p>
          )}
        </div>
      </div>

      {/* User Section */}
      <div className="p-4 border-t border-[--border]">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-8 w-8 rounded-full bg-[--accent-muted] flex items-center justify-center">
            <span className="text-sm font-mono text-[--accent]">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[--text-primary] truncate">
              {user?.name || 'User'}
            </p>
            <p className="text-xs text-[--text-tertiary] truncate">
              {user?.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[--text-secondary] hover:text-[--error] hover:bg-[--error]/10 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
