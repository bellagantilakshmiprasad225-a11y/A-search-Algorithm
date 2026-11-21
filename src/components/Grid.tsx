import React from 'react';
import { Grid as GridType } from '../types';
import { Cell } from './Cell';

interface GridProps {
  grid: GridType;
  onCellMouseDown: (row: number, col: number) => void;
  onCellMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
  onTouchMove: (e: React.TouchEvent<HTMLDivElement>) => void;
  showScores?: boolean;
}

export const Grid: React.FC<GridProps> = ({
  grid,
  onCellMouseDown,
  onCellMouseEnter,
  onMouseUp,
  onTouchMove,
  showScores = false,
}) => {
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  if (rows === 0 || cols === 0) {
    return null;
  }

  return (
    <div
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onMouseUp}
      className="w-full overflow-x-auto p-2 sm:p-4 rounded-2xl glass-card border border-slate-200/80 dark:border-white/10 shadow-2xl select-none"
    >
      <div
        className="grid gap-[1px] sm:gap-[2px] mx-auto bg-slate-200/50 dark:bg-navy-950/80 p-1 rounded-xl"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: '100%',
          width: 'max-content',
          minWidth: '100%',
        }}
      >
        {grid.map((row) =>
          row.map((node) => (
            <Cell
              key={`${node.row}-${node.col}`}
              node={node}
              onMouseDown={onCellMouseDown}
              onMouseEnter={onCellMouseEnter}
              showScores={showScores}
            />
          ))
        )}
      </div>
    </div>
  );
};
