import React from 'react';
import { Project } from '../../types';
import { ProgressBar } from '@/shared/components/ui/ProgressBar';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Calendar, Edit3, Trash2 } from 'lucide-react';

interface ProjectHeaderProps {
  project: Project;
  onEdit: () => void;
  onDelete: () => void;
}

export const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  project,
  onEdit,
  onDelete,
}) => {
  const statusVariantMap: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
    TODO: 'default',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    BLOCKED: 'danger',
  };

  const progress = project.progress ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm mb-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 flex-wrap mb-2">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
              {project.name}
            </h1>
            <Badge variant={statusVariantMap[project.status] || 'default'}>
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          {project.description && (
            <p className="text-sm text-slate-500 max-w-2xl">{project.description}</p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onEdit}>
            <Edit3 className="w-3.5 h-3.5 mr-1.5" />
            Edit
          </Button>
          <Button variant="danger" size="sm" onClick={onDelete}>
            <Trash2 className="w-3.5 h-3.5 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100 items-center">
        <div>
          <ProgressBar progress={progress} showLabel size="md" />
        </div>

        <div className="flex items-center justify-end gap-6 text-xs text-slate-500">
          {project.due_date && (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Target: {new Date(project.due_date).toLocaleDateString()}</span>
            </div>
          )}
          <div>
            <span>
              {project.completed_tasks ?? 0} of {project.total_tasks ?? 0} tasks done
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

