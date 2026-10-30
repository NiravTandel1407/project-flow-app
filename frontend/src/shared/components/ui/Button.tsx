import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'dark' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-bold rounded-xl transition-all focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed';

  const variantClasses = {
    primary: 'bg-[#3B5BFF] text-white hover:bg-[#2A46DB] focus:ring-[#9DB0FF] shadow-sm',
    dark: 'bg-[#101828] text-white hover:bg-[#1d2939] focus:ring-slate-300 shadow-sm',
    secondary: 'bg-[#EEF1F9] text-[#3B5BFF] hover:bg-[#DDE4F7] focus:ring-[#9DB0FF]',
    danger: 'bg-rose-600 text-white hover:bg-rose-700 focus:ring-rose-200 shadow-sm',
    ghost: 'text-[#475467] hover:bg-slate-100 hover:text-[#101828] focus:ring-slate-200',
    outline: 'border border-[#D0D5DD] text-[#344054] hover:bg-slate-50 focus:ring-[#9DB0FF]',
  }[variant];

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2.5 text-sm',
    lg: 'px-5 py-3 text-base',
  }[size];

  return (
    <button
      className={`${baseClasses} ${variantClasses} ${sizeClasses} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
};
