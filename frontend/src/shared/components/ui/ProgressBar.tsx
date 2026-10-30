import React from 'react';

export interface ProgressBarProps {
  progress: number; // 0 to 100
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  color?: 'brand' | 'accent' | 'amber' | 'rose';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  size = 'md',
  showLabel = false,
  color = 'brand',
  className = '',
}) => {
  const clampedProgress = Math.min(100, Math.max(0, Math.round(progress)));

  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  }[size];

  const colorClasses = {
    brand: 'bg-[#3B5BFF]',
    accent: 'bg-[#2EE6A6]',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  }[color];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5 text-xs font-semibold text-[#475467]">
          <span>Progress</span>
          <span className="text-[#101828] font-bold">{clampedProgress}%</span>
        </div>
      )}
      <div className={`w-full bg-[#EEF1F9] rounded-full overflow-hidden ${heightClasses}`}>
        <div
          className={`${colorClasses} ${heightClasses} rounded-full transition-all duration-300 ease-out`}
          style={{ width: `${clampedProgress}%` }}
        />
      </div>
    </div>
  );
};
