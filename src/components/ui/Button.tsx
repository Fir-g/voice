import React from 'react';

interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = ''
}) => {
  const baseClasses = 'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-opacity-50';
  
  const variantClasses = {
    primary: 'bg-white text-black hover:bg-gray-100 focus:ring-white',
    secondary: 'bg-gray-300 hover:bg-gray-400 text-black focus:ring-gray-300',
    danger: 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
  };

  const sizeClasses = {
    sm: 'py-2 px-4 text-sm',
    md: 'py-2 px-4',
    lg: 'py-3 px-6 text-lg'
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      onClick={onClick}
      className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${widthClass}
        ${className}
      `}
    >
      {children}
    </button>
  );
};

export default Button;
