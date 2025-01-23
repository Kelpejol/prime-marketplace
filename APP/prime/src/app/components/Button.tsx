"use client";

import clsx from 'clsx';

interface ButtonProps {
  actionLabel: string;
  action?: () => void;
  size?: "small" | "large" | "medium";
  color?: "primary" | "secondary" | "gradient1" | "gradient2" | "magic";
 ClassName?: string; 
  disabled?: boolean;
}

export default function Button({
  actionLabel,
  action,
  size,
  color,
  ClassName, 
  disabled,
}: ButtonProps) {
  
  const sizeClasses = {
    large: 'h-10 w-24 sm:h-12 md:w-36 lg:w-40 rounded-[9px]',
    medium: 'h-8 w-20 sm:h-10 md:w-28 lg:w-36 rounded-md',
    small: 'h-8 w-full rounded-md',
  };

  const colorClasses = {
    primary: 'bg-black',
    secondary: 'bg-white', 
    gradient1: 'bg-purple-800 hover:bg-violet-700 transition ease-in-out duration-300',
    gradient2: 'bg-gradient-to-r from-pink-700 to-purple-600 hover:from-pink-500 transition ease-in-out duration-300 hover:to-yellow-500',
    magic: 'border border-[rgb(88,199,250)] text-[rgb(88,199,250)] hover:bg-[rgba(0,0,0,0.8)] duration-1000',
  };

  const textClasses = {
    large: 'md:text-base text-xs px-2',
    medium: 'md:text-base text-xs px-2',
    small: 'md:text-base text-sm px-2',
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
    <button
      onClick={action}
      disabled={disabled}
      className={clsx(
        sizeClasses[size!], 
        colorClasses[color!], 
         textClasses[size!], 
        'flex items-center justify-center cursor-pointer capitalize text-center px-2 font-semibold font-mono text-sm sm:text-base',
        disabled && 'opacity-50 disabled:cursor-not-allowed',
          color === 'primary' && 'text-white', 
          color === "secondary" && "text-black",
        ClassName
      )}
    >
      
        {actionLabel}
      
    </button>
    </div>
  );
}