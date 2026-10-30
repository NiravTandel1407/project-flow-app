import React from 'react';
import { AlertCircle, Clock } from 'lucide-react';

interface OverdueBadgeProps {
  dueDate?: string | null;
  isCompleted?: boolean;
}

export const OverdueBadge: React.FC<OverdueBadgeProps> = ({ dueDate, isCompleted }) => {
  if (!dueDate || isCompleted) return null;

  const due = new Date(dueDate);
  const now = new Date();
  const isOverdue = due.getTime() < now.getTime();

  const formattedDate = due.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });

  if (isOverdue) {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
        <AlertCircle className="w-3 h-3" />
        Overdue ({formattedDate})
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
      <Clock className="w-3 h-3" />
      Due {formattedDate}
    </span>
  );
};

