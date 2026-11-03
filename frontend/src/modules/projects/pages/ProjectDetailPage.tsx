import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProject, useDeleteProject } from '../hooks';
import { useProjectProgress } from '@/modules/tasks/hooks';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { TaskList } from './components/TaskList';
import { ProjectFormModal } from './components/ProjectFormModal';
import { TaskFormModal } from '@/modules/tasks/components/TaskFormModal';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);

  const { data: project, isLoading } = useProject(projectId);
  const { data: progress } = useProjectProgress(projectId);
  const deleteMutation = useDeleteProject();

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this project and all its tasks?')) {
      await deleteMutation.mutateAsync(projectId);
      navigate('/projects');
    }
  };

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B5BFF] border-t-transparent" />
        </div>
      </PageContainer>
    );
  }

  if (!project) {
    return (
      <PageContainer>
        <div className="text-center py-20">
          <h2 className="text-lg font-bold text-slate-800">Project Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">
            The project you are looking for does not exist or has been removed.
          </p>
          <button
            onClick={() => navigate('/projects')}
            className="mt-4 inline-flex items-center gap-2 text-sm text-[#3B5BFF] font-medium hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </div>
      </PageContainer>
    );
  }

  // Format Due Date
  const formatDueDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formattedDueDate = formatDueDate(project.due_date);

  // Status mapping
  const statusStr = (project.status || 'not_started').toLowerCase();
  const statusLabel =
    statusStr === 'completed'
      ? 'Completed'
      : statusStr === 'in_progress'
      ? 'In progress'
      : statusStr === 'on_hold'
      ? 'On hold'
      : 'Not started';

  const statusStyles: Record<string, string> = {
    Completed: 'bg-[#E7F6EC] text-[#1B6B3A]',
    'In progress': 'bg-[#E8EBFF] text-[#2B38C8]',
    'On hold': 'bg-[#FFF4DB] text-[#8A5A00]',
    'Not started': 'bg-[#EEF0F5] text-[#3C4157]',
  };

  // Priority mapping
  const priorityStr = (project.priority || 'medium').toLowerCase();
  const priorityLabel =
    priorityStr === 'high'
      ? 'High priority'
      : priorityStr === 'low'
      ? 'Low priority'
      : 'Medium priority';

  const priorityStyles: Record<string, string> = {
    'High priority': 'bg-[#FDECEA] text-[#B42318]',
    'Medium priority': 'bg-[#FFF4DB] text-[#8A5A00]',
    'Low priority': 'bg-[#E7F6EC] text-[#1B6B3A]',
  };

  // Stats fallback
  const totalTasks = progress?.total_tasks ?? project.total_tasks ?? 0;
  const doneTasks = progress?.done_tasks ?? project.completed_tasks ?? 0;
  const overdueTasks = progress?.overdue_tasks ?? 0;
  const dueThisWeek = progress?.due_this_week ?? 0;
  const progressPercent = progress?.progress_percent ?? (totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0);

  return (
    <PageContainer>
      <div className="flex flex-col gap-5 max-w-6xl mx-auto py-1">
        {/* Header Section matching Tasks.dc.html */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-[14px] text-[#5B6275]">
              <Link
                to="/projects"
                className="text-[#3B5BFF] hover:text-[#2A48E6] font-medium no-underline hover:underline"
              >
                Projects
              </Link>{' '}
              / <span className="text-[#5B6275]">{project.name}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="m-0 text-2xl sm:text-[28px] font-bold text-[#14162B] tracking-tight">
                {project.name}
              </h1>
              <span
                className={`px-2.5 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${
                  statusStyles[statusLabel] || 'bg-[#EEF0F5] text-[#3C4157]'
                }`}
              >
                {statusLabel}
              </span>
              <span
                className={`px-2.5 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${
                  priorityStyles[priorityLabel] || 'bg-[#FFF4DB] text-[#8A5A00]'
                }`}
              >
                {priorityLabel}
              </span>
            </div>

            <p className="m-0 text-[15px] text-[#5B6275] max-w-3xl">
              {project.description || 'No description provided.'}
              {formattedDueDate ? ` Due ${formattedDueDate}.` : ''}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="h-[42px] px-5 border border-[#CDD1E0] rounded-[10px] bg-white font-semibold text-[14px] text-[#3C4157] hover:bg-[#F5F6FA] transition-colors cursor-pointer"
            >
              Edit project
            </button>
            <button
              type="button"
              onClick={() => setIsCreateTaskModalOpen(true)}
              className="h-[42px] px-5 border-0 rounded-[10px] bg-[#3B5BFF] hover:bg-[#2A48E6] font-semibold text-[14px] text-white transition-colors cursor-pointer shadow-sm flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Add task
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="h-[42px] px-3.5 border border-rose-200 rounded-[10px] bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Project Progress Summary Card matching Tasks.dc.html */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-10 p-[18px_24px] bg-white border border-[#E4E6EF] rounded-[12px] shadow-sm">
          {/* Progress Bar & Percentage */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-center mb-2.5 text-[14px]">
              <span className="font-semibold text-[#14162B]">
                Project progress{' '}
                <span className="font-normal text-[#5B6275]">
                  · {doneTasks} of {totalTasks} tasks done
                </span>
              </span>
              <span className="font-bold text-[#14162B]">{progressPercent}%</span>
            </div>
            <div className="h-[10px] rounded-[5px] bg-[#E4E6EF] overflow-hidden">
              <div
                className="h-full rounded-[5px] bg-[#3B5BFF] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Overdue stat */}
          <div className="text-[13px] text-[#5B6275] shrink-0 border-l sm:border-l border-slate-100 pl-0 sm:pl-8">
            <div className="text-[22px] font-bold text-[#B42318] leading-tight">
              {overdueTasks}
            </div>
            Overdue
          </div>

          {/* Due this week stat */}
          <div className="text-[13px] text-[#5B6275] shrink-0 border-l sm:border-l border-slate-100 pl-0 sm:pl-8">
            <div className="text-[22px] font-bold text-[#14162B] leading-tight">
              {dueThisWeek}
            </div>
            Due this week
          </div>
        </div>

        {/* Tasks Section with Filter Pills and Task List */}
        <div className="mt-2">
          <TaskList
            projectId={projectId}
            projectName={project.name}
            isCreateModalOpen={isCreateTaskModalOpen}
            onCloseCreateModal={() => setIsCreateTaskModalOpen(false)}
          />
        </div>
      </div>

      {/* Edit Project Modal */}
      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectToEdit={project}
      />

      {/* Create Task Modal */}
      <TaskFormModal
        isOpen={isCreateTaskModalOpen}
        onClose={() => setIsCreateTaskModalOpen(false)}
        projectId={projectId}
        projectName={project.name}
      />
    </PageContainer>
  );
};

export default ProjectDetailPage;
