import React from 'react';

export interface LogoProps {
  variant?: 'primary' | 'onDark' | 'onBrand';
  size?: number;
  showWordmark?: boolean;
  wordmarkSize?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  variant = 'primary',
  size = 40,
  showWordmark = false,
  wordmarkSize = 'md',
  className = '',
}) => {
  // Styles based on variant
  const rectFill = variant === 'onBrand' ? '#FFFFFF' : '#3B5BFF';
  const pathStroke = variant === 'onBrand' ? '#3B5BFF' : '#FFFFFF';
  const circleFill =
    variant === 'onBrand'
      ? '#101828'
      : variant === 'onDark'
      ? '#2EE6A6'
      : '#2EE6A6';

  const wordmarkStyles = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-5xl',
  }[wordmarkSize];

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Project Flow Icon */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <rect width="64" height="64" rx="16" fill={rectFill} />
        <path
          d="M23 46V19H35C41.075 19 46 23.029 46 28.5C46 33.971 41.075 38 35 38H23"
          stroke={pathStroke}
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="23" cy="46" r="5" fill={circleFill} />
      </svg>

      {/* Official Wordmark */}
      {showWordmark && (
        <span
          className={`font-extrabold tracking-tight leading-none ${wordmarkStyles} ${
            variant === 'primary' ? 'text-[#101828]' : 'text-white'
          }`}
        >
          Project{' '}
          <span
            style={{
              color:
                variant === 'onBrand'
                  ? '#7CF2C8'
                  : variant === 'onDark'
                  ? '#2EE6A6'
                  : '#3B5BFF',
            }}
          >
            Flow
          </span>
        </span>
      )}
    </div>
  );
};

