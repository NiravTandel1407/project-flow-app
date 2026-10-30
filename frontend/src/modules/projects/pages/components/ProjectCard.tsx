import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Project } from '../../types';
import { ProgressBar } from '@/shared/components/ui/ProgressBar';
import { Badge } from '@/shared/components/ui/Badge';
import { Calendar, CheckCircle2, ChevronRight } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  const statusVariantMap: Record<string, 'default' | 'info' | 'success' | 'warning' | 'danger'> = {
    TODO: 'default',
    IN_PROGRESS: 'info',
    COMPLETED: 'success',
    BLOCKED: 'danger',
  };

  const progress = project.progress ?? 0;

  return (
    <div
      onClick={() => navigate(`/projects/${project.id}`)}
      className="group flex flex-col justify-between rounded-2xl border border-[#E4E7EC] bg-white p-6 shadow-sm hover:border-[#9DB0FF] hover:shadow-md transition-all cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <Badge variant={statusVariantMap[project.status] || 'default'}>
            {project.status.replace('_', ' ')}
          </Badge>
          <div className="text-[#98A2B3] group-hover:text-[#3B5BFF] transition-colors">
            <ChevronRight className="w-4 h-4" />
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
            <div className="flex items-center gap-1.5 text-[#667085]">
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(project.due_date).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
