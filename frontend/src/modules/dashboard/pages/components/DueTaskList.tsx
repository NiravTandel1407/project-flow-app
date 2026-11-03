import React, { useState } from 'react';
import { Task } from '@/modules/tasks/types';
import { Clock, Calendar, CheckCircle2, ChevronRight, Flag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface DueTaskListProps {
  tasksDueToday: Task[];
  tasksDueThisWeek: Task[];
  overdueTasks: Task[];
}

export const DueTaskList: React.FC<DueTaskListProps> = ({
  tasksDueToday,
  tasksDueThisWeek,
  overdueTasks,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'today' | 'week' | 'overdue'>(
    overdueTasks.length > 0 ? 'overdue' : tasksDueToday.length > 0 ? 'today' : 'week'
  );

  const displayTasks =
    activeTab === 'today'
      ? tasksDueToday
      : activeTab === 'overdue'
      ? overdueTasks
      : tasksDueThisWeek;

  const priorityStyles: Record<string, string> = {
    high: 'bg-[#FDECEA] text-[#B42318]',
    medium: 'bg-[#FFF4DB] text-[#8A5A00]',
    low: 'bg-[#E7F6EC] text-[#1B6B3A]',
  };

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-[#3B5BFF]" />
          <h3 className="font-bold text-[#101828] text-base">
            Upcoming & Overdue Deadlines
          </h3>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#F8F9FD] p-1 rounded-xl border border-[#E4E7EC] self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveTab('today')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'today'
                ? 'bg-white text-[#14162B] shadow-sm'
                : 'text-[#5B6275] hover:text-[#14162B]'
            }`}
          >
            Today ({tasksDueToday.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('week')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'week'
                ? 'bg-white text-[#14162B] shadow-sm'
                : 'text-[#5B6275] hover:text-[#14162B]'
            }`}
          >
            This Week ({tasksDueThisWeek.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('overdue')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'overdue'
                ? 'bg-white text-[#B42318] shadow-sm'
                : 'text-[#B42318] hover:text-red-700'
            }`}
          >
            Overdue ({overdueTasks.length})
          </button>
        </div>
      </div>

      {displayTasks.length === 0 ? (
        <div className="text-center py-10">
          <CheckCircle2 className="w-9 h-9 text-[#2EE6A6] mx-auto mb-2" />
          <p className="text-sm font-semibold text-[#14162B]">
            {activeTab === 'overdue'
              ? 'No overdue tasks!'
              : activeTab === 'today'
              ? 'No tasks due today.'
              : 'No tasks due this week.'}
          </p>
          <p className="text-xs text-[#5B6275] mt-0.5">
            You're on track with your deadlines.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#F2F4F7]">
          {displayTasks.map((task) => {
            const prio = (task.priority || 'medium').toLowerCase();
            return (
              <div
                key={task.id}
                onClick={() => navigate(`/projects/${task.project_id}`)}
                className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 -mx-2 px-2 rounded-xl transition-colors cursor-pointer group"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] font-semibold text-[#14162B] group-hover:text-[#3B5BFF] truncate transition-colors">
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                        priorityStyles[prio] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      <Flag className="w-2.5 h-2.5" />
                      <span className="capitalize">{prio}</span>
                    </span>

                    {task.due_date && (
                      <span
                        className={`text-xs flex items-center gap-1 ${
                          activeTab === 'overdue' || task.is_overdue
                            ? 'font-semibold text-[#B42318]'
                            : 'text-[#5B6275]'
                        }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {activeTab === 'overdue' || task.is_overdue
                          ? `Overdue · ${formatDate(task.due_date)}`
                          : activeTab === 'today'
                          ? 'Due Today'
                          : `Due ${formatDate(task.due_date)}`}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-[#98A2B3] group-hover:text-[#3B5BFF] transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DueTaskList;
