import { Grid, GridCoordinates } from '../types';
import { cloneGrid, toggleWall } from './gridHelpers';

/**
 * Random Obstacle Generator
 * Generates randomly scattered walls based on a density threshold,
 * preserving start and goal open.
 */
export function generateRandomMaze(
  grid: Grid,
  start: GridCoordinates,
  goal: GridCoordinates,
  density: number = 0.28
): Grid {
  let newGrid = cloneGrid(grid, false);
  const rows = newGrid.length;
  const cols = rows > 0 ? newGrid[0].length : 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if ((r === start.row && c === start.col) || (r === goal.row && c === goal.col)) {
        continue;
      }
      if (Math.random() < density) {
        newGrid = toggleWall(newGrid, r, c, true);
      }
    }
  }

  return newGrid;
}

/**
 * Recursive Division Maze Generator
 * Algorithmic maze generation that creates natural corridors and guaranteed passages.
 */
export function generateRecursiveDivisionMaze(
  grid: Grid,
  start: GridCoordinates,
  goal: GridCoordinates
): Grid {
  let newGrid = cloneGrid(grid, false);
  const rows = newGrid.length;
  const cols = rows > 0 ? newGrid[0].length : 0;

  if (rows < 5 || cols < 5) {
    return generateRandomMaze(grid, start, goal, 0.25);
  }

  // Draw outer borders
  for (let r = 0; r < rows; r++) {
    newGrid = toggleWall(newGrid, r, 0, true);
    newGrid = toggleWall(newGrid, r, cols - 1, true);
  }
  for (let c = 0; c < cols; c++) {
    newGrid = toggleWall(newGrid, 0, c, true);
    newGrid = toggleWall(newGrid, rows - 1, c, true);
  }

  // Recursive division helper
  function divide(rStart: number, rEnd: number, cStart: number, cEnd: number) {
    const width = cEnd - cStart;
    const height = rEnd - rStart;

    if (width < 3 || height < 3) return;

    // Decide orientation: divide horizontally if taller than wide
    const horizontal = height > width;

    if (horizontal) {
      // Pick random even row for wall
      const wallRow = Math.floor(Math.random() * (height - 2)) + rStart + 1;
      // Pick random passage column
      const passageCol = Math.floor(Math.random() * (width - 1)) + cStart;

      for (let c = cStart; c <= cEnd; c++) {
        if (c !== passageCol) {
          newGrid = toggleWall(newGrid, wallRow, c, true);
        }
      }

      divide(rStart, wallRow - 1, cStart, cEnd);
      divide(wallRow + 1, rEnd, cStart, cEnd);
    } else {
      // Pick random even col for wall
      const wallCol = Math.floor(Math.random() * (width - 2)) + cStart + 1;
      // Pick random passage row
      const passageRow = Math.floor(Math.random() * (height - 1)) + rStart;

      for (let r = rStart; r <= rEnd; r++) {
        if (r !== passageRow) {
          newGrid = toggleWall(newGrid, r, wallCol, true);
        }
      }

      divide(rStart, rEnd, cStart, wallCol - 1);
      divide(rStart, rEnd, wallCol + 1, cEnd);
    }
  }

  divide(1, rows - 2, 1, cols - 2);

  // Guarantee start and goal (and immediate neighbors) are clear
  newGrid = toggleWall(newGrid, start.row, start.col, false);
  newGrid = toggleWall(newGrid, goal.row, goal.col, false);

  return newGrid;
}

/**
 * Spiral Labyrinth Generator
 */
export function generateSpiralMaze(
  grid: Grid,
  start: GridCoordinates,
  goal: GridCoordinates
): Grid {
  let newGrid = cloneGrid(grid, false);
  const rows = newGrid.length;
  const cols = rows > 0 ? newGrid[0].length : 0;

  let top = 1;
  let bottom = rows - 2;
  let left = 1;
  let right = cols - 2;

  while (top <= bottom && left <= right) {
    // Top wall with gap at right
    for (let c = left; c <= right; c++) {
      if (c !== right) newGrid = toggleWall(newGrid, top, c, true);
    }
    top += 2;

    // Right wall with gap at bottom
    for (let r = top - 1; r <= bottom; r++) {
      if (r !== bottom) newGrid = toggleWall(newGrid, r, right, true);
    }
    right -= 2;

    // Bottom wall with gap at left
    if (top <= bottom) {
      for (let c = right + 1; c >= left; c--) {
        if (c !== left) newGrid = toggleWall(newGrid, bottom, c, true);
      }
      bottom -= 2;
    }

    // Left wall with gap at top
    if (left <= right) {
      for (let r = bottom + 1; r >= top; r--) {
        if (r !== top) newGrid = toggleWall(newGrid, r, left, true);
      }
      left += 2;
    }
  }

  newGrid = toggleWall(newGrid, start.row, start.col, false);
  newGrid = toggleWall(newGrid, goal.row, goal.col, false);

  return newGrid;
}
