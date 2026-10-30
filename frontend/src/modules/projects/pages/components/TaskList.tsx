import React, { useState } from 'react';
import { Task } from '@/modules/tasks/types';
import { useTasks } from '@/modules/tasks/hooks';
import { TaskItem } from '@/modules/tasks/components/TaskItem';
import { TaskFormModal } from '@/modules/tasks/components/TaskFormModal';
import { Button } from '@/shared/components/ui/Button';
import { Plus, ListFilter, CheckSquare2 } from 'lucide-react';
import { Status } from '@/core/types/common';

interface TaskListProps {
  projectId: number;
}

export const TaskList: React.FC<TaskListProps> = ({ projectId }) => {
  const [filterStatus, setFilterStatus] = useState<Status | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);

  const { data: tasks = [], isLoading } = useTasks({
    project_id: projectId,
    status: filterStatus === 'ALL' ? undefined : filterStatus,
  });

  const handleOpenCreate = () => {
    setTaskToEdit(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ListFilter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Filter:
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | 'ALL')}
            className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Tasks</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <Button size="sm" onClick={handleOpenCreate}>
          <Plus className="w-4 h-4 mr-1.5" />
          Add Task
        </Button>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 mb-3">
            <CheckSquare2 className="w-6 h-6" />
          </div>
          <p className="text-sm font-semibold text-slate-800">No tasks found</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Break down this project by creating your first actionable task.
          </p>
          <Button size="sm" className="mt-4" onClick={handleOpenCreate}>
            <Plus className="w-4 h-4 mr-1.5" />
            Create First Task
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
          ))}
        </div>
      )}

      {/* Task Modal */}
      <TaskFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectId={projectId}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

