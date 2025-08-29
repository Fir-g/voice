import React from 'react';

interface CircularButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  bgColor: string;
  iconColor: string;
  ariaLabel: string;
  size?: 'sm' | 'md' | 'lg';
}

const CircularButton: React.FC<CircularButtonProps> = ({
  onClick,
  icon,
  bgColor,
  iconColor,
  ariaLabel,
  size = 'lg'
}) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  const iconSizeClasses = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizeClasses[size]}
        rounded-full 
        flex items-center 
        justify-center 
        transition-all 
        duration-200 
        focus:outline-none 
        focus:ring-2 
        focus:ring-white 
        focus:ring-opacity-50
        ${bgColor}
      `}
      aria-label={ariaLabel}
    >
      {React.isValidElement(icon)
        ? React.cloneElement(icon as React.ReactElement, {
            className: `${iconSizeClasses[size]} ${iconColor}`
          })
        : icon}
    </button>
  );
};

export default CircularButton;
