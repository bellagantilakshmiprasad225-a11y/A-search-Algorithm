import React from 'react';
import { Play, Target, Square, Eye, CheckCircle2, Sparkles } from 'lucide-react';
import { ToolMode } from '../hooks/useGrid';

interface LegendProps {
  activeTool: ToolMode;
  onSelectTool: (tool: ToolMode) => void;
}

export const Legend: React.FC<LegendProps> = ({ activeTool, onSelectTool }) => {
  const legendItems = [
    {
      label: 'Start Node',
      icon: <Play className="w-3 h-3 fill-white stroke-white" />,
      color: 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white',
      tool: 'move-start' as ToolMode,
      hint: 'Click & drag on grid to move',
    },
    {
      label: 'Goal Node',
      icon: <Target className="w-3 h-3 stroke-[2.5]" />,
      color: 'bg-gradient-to-tr from-rose-600 to-pink-500 text-white',
      tool: 'move-goal' as ToolMode,
      hint: 'Click & drag on grid to move',
    },
    {
      label: 'Wall / Obstacle',
      icon: <Square className="w-3 h-3 fill-current" />,
      color: 'bg-slate-800 text-slate-400 border border-slate-700',
      tool: 'wall' as ToolMode,
      hint: 'Click or drag to place walls',
    },
    {
      label: 'Open Set',
      icon: <Eye className="w-3 h-3" />,
      color: 'bg-cyan-500/20 text-cyan-400 border border-cyan-400/50',
      hint: 'Frontier nodes discovered but not yet evaluated',
    },
    {
      label: 'Closed Set',
      icon: <CheckCircle2 className="w-3 h-3" />,
      color: 'bg-indigo-500/30 text-indigo-300 border border-indigo-500/50',
      hint: 'Evaluated nodes with finalized g-scores',
    },
    {
      label: 'Shortest Path',
      icon: <Sparkles className="w-3 h-3 fill-current" />,
      color: 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-bold',
      hint: 'Optimal reconstructed path',
    },
  ];

  return (
    <div className="glass-card p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
      <div className="flex flex-wrap items-center gap-3 sm:gap-4">
        {legendItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl border transition-all ${
              item.tool && activeTool === item.tool
                ? 'border-cyan-500/60 bg-cyan-500/10 shadow-sm'
                : 'border-transparent hover:bg-slate-100 dark:hover:bg-white/5'
            } ${item.tool ? 'cursor-pointer' : ''}`}
            onClick={() => item.tool && onSelectTool(item.tool)}
            title={item.hint}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shadow-sm ${item.color}`}
            >
              {item.icon}
            </div>
            <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Mode Indicator / Quick Tip */}
      <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-slate-400 bg-slate-100 dark:bg-navy-950/60 px-3 py-1 rounded-xl border border-slate-200 dark:border-white/5">
        <span className="font-semibold text-cyan-500">Tip:</span>
        <span>Click or drag cells to draw walls • Drag Start / Goal flags to reposition</span>
      </div>
    </div>
  );
};
