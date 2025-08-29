import React from 'react';

interface IconButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  className?: string;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg';
}

const IconButton: React.FC<IconButtonProps> = ({
  onClick,
  icon,
  className = '',
  ariaLabel,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <button
      onClick={onClick}
      className={`text-white hover:text-gray-300 transition-colors duration-200 focus:outline-none ${className}`}
      aria-label={ariaLabel}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement, {
            className: sizeClasses[size]
          })
        : icon}
    </button>
  );
};

export default IconButton;
