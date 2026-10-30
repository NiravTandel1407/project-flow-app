import React from 'react';
import { Task } from '@/modules/tasks/types';
import { OverdueBadge } from '@/modules/tasks/components/OverdueBadge';
import { Badge } from '@/shared/components/ui/Badge';
import { Clock, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DueTaskListProps {
  tasks: Task[];
}

export const DueTaskList: React.FC<DueTaskListProps> = ({ tasks }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-indigo-600" />
          <h3 className="font-bold text-slate-800 text-base">Tasks Due Soon</h3>
        </div>
        <span className="text-xs text-slate-400 font-medium">Upcoming deadlines</span>
      </div>

      {tasks.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
          <p className="text-sm font-medium text-slate-700">All caught up!</p>
          <p className="text-xs text-slate-400 mt-0.5">No urgent tasks pending right now.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <div
              key={task.id}
              onClick={() => navigate(`/projects/${task.project_id}`)}
              className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors cursor-pointer"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-slate-800 truncate">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge size="sm" variant="info">
                    {task.status.replace('_', ' ')}
                  </Badge>
                  <OverdueBadge dueDate={task.due_date} isCompleted={task.status === 'COMPLETED'} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

