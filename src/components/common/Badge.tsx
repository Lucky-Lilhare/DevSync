import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'emerald' | 'cyan' | 'indigo' | 'amber' | 'rose' | 'slate' | 'purple' | 'zinc' | 'lime';
  size?: 'sm' | 'md';
  dot?: boolean;
  pulseDot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'zinc',
  size = 'md',
  dot = false,
  pulseDot = false,
  className = '',
}) => {
  const variantStyles = {
    zinc: 'bg-zinc-900 text-zinc-300 border-zinc-800',
    slate: 'bg-zinc-900/90 text-zinc-400 border-zinc-800',
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    lime: 'bg-[#86c33a]/15 text-[#9ae243] border-[#86c33a]/30',
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    indigo: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    purple: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  };

  const dotStyles = {
    zinc: 'bg-zinc-400',
    slate: 'bg-zinc-400',
    emerald: 'bg-emerald-400',
    lime: 'bg-[#86c33a]',
    cyan: 'bg-cyan-400',
    indigo: 'bg-indigo-400',
    amber: 'bg-amber-400',
    rose: 'bg-rose-400',
    purple: 'bg-purple-400',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 gap-1.5',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-1.5 w-1.5">
          {pulseDot && (
            <span
              className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotStyles[variant]}`}
            />
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${dotStyles[variant]}`} />
        </span>
      )}
      {children}
    </span>
  );
};
