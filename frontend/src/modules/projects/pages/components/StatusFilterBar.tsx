import React from 'react';
import { Status } from '@/core/types/common';

interface StatusFilterBarProps {
  currentStatus: Status | 'ALL';
  onChange: (status: Status | 'ALL') => void;
}

export const StatusFilterBar: React.FC<StatusFilterBarProps> = ({
  currentStatus,
  onChange,
}) => {
  const options: { label: string; value: Status | 'ALL' }[] = [
    { label: 'All Projects', value: 'ALL' },
    { label: 'To Do', value: 'TODO' },
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
    { label: 'Blocked', value: 'BLOCKED' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {options.map((opt) => {
        const isActive = currentStatus === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all ${
              isActive
                ? 'bg-[#101828] text-white shadow-sm'
                : 'bg-white text-[#475467] border border-[#D0D5DD] hover:bg-slate-50'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
