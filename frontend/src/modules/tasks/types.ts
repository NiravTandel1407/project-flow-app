import { Status, Priority } from '@/core/types/common';
import { Subtask } from '@/modules/subtasks/types';

export type TaskStatus = 'todo' | 'in_progress' | 'done' | Status;
export type TaskPriority = 'low' | 'medium' | 'high' | Priority;

export interface Task {
  id: number;
  project_id: number;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  completed_at?: string | null;
  is_overdue?: boolean;
  subtasks_total?: number;
  subtasks_done?: number;
  subtasks?: Subtask[];
  created_at?: string;
  updated_at?: string;
}

export interface TaskDetail extends Task {
  subtasks: Subtask[];
}

export interface TaskCreate {
  project_id?: number;
  title: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface ProjectProgress {
  total_tasks: number;
  done_tasks: number;
  overdue_tasks: number;
  due_this_week: number;
  progress_percent: number;
}
