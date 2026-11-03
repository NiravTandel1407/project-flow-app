import React, { useState, useEffect } from 'react';
import { Task, TaskCreate, TaskUpdate, TaskStatus, TaskPriority } from '../types';
import { useCreateTask, useUpdateTask, useDeleteTask, useTask } from '../hooks';
import { useSubtasks, useCreateSubtask, useToggleSubtask, useDeleteSubtask } from '@/modules/subtasks/hooks';
import { X, Loader2 } from 'lucide-react';

interface TaskFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  projectName?: string;
  taskToEdit?: Task | null;
}

export const TaskFormModal: React.FC<TaskFormModalProps> = ({
  isOpen,
  onClose,
  projectId,
  projectName = 'Website redesign',
  taskToEdit,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [error, setError] = useState<string | null>(null);

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  // If editing, fetch detailed task with subtasks
  const { data: taskDetail } = useTask(taskToEdit?.id || 0);

  // Subtasks mutations for the current task
  const taskId = taskToEdit?.id;
  const { data: fetchedSubtasks = [] } = useSubtasks(taskId || 0);
  const createSubtaskMutation = useCreateSubtask(taskId || 0);
  const toggleSubtaskMutation = useToggleSubtask(taskId || 0);
  const deleteSubtaskMutation = useDeleteSubtask(taskId || 0);

  // Use detailed subtasks if available or fallback
  const subtasks = fetchedSubtasks.length > 0 ? fetchedSubtasks : (taskDetail?.subtasks || []);
  const subtasksTotal = subtasks.length;
  const subtasksDone = subtasks.filter((s) => s.is_done).length;
  const subtasksPercent = subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'todo');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(taskToEdit.due_date ? taskToEdit.due_date.split('T')[0] : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      setDueDate('');
    }
    setNewSubtaskTitle('');
    setError(null);
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    try {
      if (taskToEdit) {
        const payload: TaskUpdate = {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          due_date: dueDate || undefined,
        };
        await updateTaskMutation.mutateAsync({ id: taskToEdit.id, payload });
      } else {
        const payload: TaskCreate = {
          title: title.trim(),
          description: description.trim() || undefined,
          status,
          priority,
          due_date: dueDate || undefined,
        };
        await createTaskMutation.mutateAsync({ projectId, payload });
      }
      onClose();
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      setError(
        typeof detail === 'string'
          ? detail
          : Array.isArray(detail)
          ? detail.map((d: any) => d.msg).join(', ')
          : 'Failed to save task. Please try again.'
      );
    }
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim() || !taskId) return;
    try {
      await createSubtaskMutation.mutateAsync({ title: newSubtaskTitle.trim() });
      setNewSubtaskTitle('');
    } catch (err) {
      console.error('Failed to add subtask', err);
    }
  };

  const handleDeleteTask = async () => {
    if (!taskToEdit) return;
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTaskMutation.mutateAsync(taskToEdit.id);
        onClose();
      } catch (err) {
        console.error('Failed to delete task', err);
      }
    }
  };

  const isSubmitting = createTaskMutation.isPending || updateTaskMutation.isPending;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card (Matching TaskModal.dc.html) */}
      <div className="relative w-full max-w-[720px] bg-white border border-[#E4E6EF] rounded-[16px] p-6 sm:p-8 shadow-[0_24px_60px_rgba(20,22,43,0.25)] z-10 max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <div className="text-[14px] text-[#5B6275]">
              {projectName} / Task
            </div>
            <h2 className="mt-1 mb-0 text-[26px] font-bold text-[#14162B]">
              {taskToEdit ? 'Task details' : 'Create task'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="border-0 bg-transparent text-[#3C4157] hover:text-[#14162B] p-1 cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[18px]">
          {/* Task Title */}
          <div>
            <label
              htmlFor="task-title"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Task title <span className="text-[#B42318]">*</span>
            </label>
            <input
              id="task-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design homepage wireframes"
              required
              className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="task-desc"
              className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
            >
              Description
            </label>
            <textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details about this task (optional)"
              className="w-full box-border h-[76px] p-[12px_14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] resize-none focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
            />
          </div>

          {/* Status, Priority, Due Date (3-column grid) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label
                htmlFor="task-status"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Status
              </label>
              <select
                id="task-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all cursor-pointer"
              >
                <option value="todo">To do</option>
                <option value="in_progress">In progress</option>
                <option value="done">Done</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="task-prio"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Priority
              </label>
              <select
                id="task-prio"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all cursor-pointer"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label
                htmlFor="task-due"
                className="block mb-[7px] text-[13px] font-semibold text-[#14162B]"
              >
                Due date
              </label>
              <input
                id="task-due"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full box-border h-[44px] px-[14px] border border-[#CDD1E0] rounded-[10px] bg-white font-normal text-[15px] text-[#14162B] placeholder-[#6B7185] focus:border-[#3B5BFF] focus:shadow-[0_0_0_3px_#E0E3FF] focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Subtasks Section (Shown when editing task) */}
          {taskId && (
            <div className="flex flex-col gap-2.5 p-4 sm:p-[16px_18px] border border-[#E4E6EF] rounded-[12px] bg-[#FAFAFD]">
              <div className="flex justify-between items-center text-[14px]">
                <span className="font-semibold text-[#14162B]">Subtasks</span>
                <span className="text-[#5B6275]">
                  {subtasksDone} of {subtasksTotal} done
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-[6px] rounded-[3px] bg-[#E4E6EF] overflow-hidden">
                <div
                  className="h-full rounded-[3px] bg-[#3B5BFF] transition-all"
                  style={{ width: `${subtasksPercent}%` }}
                />
              </div>

              {/* Subtasks List */}
              <div className="flex flex-col gap-1 max-h-48 overflow-y-auto">
                {subtasks.map((subtask) => (
                  <div
                    key={subtask.id}
                    className="flex items-center justify-between h-[34px] group"
                  >
                    <label className="flex-1 flex items-center gap-3 text-[14px] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subtask.is_done}
                        onChange={(e) =>
                          toggleSubtaskMutation.mutate({
                            id: subtask.id,
                            is_done: e.target.checked,
                          })
                        }
                        className="w-[18px] h-[18px] m-0 accent-[#3B5BFF] cursor-pointer"
                      />
                      <span
                        className={
                          subtask.is_done
                            ? 'text-[#6B7185] line-through'
                            : 'text-[#14162B]'
                        }
                      >
                        {subtask.title}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => deleteSubtaskMutation.mutate(subtask.id)}
                      aria-label="Delete subtask"
                      className="border-0 bg-transparent text-[20px] leading-none text-[#6B7185] hover:text-[#B42318] p-1 cursor-pointer transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>

              {/* Inline Add Subtask Input */}
              <div className="flex gap-2.5 mt-1">
                <input
                  type="text"
                  aria-label="New subtask"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubtask(e);
                    }
                  }}
                  placeholder="Add a subtask"
                  className="flex-1 h-[40px] px-3 border border-[#CDD1E0] rounded-[8px] text-[14px] bg-white placeholder-[#6B7185] focus:border-[#3B5BFF] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  disabled={!newSubtaskTitle.trim() || createSubtaskMutation.isPending}
                  className="h-[40px] px-5 border-0 rounded-[10px] bg-[#3B5BFF] hover:bg-[#2A48E6] font-semibold text-[14px] text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="flex justify-between items-center pt-[18px] border-t border-[#E4E6EF]">
            {taskToEdit ? (
              <button
                type="button"
                onClick={handleDeleteTask}
                className="h-[44px] px-1 border-0 bg-transparent font-semibold text-[14px] text-[#B42318] hover:underline cursor-pointer"
              >
                Delete task
              </button>
            ) : (
              <div />
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="h-[44px] px-[22px] border border-[#CDD1E0] rounded-[10px] bg-white font-semibold text-[15px] text-[#3C4157] hover:bg-[#F5F6FA] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-[44px] px-[24px] border-0 rounded-[10px] bg-[#3B5BFF] hover:bg-[#2A48E6] font-semibold text-[15px] text-white transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
              >
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                {taskToEdit ? 'Save changes' : 'Create task'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskFormModal;
