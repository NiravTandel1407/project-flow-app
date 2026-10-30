import { Status } from '@/core/types/common';
import { Task } from '@/modules/tasks/types';

export interface Project {
  id: number;
  name: string;
  description?: string | null;
  status: Status;
  progress?: number; // 0 - 100
  due_date?: string | null;
  total_tasks?: number;
  completed_tasks?: number;
  tasks?: Task[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectCreate {
  name: string;
  description?: string;
  status?: Status;
  due_date?: string;
}

export interface ProjectUpdate {
  name?: string;
  description?: string;
  status?: Status;
  due_date?: string;
}

