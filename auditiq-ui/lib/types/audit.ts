export type AuditAction = 
  | 'INFERENCE'
  | 'TRAINING_TRIGGER'
  | 'MODEL_PROMOTE'
  | 'DATASET_CREATE'
  | 'LOGIN'
  | 'LOGOUT'
  | 'USER_CREATE'
  | 'ROLE_CHANGE'
  | 'SETTINGS_UPDATE';

export type AuditResource = 
  | 'inference'
  | 'training'
  | 'model'
  | 'dataset'
  | 'user'
  | 'system';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  userId: string;
  userEmail: string;
  userRole: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  details: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  success: boolean;
  errorMessage?: string;
}

export interface AuditLogFilters {
  startDate?: string;
  endDate?: string;
  actions?: AuditAction[];
  users?: string[];
  resources?: AuditResource[];
  success?: boolean;
}

export interface AuditLogResponse {
  entries: AuditLogEntry[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
