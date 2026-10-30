import { Status, Priority } from '@/core/types/common';
import { Subtask } from '@/modules/subtasks/types';

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string | null;
  status: Status;
  priority: Priority;
  due_date?: string | null;
  subtasks?: Subtask[];
  subtask_count?: number;
  completed_subtask_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface TaskCreate {
  project_id: number;
  title: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  due_date?: string;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: Status;
  priority?: Priority;
  due_date?: string;
}

