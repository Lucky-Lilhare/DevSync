import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'emerald' | 'gradient' | 'cyan' | 'bexer' | 'lime';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#08090f] disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1 gap-1.5',
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-3.5 py-2 gap-2',
    lg: 'text-sm sm:text-base px-4 py-2.5 gap-2',
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 hover:from-indigo-400 hover:via-purple-400 hover:to-indigo-500 text-white font-semibold border border-indigo-400/40 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 focus:ring-indigo-500',
    bexer: 'bg-[#86c33a] hover:bg-[#74b02c] text-[#121922] font-bold shadow-md shadow-[#86c33a]/30 border border-[#86c33a] hover:shadow-lg hover:shadow-[#86c33a]/40 focus:ring-[#86c33a]',
    lime: 'bg-[#86c33a]/15 hover:bg-[#86c33a]/25 text-[#9ae243] border border-[#86c33a]/40 font-semibold focus:ring-[#86c33a]',
    secondary: 'bg-zinc-900/90 hover:bg-zinc-850/95 text-zinc-100 border border-zinc-750 hover:border-zinc-600 shadow-sm focus:ring-zinc-600 backdrop-blur-sm',
    gradient: 'bg-gradient-to-r from-violet-600 via-indigo-600 to-cyan-500 hover:from-violet-500 hover:via-indigo-500 hover:to-cyan-400 text-white font-semibold shadow-lg shadow-purple-500/25 border border-purple-400/40 focus:ring-purple-500',
    danger: 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 focus:ring-rose-500',
    ghost: 'bg-transparent hover:bg-zinc-800/70 text-zinc-300 hover:text-white focus:ring-zinc-700',
    outline: 'bg-zinc-900/60 hover:bg-zinc-850/80 border border-zinc-750 hover:border-zinc-600 text-zinc-200 hover:text-white backdrop-blur-sm focus:ring-zinc-600',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium shadow-md shadow-emerald-500/20 border border-emerald-400/30 focus:ring-emerald-500',
    cyan: 'bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 font-medium focus:ring-cyan-500',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </button>
  );
};
