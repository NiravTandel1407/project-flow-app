export interface Subtask {
  id: number;
  task_id: number;
  title: string;
  is_done: boolean;
  is_completed?: boolean; // backwards-compat alias
  created_at?: string;
  updated_at?: string;
}

export interface SubtaskCreate {
  task_id?: number;
  title: string;
}

export interface SubtaskUpdate {
  title?: string;
  is_done?: boolean;
  is_completed?: boolean;
}
