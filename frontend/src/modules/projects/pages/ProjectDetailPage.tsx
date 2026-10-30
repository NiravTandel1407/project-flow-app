import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProject, useDeleteProject } from '../hooks';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { ProjectHeader } from './components/ProjectHeader';
import { TaskList } from './components/TaskList';
import { ProjectFormModal } from './components/ProjectFormModal';
import { ArrowLeft } from 'lucide-react';

export const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = Number(id);
  const navigate = useNavigate();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { data: project, isLoading } = useProject(projectId);
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
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
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
            className="mt-4 inline-flex items-center gap-2 text-sm text-indigo-600 font-medium hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <button
        onClick={() => navigate('/projects')}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to All Projects
      </button>

      <ProjectHeader
        project={project}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={handleDelete}
      />

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Project Tasks</h2>
        <TaskList projectId={projectId} />
      </div>

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectToEdit={project}
      />
    </PageContainer>
  );
};

export default ProjectDetailPage;

