import React from 'react';
import { GridNode } from '../types';
import { Play, Target } from 'lucide-react';

interface CellProps {
  node: GridNode;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  showScores?: boolean;
}

export const Cell: React.FC<CellProps> = React.memo(
  ({ node, onMouseDown, onMouseEnter, showScores = false }) => {
    const { row, col, isStart, isGoal, isWall, state, f, g, h } = node;

    let cellContent = null;
    let cellClasses = 'border border-slate-200/40 dark:border-white/[0.04] transition-colors duration-100';

    if (isStart) {
      cellClasses =
        'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-500/30 scale-[1.03] z-20 rounded-md';
      cellContent = <Play className="w-3.5 h-3.5 fill-white stroke-white animate-pulse" />;
    } else if (isGoal) {
      cellClasses =
        'bg-gradient-to-tr from-rose-600 to-pink-500 text-white shadow-md shadow-rose-500/30 scale-[1.03] z-20 rounded-md';
      cellContent = <Target className="w-3.5 h-3.5 stroke-[2.5]" />;
    } else if (isWall) {
      cellClasses =
        'bg-slate-800 dark:bg-navy-950 border-slate-900 dark:border-slate-800/80 shadow-inner scale-[0.98] rounded-sm';
    } else if (state === 'path') {
      cellClasses =
        'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 font-bold border-amber-300 shadow-md shadow-amber-400/30 node-path-anim z-10 rounded-sm';
    } else if (state === 'closed') {
      cellClasses =
        'bg-indigo-500/30 dark:bg-indigo-600/35 border-indigo-500/40 text-indigo-200 node-closed-anim';
    } else if (state === 'open') {
      cellClasses =
        'bg-cyan-400/25 dark:bg-cyan-500/30 border-cyan-400/60 text-cyan-200 node-open-anim';
    } else {
      cellClasses +=
        ' bg-white dark:bg-navy-900/50 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/10 hover:border-cyan-500/40';
    }

    return (
      <div
        data-row={row}
        data-col={col}
        onMouseDown={(e) => {
          e.preventDefault();
          onMouseDown(row, col);
        }}
        onMouseEnter={() => onMouseEnter(row, col)}
        className={`relative flex items-center justify-center select-none cursor-pointer aspect-square ${cellClasses}`}
        title={`(${row}, ${col}) ${isStart ? 'Start' : isGoal ? 'Goal' : isWall ? 'Wall' : state}`}
      >
        {cellContent}

        {/* Optional F, G, H overlay for detailed step examination */}
        {showScores && state !== 'unvisited' && !isStart && !isGoal && !isWall && f !== Infinity && (
          <div className="absolute inset-0 flex flex-col justify-between p-0.5 text-[8px] leading-none pointer-events-none opacity-80 font-mono">
            <span className="text-cyan-300 font-bold">{f}</span>
            <div className="flex justify-between text-[7px] text-slate-300">
              <span>{g}</span>
              <span>{Math.round(h || 0)}</span>
            </div>
          </div>
        )}
      </div>
    );
  }
);

Cell.displayName = 'Cell';
