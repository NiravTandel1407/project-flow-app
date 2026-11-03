import React, { useState } from 'react';
import { Subtask } from '../types';
import { useSubtasks, useToggleSubtask, useCreateSubtask, useDeleteSubtask } from '../hooks';
import { Check, Trash2, Loader2 } from 'lucide-react';

interface SubtaskChecklistProps {
  taskId: number;
}

export const SubtaskChecklist: React.FC<SubtaskChecklistProps> = ({ taskId }) => {
  const [newTitle, setNewTitle] = useState('');
  const { data: subtasks = [], isLoading } = useSubtasks(taskId);
  const toggleMutation = useToggleSubtask(taskId);
  const createMutation = useCreateSubtask(taskId);
  const deleteMutation = useDeleteSubtask(taskId);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await createMutation.mutateAsync({
      task_id: taskId,
      title: newTitle.trim(),
    });
    setNewTitle('');
  };

  const completedCount = subtasks.filter((s) => s.is_done || s.is_completed).length;

  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center justify-between text-xs font-semibold text-[#667085] uppercase tracking-wider">
        <span>Subtasks</span>
        <span>
          {completedCount} of {subtasks.length} done
        </span>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-3">
          <Loader2 className="w-4 h-4 animate-spin text-[#98A2B3]" />
        </div>
      ) : (
        <div className="space-y-1.5">
          {subtasks.map((subtask: Subtask) => {
            const isCompleted = subtask.is_done ?? subtask.is_completed ?? false;
            return (
              <div
                key={subtask.id}
                className="group flex items-center justify-between rounded-xl px-2.5 py-1.5 text-sm hover:bg-[#F8F9FD] border border-transparent hover:border-[#E4E7EC] transition-colors"
              >
                <label className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() =>
                      toggleMutation.mutate({
                        id: subtask.id,
                        is_done: !isCompleted,
                      })
                    }
                    className={`w-4 h-4 rounded-full flex items-center justify-center border transition-all ${
                      isCompleted
                        ? 'bg-[#2EE6A6] border-[#2EE6A6] text-[#101828]'
                        : 'border-[#8A94A6] bg-white hover:border-[#3B5BFF]'
                    }`}
                  >
                    {isCompleted && <Check className="w-2.5 h-2.5 stroke-[3.5]" />}
                  </button>

                  <span
                    className={`truncate text-xs ${
                      isCompleted ? 'line-through text-[#98A2B3]' : 'text-[#344054]'
                    }`}
                  >
                    {subtask.title}
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => deleteMutation.mutate(subtask.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 text-[#98A2B3] hover:text-rose-600 transition-opacity"
                  title="Delete subtask"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Subtask form */}
      <form onSubmit={handleAdd} className="flex items-center gap-2 pt-1">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Add a new subtask..."
          className="flex-1 rounded-xl border border-[#D0D5DD] bg-white px-3 py-1.5 text-xs text-[#101828] placeholder:text-[#98A2B3] focus:border-[#3B5BFF] focus:outline-none"
        />
        <button
          type="submit"
          disabled={!newTitle.trim() || createMutation.isPending}
          className="rounded-xl bg-[#EEF1F9] px-3 py-1.5 text-xs font-semibold text-[#3B5BFF] hover:bg-[#E0E6F6] disabled:opacity-50 transition-colors"
        >
          Add
        </button>
      </form>
    </div>
  );
};
