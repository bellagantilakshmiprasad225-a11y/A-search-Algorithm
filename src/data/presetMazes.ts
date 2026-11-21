import { Grid, GridCoordinates } from '../types';
import { cloneGrid, toggleWall } from '../utils/gridHelpers';

export interface PresetMaze {
  id: string;
  name: string;
  description: string;
  apply: (grid: Grid, start: GridCoordinates, goal: GridCoordinates) => Grid;
}

export const PRESET_MAZES: PresetMaze[] = [
  {
    id: 'bottleneck',
    name: 'Bottleneck Funnel',
    description: 'Forces pathfinding through a single-cell pinch point to demonstrate heuristic navigation under tight constraints.',
    apply: (grid, start, goal) => {
      let g = cloneGrid(grid, false);
      const rows = g.length;
      const cols = g[0]?.length || 0;
      const midCol = Math.floor(cols / 2);
      const midRow = Math.floor(rows / 2);

      // Vertical wall split with a single center aperture
      for (let r = 0; r < rows; r++) {
        if (r !== midRow) {
          g = toggleWall(g, r, midCol, true);
        }
      }
      g = toggleWall(g, start.row, start.col, false);
      g = toggleWall(g, goal.row, goal.col, false);
      return g;
    },
  },
  {
    id: 'zigzag',
    name: 'Slalom Zig-Zag',
    description: 'Alternating barriers test A* turning penalties and compare against BFS uniform spread.',
    apply: (grid, start, goal) => {
      let g = cloneGrid(grid, false);
      const rows = g.length;
      const cols = g[0]?.length || 0;

      const colGap = Math.max(3, Math.floor(cols / 5));
      let alternate = true;

      for (let c = colGap; c < cols - 2; c += colGap) {
        if (alternate) {
          // Wall from top down to rows - 3
          for (let r = 0; r < rows - 3; r++) {
            g = toggleWall(g, r, c, true);
          }
        } else {
          // Wall from bottom up to row 3
          for (let r = 3; r < rows; r++) {
            g = toggleWall(g, r, c, true);
          }
        }
        alternate = !alternate;
      }
      g = toggleWall(g, start.row, start.col, false);
      g = toggleWall(g, goal.row, goal.col, false);
      return g;
    },
  },
  {
    id: 'trap_pocket',
    name: 'U-Shape Local Minima Trap',
    description: 'A deep concave obstacle that tempts the heuristic forward, forcing A* to back out of a local minimum.',
    apply: (grid, start, goal) => {
      let g = cloneGrid(grid, false);
      const rows = g.length;
      const cols = g[0]?.length || 0;
      const midR = Math.floor(rows / 2);
      const midC = Math.floor(cols / 2);

      const halfH = Math.min(4, Math.floor(rows / 4));
      const width = Math.min(8, Math.floor(cols / 3));

      // Top wall of pocket
      for (let c = midC - width; c <= midC; c++) {
        g = toggleWall(g, midR - halfH, c, true);
      }
      // Bottom wall of pocket
      for (let c = midC - width; c <= midC; c++) {
        g = toggleWall(g, midR + halfH, c, true);
      }
      // Back wall of pocket
      for (let r = midR - halfH; r <= midR + halfH; r++) {
        g = toggleWall(g, r, midC, true);
      }

      g = toggleWall(g, start.row, start.col, false);
      g = toggleWall(g, goal.row, goal.col, false);
      return g;
    },
  },
];
