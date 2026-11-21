import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  colorClass?: string;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  colorClass = 'text-cyan-400',
  badge,
}) => {
  return (
    <div className="glass-card p-4 rounded-2xl relative overflow-hidden flex flex-col justify-between">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 truncate">{label}</span>
        <div className={`p-1.5 rounded-lg bg-slate-100 dark:bg-white/5 ${colorClass}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          {value}
        </span>
        {badge && (
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            {badge}
          </span>
        )}
      </div>

      {subValue && (
        <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 truncate">{subValue}</p>
      )}
    </div>
  );
};
