export type Status = 'TODO' | 'IN_PROGRESS' | 'COMPLETED' | 'BLOCKED';

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
}

