import React, { useState } from 'react';
import { useProjects } from '../hooks';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { ProjectCard } from './components/ProjectCard';
import { StatusFilterBar } from './components/StatusFilterBar';
import { ProjectFormModal } from './components/ProjectFormModal';
import { Button } from '@/shared/components/ui/Button';
import { Plus, Search, FolderKanban } from 'lucide-react';
import { Status } from '@/core/types/common';
import { useDebounce } from '@/core/hooks/useDebounce';

export const ProjectsPage: React.FC = () => {
  const [status, setStatus] = useState<Status | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const debouncedSearch = useDebounce(search, 300);

  const { data: projects = [], isLoading } = useProjects({
    status: status === 'ALL' ? undefined : status,
    search: debouncedSearch || undefined,
  });

  return (
    <PageContainer
      title="Projects"
      subtitle="Organize, track progress, and manage your team's initiatives."
      actions={
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <StatusFilterBar currentStatus={status} onChange={setStatus} />

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects..."
              className="w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 py-1.5 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-3">
              <FolderKanban className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No projects yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              Get started by creating your first project to organize tasks and timelines.
            </p>
            <Button className="mt-4" onClick={() => setIsModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      <ProjectFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </PageContainer>
  );
};

export default ProjectsPage;

