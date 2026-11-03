import React, { useState } from 'react';
import { useTasks } from '../hooks';
import { useProjects } from '@/modules/projects/hooks';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { TaskItem } from '../components/TaskItem';
import { TaskFormModal } from '../components/TaskFormModal';
import { Button } from '@/shared/components/ui/Button';
import { Plus, ListFilter, CheckSquare } from 'lucide-react';
import { Task, TaskStatus } from '../types';

export const TasksPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'ALL'>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { data: projects = [] } = useProjects();

  const currentProjectId =
    selectedProjectId !== 'ALL'
      ? selectedProjectId
      : projects.length > 0
      ? projects[0].id
      : 0;

  const currentProjectName =
    selectedProjectId !== 'ALL'
      ? projects.find((p) => p.id === selectedProjectId)?.name || 'Project'
      : projects.length > 0
      ? projects[0].name
      : 'Project';

  const { data: tasks = [], isLoading } = useTasks({
    project_id: currentProjectId || undefined,
    status: filterStatus === 'ALL' ? undefined : filterStatus,
  });

  const handleCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <PageContainer
      title="Tasks"
      subtitle="View and manage all your tasks across your active projects."
      actions={
        <Button onClick={handleCreate} disabled={projects.length === 0}>
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-[#E4E6EF] shadow-sm">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-[#5B6275]" />
            <span className="text-xs font-semibold uppercase text-[#5B6275]">Filters:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#14162B] font-medium">Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) =>
                setSelectedProjectId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
              }
              className="rounded-lg border border-[#CDD1E0] bg-white px-3 py-1.5 text-xs text-[#14162B] focus:outline-none focus:border-[#3B5BFF]"
            >
              {projects.length > 1 && <option value="ALL">All Projects (Default First)</option>}
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-[#14162B] font-medium">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'ALL')}
              className="rounded-lg border border-[#CDD1E0] bg-white px-3 py-1.5 text-xs text-[#14162B] focus:outline-none focus:border-[#3B5BFF]"
            >
              <option value="ALL">All Statuses</option>
              <option value="todo">To do</option>
              <option value="in_progress">In progress</option>
              <option value="done">Done</option>
            </select>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B5BFF] border-t-transparent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#E4E6EF] bg-white p-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-[#5B6275] mb-3">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-[#14162B]">No tasks found</h3>
            <p className="text-xs text-[#5B6275] mt-1 max-w-sm">
              {projects.length === 0
                ? 'Create a project first before creating tasks.'
                : 'Get started by creating a new task for this project.'}
            </p>
            {projects.length > 0 && (
              <Button className="mt-4" onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        projectId={currentProjectId}
        projectName={currentProjectName}
        taskToEdit={taskToEdit}
      />
    </PageContainer>
  );
};

export default TasksPage;
