export interface ProjectDocument {
  id: number;
  project_id: number;
  user_id: number;
  filename: string;
  file_size: number;
  content_type?: string | null;
  created_at: string;
}

