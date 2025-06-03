import React from 'react';

const CustomButton = ({
  children,
  color = 'primary',
  onClick,
  className = '',
  disabled = false,
  size = 'md', // 'sm', 'md', 'lg'
}) => {
  const baseStyles = 'rounded font-bold text-white focus:outline-none focus:ring-2';
  const colorStyles = {
    primary: 'bg-blue-500 hover:bg-blue-600',
    secondary: 'bg-gray-500 hover:bg-gray-600',
    danger: 'bg-red-500 hover:bg-red-600',
  };
  const sizeStyles = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${colorStyles[color]} ${sizeStyles[size]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default CustomButton;