import React from 'react';
import { FolderKanban } from 'lucide-react';
import { ProjectsByStatus } from '../../types';

interface StatusBreakdownProps {
  projectsByStatus: ProjectsByStatus;
}

export const StatusBreakdown: React.FC<StatusBreakdownProps> = ({
  projectsByStatus,
}) => {
  const total = projectsByStatus.total || 0;

  const items = [
    {
      label: 'Not Started',
      count: projectsByStatus.not_started || 0,
      color: 'bg-slate-400',
    },
    {
      label: 'In Progress',
      count: projectsByStatus.in_progress || 0,
      color: 'bg-[#3B5BFF]',
    },
    {
      label: 'On Hold',
      count: projectsByStatus.on_hold || 0,
      color: 'bg-amber-500',
    },
    {
      label: 'Completed',
      count: projectsByStatus.completed || 0,
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <FolderKanban className="w-5 h-5 text-[#3B5BFF]" />
        <h3 className="font-bold text-[#101828] text-base">
          Projects by Status
        </h3>
      </div>

      <div className="space-y-4">
        {/* Multi-segment Progress Bar */}
        <div className="h-3 w-full bg-[#EEF1F9] rounded-full flex overflow-hidden">
          {total > 0 ? (
            items.map((item) => {
              const pct = (item.count / total) * 100;
              if (pct === 0) return null;
              return (
                <div
                  key={item.label}
                  className={`${item.color} h-full transition-all`}
                  style={{ width: `${pct}%` }}
                  title={`${item.label}: ${item.count}`}
                />
              );
            })
          ) : (
            <div className="w-full bg-slate-200 h-full" />
          )}
        </div>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {items.map((item) => {
            const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
            return (
              <div
                key={item.label}
                className="flex items-center justify-between p-2.5 rounded-xl border border-[#F2F4F7] bg-[#F8F9FD]"
              >
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="text-xs font-semibold text-[#344054]">
                    {item.label}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-[#101828]">
                    {item.count}
                  </span>
                  <span className="text-[10px] text-[#667085] ml-1">
                    ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
