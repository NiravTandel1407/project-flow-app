import React, { useState } from 'react';
import { Task } from '../types';
import { useToggleTaskStatus, useDeleteTask } from '../hooks';
import { OverdueBadge } from './OverdueBadge';
import { SubtaskChecklist } from '@/modules/subtasks/components/SubtaskChecklist';
import { Badge } from '@/shared/components/ui/Badge';
import { Check, ChevronDown, ChevronRight, Trash2, Edit2, ListTodo } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onEdit?: (task: Task) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const [showSubtasks, setShowSubtasks] = useState(false);
  const toggleMutation = useToggleTaskStatus();
  const deleteMutation = useDeleteTask();

  const isCompleted = task.status === 'COMPLETED';

  const handleToggle = () => {
    toggleMutation.mutate({
      id: task.id,
      status: isCompleted ? 'TODO' : 'COMPLETED',
    });
  };

  const priorityVariants: Record<string, 'default' | 'info' | 'warning' | 'danger'> = {
    LOW: 'default',
    MEDIUM: 'info',
    HIGH: 'warning',
    URGENT: 'danger',
  };

  return (
    <div
      className={`rounded-2xl border bg-white p-4 transition-all hover:shadow-sm ${
        isCompleted ? 'border-[#E4E7EC]/60 bg-slate-50/50' : 'border-[#E4E7EC]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left: Checkbox & Title */}
        <div className="flex items-start gap-3.5 flex-1 min-w-0">
          <button
            type="button"
            onClick={handleToggle}
            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
              isCompleted
                ? 'border-[#2EE6A6] bg-[#2EE6A6] text-[#101828]'
                : 'border-[#8A94A6] bg-white hover:border-[#3B5BFF]'
            }`}
          >
            {isCompleted && <Check className="h-3 w-3 stroke-[3.5]" />}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h4
                className={`text-sm font-semibold text-[#101828] ${
                  isCompleted ? 'line-through text-[#98A2B3]' : ''
                }`}
              >
                {task.title}
              </h4>
              <Badge variant={priorityVariants[task.priority] || 'default'} size="sm">
                {task.priority}
              </Badge>
              <OverdueBadge dueDate={task.due_date} isCompleted={isCompleted} />
            </div>

            {task.description && (
              <p className="mt-1 text-xs text-[#667085] line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Subtasks Accordion Trigger */}
            <div className="mt-3 flex items-center gap-4">
              <button
                type="button"
                onClick={() => setShowSubtasks(!showSubtasks)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#667085] hover:text-[#3B5BFF] transition-colors"
              >
                <ListTodo className="w-3.5 h-3.5" />
                <span>Subtasks</span>
                {showSubtasks ? (
                  <ChevronDown className="w-3.5 h-3.5" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1 opacity-80 hover:opacity-100 shrink-0">
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-[#98A2B3] hover:text-[#3B5BFF] rounded-lg hover:bg-slate-50 transition-colors"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => deleteMutation.mutate(task.id)}
            className="p-1.5 text-[#98A2B3] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Subtasks Checklist */}
      {showSubtasks && (
        <div className="mt-3 pl-8 border-t border-[#F2F4F7] pt-3">
          <SubtaskChecklist taskId={task.id} />
        </div>
      )}
    </div>
  );
};
