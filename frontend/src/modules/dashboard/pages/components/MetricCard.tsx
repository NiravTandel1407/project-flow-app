import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'brand' | 'accent' | 'dark' | 'amber' | 'rose' | 'indigo' | 'emerald';
  change?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  variant = 'brand',
  change,
}) => {
  const colorMap = {
    brand: {
      bg: 'bg-[#EEF1F9]',
      text: 'text-[#3B5BFF]',
      border: 'border-[#DDE4F7]',
    },
    indigo: {
      bg: 'bg-[#EEF1F9]',
      text: 'text-[#3B5BFF]',
      border: 'border-[#DDE4F7]',
    },
    accent: {
      bg: 'bg-[#EBFDF7]',
      text: 'text-[#059669]',
      border: 'border-[#A7F3D0]',
    },
    emerald: {
      bg: 'bg-[#EBFDF7]',
      text: 'text-[#059669]',
      border: 'border-[#A7F3D0]',
    },
    dark: {
      bg: 'bg-slate-100',
      text: 'text-[#101828]',
      border: 'border-slate-200',
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
    },
  }[variant];

  return (
    <div className="bg-white rounded-2xl border border-[#E4E7EC] p-6 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-semibold text-[#667085] uppercase tracking-wider">{label}</p>
        <p className="text-3xl font-extrabold text-[#101828] mt-1.5">{value}</p>
        {change && <p className="text-xs text-[#98A2B3] font-medium mt-1">{change}</p>}
      </div>

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorMap.bg} ${colorMap.text} ${colorMap.border}`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  );
};
