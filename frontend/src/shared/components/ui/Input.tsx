import { InputHTMLAttributes, forwardRef } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-semibold text-[#101828] mb-2">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full h-[52px] rounded-xl border-[1.5px] px-4 text-base transition-all placeholder:text-[#667085] focus:outline-none focus:ring-4 ${
            error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-rose-200 bg-rose-50/20'
              : 'border-[#8A94A6] bg-white text-[#101828] focus:border-[#3B5BFF] focus:ring-[#9DB0FF]'
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1.5 text-xs font-medium text-rose-600">{error}</p>}
        {!error && helperText && <p className="mt-1.5 text-xs text-[#667085]">{helperText}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
