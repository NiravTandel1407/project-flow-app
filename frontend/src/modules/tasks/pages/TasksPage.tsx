import React, { useState } from 'react';
import { useTasks } from '../hooks';
import { useProjects } from '@/modules/projects/hooks';
import { PageContainer } from '@/shared/components/layout/PageContainer';
import { TaskItem } from '../components/TaskItem';
import { TaskFormModal } from '../components/TaskFormModal';
import { Button } from '@/shared/components/ui/Button';
import { Plus, ListFilter, CheckSquare } from 'lucide-react';
import { Status } from '@/core/types/common';
import { Task } from '../types';

export const TasksPage: React.FC = () => {
  const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL');
  const [selectedProjectId, setSelectedProjectId] = useState<number | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { data: projects = [] } = useProjects();
  const { data: tasks = [], isLoading } = useTasks({
    project_id: selectedProjectId === 'ALL' ? undefined : selectedProjectId,
    status: filterStatus === 'ALL' ? undefined : filterStatus,
  });

  const defaultProjectId = selectedProjectId !== 'ALL' ? selectedProjectId : projects[0]?.id || 1;

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
        <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-xl border border-slate-200">
          <div className="flex items-center gap-2">
            <ListFilter className="w-4 h-4 text-slate-400" />
            <span className="text-xs font-semibold uppercase text-slate-500">Filters:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 font-medium">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as Status | 'ALL')}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="TODO">To Do</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-600 font-medium">Project:</label>
            <select
              value={selectedProjectId}
              onChange={(e) =>
                setSelectedProjectId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
              }
              className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="ALL">All Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task List */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-16 text-center">
            <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
              <CheckSquare className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-800">No tasks found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {projects.length === 0
                ? 'Create a project first before creating tasks.'
                : 'Add a new task to get things done.'}
            </p>
            {projects.length > 0 && (
              <Button className="mt-4" onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskItem key={task.id} task={task} onEdit={handleEdit} />
            ))}
          </div>
        )}
      </div>

      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={defaultProjectId}
        taskToEdit={taskToEdit}
      />
    </PageContainer>
  );
};

export default TasksPage;

