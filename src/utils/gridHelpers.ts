import { Grid, GridNode, GridCoordinates } from '../types';

/**
 * Creates an empty grid with specified dimensions and initial start/goal coordinates.
 */
export function createEmptyGrid(
  rows: number,
  cols: number,
  start: GridCoordinates = { row: Math.floor(rows / 2), col: Math.floor(cols / 4) },
  goal: GridCoordinates = { row: Math.floor(rows / 2), col: Math.floor((cols * 3) / 4) }
): Grid {
  const grid: Grid = [];

  for (let r = 0; r < rows; r++) {
    const rowNodes: GridNode[] = [];
    for (let c = 0; c < cols; c++) {
      const isStart = r === start.row && c === start.col;
      const isGoal = r === goal.row && c === goal.col;

      rowNodes.push({
        row: r,
        col: c,
        isStart,
        isGoal,
        isWall: false,
        state: 'unvisited',
        g: Infinity,
        h: Infinity,
        f: Infinity,
        parent: null,
      });
    }
    grid.push(rowNodes);
  }

  return grid;
}

/**
 * Clones a grid immutably, optionally preserving wall layout while resetting search state.
 */
export function cloneGrid(grid: Grid, keepWalls: boolean = true): Grid {
  return grid.map((row) =>
    row.map((node) => ({
      ...node,
      isWall: keepWalls ? node.isWall : false,
      state: 'unvisited',
      g: Infinity,
      h: Infinity,
      f: Infinity,
      parent: null,
    }))
  );
}

/**
 * Clones a grid and toggles a wall at (row, col) ensuring start or goal are NEVER overwritten.
 */
export function toggleWall(grid: Grid, row: number, col: number, forceWall?: boolean): Grid {
  const node = grid[row]?.[col];
  if (!node || node.isStart || node.isGoal) {
    return grid; // Walls CANNOT overwrite start or goal
  }

  const newIsWall = forceWall !== undefined ? forceWall : !node.isWall;
  if (node.isWall === newIsWall) return grid;

  return grid.map((rList, r) => {
    if (r !== row) return rList;
    return rList.map((cNode, c) => {
      if (c !== col) return cNode;
      return { ...cNode, isWall: newIsWall, state: 'unvisited' };
    });
  });
}
