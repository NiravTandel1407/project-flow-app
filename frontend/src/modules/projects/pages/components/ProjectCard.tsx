import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';
import { ProgressBar } from '@/shared/components/ui/ProgressBar';
import { Badge } from '@/shared/components/ui/Badge';
import { Calendar, CheckCircle2, ChevronRight, Flag, Edit3 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
  onEdit?: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const navigate = useNavigate();

  const statusVariantMap: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
    not_started: 'default',
    in_progress: 'info',
    on_hold: 'warning',
    completed: 'success',
    TODO: 'default',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    BLOCKED: 'danger',
  };

  const statusLabelMap: Record<string, string> = {
    not_started: 'Not started',
    in_progress: 'In progress',
    on_hold: 'On hold',
    completed: 'Completed',
    TODO: 'Not started',
    IN_PROGRESS: 'In progress',
    COMPLETED: 'Completed',
    BLOCKED: 'On hold',
  };

  const priorityColorMap: Record<string, string> = {
    high: 'text-rose-600 bg-rose-50 border-rose-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-slate-600 bg-slate-50 border-slate-200',
    HIGH: 'text-rose-600 bg-rose-50 border-rose-200',
    MEDIUM: 'text-amber-600 bg-amber-50 border-amber-200',
    LOW: 'text-slate-600 bg-slate-50 border-slate-200',
    URGENT: 'text-red-700 bg-red-100 border-red-300',
  };

  const progress = project.progress ?? 0;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group flex flex-col justify-between rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm hover:border-[#9DB0FF] hover:shadow-md transition-all cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant={statusVariantMap[project.status] || 'default'}>
              {statusLabelMap[project.status] || project.status.replace('_', ' ')}
            </Badge>

            {project.priority && (
              <span
                className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                  priorityColorMap[project.priority] || 'text-slate-600 bg-slate-50 border-slate-200'
                }`}
              >
                <Flag className="w-2.5 h-2.5" />
                <span className="capitalize">{project.priority.toLowerCase()}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-[#98A2B3]">
            {onEdit && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(project);
                }}
                className="p-1 rounded-lg hover:bg-slate-100 hover:text-[#3B5BFF] transition-colors"
                title="Edit project"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            )}
            <div className="group-hover:text-[#3B5BFF] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#101828] group-hover:text-[#3B5BFF] transition-colors line-clamp-1">
          {project.name}
        </h3>

        {project.description && (
          <p className="mt-1.5 text-xs text-[#475467] line-clamp-2 leading-relaxed">
            {project.description}
          </p>
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-[#F2F4F7] space-y-3">
        <ProgressBar progress={progress} showLabel size="sm" color="brand" />

        <div className="flex items-center justify-between text-xs text-[#667085]">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2EE6A6]" />
            <span>
              {project.completed_tasks ?? 0}/{project.total_tasks ?? 0} tasks
            </span>
          </div>

          {project.due_date && (
            <div className="flex items-center gap-1.5 text-[#667085]" title="Due date">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(project.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
