import React, { useState, useMemo } from 'react';
import { Task } from '@/modules/tasks/types';
import { useTasks } from '@/modules/tasks/hooks';
import { TaskItem } from '@/modules/tasks/components/TaskItem';
import { TaskFormModal } from '@/modules/tasks/components/TaskFormModal';
import { Plus, CheckSquare } from 'lucide-react';

interface TaskListProps {
  projectId: number;
  projectName?: string;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  projectId,
  projectName,
  isCreateModalOpen = false,
  onCloseCreateModal,
}) => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'todo' | 'in_progress' | 'done'>('ALL');
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isLocalCreateOpen, setIsLocalCreateOpen] = useState(false);

  // Fetch all tasks for this project
  const { data: allTasks = [], isLoading } = useTasks({
    project_id: projectId,
  });

  // Calculate counts for pills
  const counts = useMemo(() => {
    let todo = 0;
    let inProgress = 0;
    let done = 0;

    allTasks.forEach((t) => {
      const s = (t.status || '').toLowerCase();
      if (s === 'done' || s === 'completed') {
        done++;
      } else if (s === 'in_progress') {
        inProgress++;
      } else {
        todo++;
      }
    });

    return {
      all: allTasks.length,
      todo,
      inProgress,
      done,
    };
  }, [allTasks]);

  // Filter tasks based on selected pill
  const filteredTasks = useMemo(() => {
    if (activeFilter === 'ALL') return allTasks;
    return allTasks.filter((t) => {
      const s = (t.status || '').toLowerCase();
      if (activeFilter === 'done') return s === 'done' || s === 'completed';
      if (activeFilter === 'in_progress') return s === 'in_progress';
      return s === 'todo' || s === 'to do';
    });
  }, [allTasks, activeFilter]);

  const handleOpenEdit = (task: Task) => {
    setTaskToEdit(task);
  };

  const showModal = isCreateModalOpen || isLocalCreateOpen || !!taskToEdit;
  const handleCloseModal = () => {
    if (taskToEdit) setTaskToEdit(null);
    if (isLocalCreateOpen) setIsLocalCreateOpen(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Filter Pills matching Tasks.dc.html */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-[14px]">
        <button
          type="button"
          onClick={() => setActiveFilter('ALL')}
          className={`px-4 py-2 rounded-full font-semibold transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'ALL'
              ? 'bg-[#14162B] text-white shadow-sm'
              : 'bg-white border border-[#E4E6EF] text-[#3C4157] hover:bg-slate-50'
          }`}
        >
          All {counts.all}
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('todo')}
          className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'todo'
              ? 'bg-[#14162B] text-white font-semibold shadow-sm'
              : 'bg-white border border-[#E4E6EF] text-[#3C4157] hover:bg-slate-50'
          }`}
        >
          To do {counts.todo}
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('in_progress')}
          className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'in_progress'
              ? 'bg-[#14162B] text-white font-semibold shadow-sm'
              : 'bg-white border border-[#E4E6EF] text-[#3C4157] hover:bg-slate-50'
          }`}
        >
          In progress {counts.inProgress}
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('done')}
          className={`px-4 py-2 rounded-full font-medium transition-all cursor-pointer whitespace-nowrap ${
            activeFilter === 'done'
              ? 'bg-[#14162B] text-white font-semibold shadow-sm'
              : 'bg-white border border-[#E4E6EF] text-[#3C4157] hover:bg-slate-50'
          }`}
        >
          Done {counts.done}
        </button>
      </div>

      {/* Tasks List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#3B5BFF] border-t-transparent" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[14px] border border-dashed border-[#E4E6EF] bg-white p-12 text-center">
          <div className="w-12 h-12 rounded-xl bg-[#EEF0FF] flex items-center justify-center text-[#3B5BFF] mb-3">
            <CheckSquare className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-[#14162B]">
            {activeFilter === 'ALL'
              ? 'No tasks yet'
              : `No tasks in ${activeFilter.replace('_', ' ')}`}
          </h3>
          <p className="text-xs text-[#5B6275] mt-1 max-w-sm">
            Break this project down by creating actionable tasks and subtasks.
          </p>
          <button
            type="button"
            onClick={() => setIsLocalCreateOpen(true)}
            className="mt-4 inline-flex items-center gap-1.5 h-[40px] px-4 rounded-[10px] bg-[#3B5BFF] hover:bg-[#2A48E6] text-white text-[14px] font-semibold transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Add task
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <TaskItem key={task.id} task={task} onEdit={handleOpenEdit} />
          ))}
        </div>
      )}

      {/* Task Form & Details Modal */}
      <TaskFormModal
        isOpen={showModal}
        onClose={handleCloseModal}
        projectId={projectId}
        projectName={projectName}
        taskToEdit={taskToEdit}
      />
    </div>
  );
};

export default TaskList;
