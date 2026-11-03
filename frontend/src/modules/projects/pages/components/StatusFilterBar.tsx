import React from 'react';
import { ProjectStatus } from '../../types';

interface StatusFilterBarProps {
  currentStatus: ProjectStatus | 'ALL';
  onChange: (status: ProjectStatus | 'ALL') => void;
}

export const StatusFilterBar: React.FC<StatusFilterBarProps> = ({
  currentStatus,
  onChange,
}) => {
  const options: { label: string; value: ProjectStatus | 'ALL' }[] = [
    { label: 'All Projects', value: 'ALL' },
    { label: 'Not started', value: 'not_started' },
    { label: 'In progress', value: 'in_progress' },
    { label: 'On hold', value: 'on_hold' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1">
      {options.map((opt) => {
        const isActive = currentStatus === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`rounded-xl px-4 py-2 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
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
