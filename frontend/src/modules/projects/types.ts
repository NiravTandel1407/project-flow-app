import { Status } from '@/core/types/common';
import { Task } from '@/modules/tasks/types';

export type ProjectStatus = 'not_started' | 'in_progress' | 'on_hold' | 'completed' | Status;
export type ProjectPriority = 'low' | 'medium' | 'high' | 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string | null;
  due_date?: string | null;
  progress?: number; // 0 - 100
  total_tasks?: number;
  completed_tasks?: number;
  tasks?: Task[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCreate {
  name: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string | null;
  due_date?: string | null;
}

export interface ProjectUpdate {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  start_date?: string | null;
  due_date?: string | null;
}
