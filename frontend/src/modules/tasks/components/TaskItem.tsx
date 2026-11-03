import React, { useState } from 'react';
import { Task } from '../types';
import { useToggleTaskStatus } from '../hooks';
import { useSubtasks, useToggleSubtask, useCreateSubtask, useDeleteSubtask } from '@/modules/subtasks/hooks';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  const toggleTaskStatus = useToggleTaskStatus();

  // Subtasks for this task
  const { data: subtasks = [] } = useSubtasks(task.id);
  const toggleSubtask = useToggleSubtask(task.id);
  const createSubtask = useCreateSubtask(task.id);
  const deleteSubtask = useDeleteSubtask(task.id);

  const isDone = task.status === 'done' || task.status === 'COMPLETED';

  // Counts from backend or local subtasks
  const subtasksTotal = subtasks.length > 0 ? subtasks.length : (task.subtasks_total ?? 0);
  const subtasksDone =
    subtasks.length > 0
      ? subtasks.filter((s) => s.is_done).length
      : (task.subtasks_done ?? 0);
  const progressPercent =
    subtasksTotal > 0 ? Math.round((subtasksDone / subtasksTotal) * 100) : 0;

  const handleToggleTask = () => {
    toggleTaskStatus.mutate({
      id: task.id,
      status: isDone ? 'todo' : 'done',
    });
  };

  const handleAddSubtask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    try {
      await createSubtask.mutateAsync({ title: newSubtaskTitle.trim() });
      setNewSubtaskTitle('');
    } catch (err) {
      console.error('Failed to add subtask', err);
    }
  };

  // Format Due Date
  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formattedDueDate = formatDate(task.due_date);

  // Status mapping
  const statusLabel =
    task.status === 'done' || task.status === 'COMPLETED'
      ? 'Done'
      : task.status === 'in_progress' || task.status === 'IN_PROGRESS'
      ? 'In progress'
      : 'To do';

  const statusStyles: Record<string, string> = {
    Done: 'bg-[#E7F6EC] text-[#1B6B3A]',
    'In progress': 'bg-[#E8EBFF] text-[#2B38C8]',
    'To do': 'bg-[#EEF0F5] text-[#3C4157]',
  };

  // Priority mapping
  const priorityStr = (task.priority || 'medium').toLowerCase();
  const priorityLabel =
    priorityStr === 'high'
      ? 'High'
      : priorityStr === 'low'
      ? 'Low'
      : 'Medium';

  const priorityStyles: Record<string, string> = {
    High: 'bg-[#FDECEA] text-[#B42318]',
    Medium: 'bg-[#FFF4DB] text-[#8A5A00]',
    Low: 'bg-[#E7F6EC] text-[#1B6B3A]',
  };

  return (
    <div className="bg-white border border-[#E4E6EF] rounded-[12px] overflow-hidden transition-all shadow-sm">
      {/* Main Task Row */}
      <div className="flex items-center gap-3 sm:gap-4 p-4 sm:px-5">
        {/* Checkbox */}
        <input
          type="checkbox"
          checked={isDone}
          onChange={handleToggleTask}
          aria-label={`Mark ${task.title} as ${isDone ? 'not done' : 'done'}`}
          className="w-5 h-5 m-0 accent-[#3B5BFF] cursor-pointer shrink-0"
        />

        {/* Title and Due Date */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onEdit?.(task)}>
          <div
            className={`text-[15px] font-semibold truncate transition-colors hover:text-[#3B5BFF] ${
              isDone ? 'line-through text-[#6B7185]' : 'text-[#14162B]'
            }`}
          >
            {task.title}
          </div>

          <div className="mt-0.5 text-[13px] flex items-center gap-1.5 flex-wrap">
            {task.is_overdue && !isDone ? (
              <span className="font-semibold text-[#B42318]">
                Overdue · due {formattedDueDate}
              </span>
            ) : isDone ? (
              <span className="text-[#5B6275]">
                Completed {formatDate(task.completed_at) || formattedDueDate || ''}
              </span>
            ) : formattedDueDate ? (
              <span className="text-[#5B6275]">Due {formattedDueDate}</span>
            ) : null}
          </div>
        </div>

        {/* Priority Badge */}
        <span
          className={`hidden xs:inline-block px-2.5 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${
            priorityStyles[priorityLabel]
          }`}
        >
          {priorityLabel}
        </span>

        {/* Status Badge */}
        <span
          className={`inline-block px-2.5 py-1 rounded-full text-[12px] font-semibold whitespace-nowrap ${
            statusStyles[statusLabel]
          }`}
        >
          {statusLabel}
        </span>

        {/* Subtasks Progress Indicator */}
        <div className="hidden sm:block w-24 shrink-0">
          <div className="mb-1 text-[12px] text-[#5B6275]">
            {subtasksDone} / {subtasksTotal} subtasks
          </div>
          <div className="h-[6px] rounded-[3px] bg-[#E4E6EF] overflow-hidden">
            <div
              className="h-full rounded-[3px] bg-[#3B5BFF] transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Expand / Collapse Button */}
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label={isExpanded ? 'Collapse subtasks' : 'Expand subtasks'}
          className="p-1 border-0 bg-transparent text-[#5B6275] hover:text-[#14162B] cursor-pointer transition-colors"
        >
          {isExpanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Inline Subtasks Dropdown */}
      {isExpanded && (
        <div className="flex flex-col gap-2.5 px-5 py-3.5 sm:pl-14 border-t border-[#E4E6EF] bg-[#FAFAFD]">
          {subtasks.length === 0 ? (
            <div className="text-[13px] text-[#5B6275] py-1">
              No subtasks yet. Add one below.
            </div>
          ) : (
            subtasks.map((subtask) => (
              <div
                key={subtask.id}
                className="flex items-center justify-between group py-0.5"
              >
                <label className="flex-1 flex items-center gap-3 text-[14px] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={subtask.is_done}
                    onChange={(e) =>
                      toggleSubtask.mutate({
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
                  onClick={() => deleteSubtask.mutate(subtask.id)}
                  aria-label="Delete subtask"
                  className="border-0 bg-transparent text-[20px] leading-none text-[#6B7185] hover:text-[#B42318] p-1 cursor-pointer transition-colors"
                >
                  ×
                </button>
              </div>
            ))
          )}

          {/* Inline Add Input */}
          <form onSubmit={handleAddSubtask} className="flex gap-2.5 mt-1">
            <input
              type="text"
              aria-label="New subtask"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              placeholder="Add a subtask"
              className="flex-1 h-[38px] px-3 border border-[#CDD1E0] rounded-[8px] text-[14px] bg-white placeholder-[#6B7185] focus:border-[#3B5BFF] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newSubtaskTitle.trim() || createSubtask.isPending}
              className="h-[38px] px-4 sm:px-5 border-0 rounded-[8px] bg-[#3B5BFF] hover:bg-[#2A48E6] font-semibold text-[14px] text-white transition-colors cursor-pointer disabled:opacity-50"
            >
              Add
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default TaskItem;
