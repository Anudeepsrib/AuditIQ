import type { Role } from '@/lib/types/auth';

export const permissions = {
  canRunInference: (role: Role) => ['admin', 'analyst'].includes(role),
  canViewModels: (role: Role) => ['admin', 'ml_engineer', 'analyst', 'auditor'].includes(role),
  canPromoteModel: (role: Role) => role === 'admin',
  canTriggerTraining: (role: Role) => ['admin', 'ml_engineer'].includes(role),
  canManageDataset: (role: Role) => ['admin', 'ml_engineer'].includes(role),
  canViewEvaluations: (role: Role) => ['admin', 'ml_engineer', 'analyst', 'auditor'].includes(role),
  canViewAuditLog: (role: Role) => ['admin', 'auditor'].includes(role),
  canManageUsers: (role: Role) => role === 'admin',
  canViewArtifacts: (role: Role) => ['admin', 'ml_engineer'].includes(role),
  canExportAuditCSV: (role: Role) => role === 'admin',
};

export function checkPermission(role: Role | undefined, permissionCheck: (r: Role) => boolean): boolean {
  if (!role) return false;
  return permissionCheck(role);
}

export function getDefaultRedirect(role: Role): string {
  switch (role) {
    case 'analyst':
    case 'admin':
      return '/inference';
    case 'ml_engineer':
      return '/training';
    case 'auditor':
      return '/evaluations';
    default:
      return '/inference';
  }
}

export function canAccessRoute(role: Role, route: string): boolean {
  const routePermissions: Record<string, (r: Role) => boolean> = {
    '/inference': permissions.canRunInference,
    '/models': permissions.canViewModels,
    '/training': permissions.canTriggerTraining,
    '/dataset': permissions.canManageDataset,
    '/evaluations': permissions.canViewEvaluations,
    '/audit': permissions.canViewAuditLog,
    '/settings/users': permissions.canManageUsers,
  };

  const check = routePermissions[route];
  if (!check) return true; // Routes without explicit restrictions
  return check(role);
}
