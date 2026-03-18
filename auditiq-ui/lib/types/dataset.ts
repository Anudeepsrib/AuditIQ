export type DatasetSource = 'edgar' | 'synthetic' | 'upload';

export interface DatasetVersion {
  id: string;
  version: string;
  sources: DatasetSource[];
  documentCount: number;
  trainCount: number;
  valCount: number;
  testCount: number;
  createdAt: string;
  createdBy: string;
  status: 'processing' | 'ready' | 'error';
  stratificationInfo: StratificationInfo;
  documentTypeDistribution: Record<string, number>;
  schema: DatasetSchema;
}

export interface StratificationInfo {
  byDocumentType: boolean;
  byCompanySize: boolean;
  byTimePeriod: boolean;
  trainRatio: number;
  valRatio: number;
  testRatio: number;
}

export interface DatasetSchema {
  fields: SchemaField[];
  required: string[];
  documentTypes: string[];
}

export interface SchemaField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  validation?: FieldValidation;
}

export interface FieldValidation {
  pattern?: string;
  min?: number;
  max?: number;
  enum?: string[];
}

export interface CreateDatasetRequest {
  sources: DatasetSource[];
  filters?: DatasetFilters;
  stratification?: Partial<StratificationInfo>;
}

export interface DatasetFilters {
  documentTypes?: string[];
  dateRange?: {
    start: string;
    end: string;
  };
  companies?: string[];
  ciks?: string[];
}
