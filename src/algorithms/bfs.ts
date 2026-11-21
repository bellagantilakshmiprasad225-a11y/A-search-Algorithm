import {
  Grid,
  GridCoordinates,
  AlgorithmResult,
  StepEvent,
} from '../types';

const DIRECTIONS: readonly [number, number][] = [
  [-1, 0], // Up
  [0, 1],  // Right
  [1, 0],  // Down
  [0, -1], // Left
];

const coordKey = (r: number, c: number): string => `${r},${c}`;

/**
 * Pure Breadth-First Search (BFS)
 * Unweighted FIFO queue search exploring neighbor rings uniformly.
 * On a uniform-cost grid, BFS finds the optimal shortest path in terms of step count.
 */
export function runBFS(
  grid: Grid,
  start: GridCoordinates,
  goal: GridCoordinates
): AlgorithmResult {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  const stepEvents: StepEvent[] = [];
  let stepCounter = 0;

  // Validation: empty grid or out of bounds
  if (
    rows === 0 ||
    cols === 0 ||
    start.row < 0 || start.row >= rows || start.col < 0 || start.col >= cols ||
    goal.row < 0 || goal.row >= rows || goal.col < 0 || goal.col >= cols
  ) {
    return {
      path: [],
      stepEvents: [],
      visitedCount: 0,
      pathLength: 0,
      found: false,
      executionTimeMs: performance.now() - startTime,
      algorithm: 'bfs',
    };
  }

  // Validation: start or goal is wall
  if (grid[start.row][start.col].isWall || grid[goal.row][goal.col].isWall) {
    return {
      path: [],
      stepEvents: [],
      visitedCount: 0,
      pathLength: 0,
      found: false,
      executionTimeMs: performance.now() - startTime,
      algorithm: 'bfs',
    };
  }

  // Edge case: start node is goal node
  if (start.row === goal.row && start.col === goal.col) {
    stepEvents.push({
      row: start.row,
      col: start.col,
      action: 'path',
      stepIndex: stepCounter++,
    });

    return {
      path: [{ row: start.row, col: start.col }],
      stepEvents,
      visitedCount: 1,
      pathLength: 0,
      found: true,
      executionTimeMs: performance.now() - startTime,
      algorithm: 'bfs',
    };
  }

  // Queue with pointer head for true O(1) dequeue without array shifting overhead
  const queue: GridCoordinates[] = [start];
  let head = 0;

  const visited = new Set<string>();
  const parentMap = new Map<string, GridCoordinates>();

  visited.add(coordKey(start.row, start.col));

  stepEvents.push({
    row: start.row,
    col: start.col,
    action: 'open',
    stepIndex: stepCounter++,
  });

  let found = false;
  let visitedCount = 0;

  while (head < queue.length) {
    const current = queue[head++];
    visitedCount++;

    stepEvents.push({
      row: current.row,
      col: current.col,
      action: 'closed',
      stepIndex: stepCounter++,
    });

    if (current.row === goal.row && current.col === goal.col) {
      found = true;
      break;
    }

    for (const [dRow, dCol] of DIRECTIONS) {
      const nRow = current.row + dRow;
      const nCol = current.col + dCol;

      if (nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols) {
        continue;
      }

      if (grid[nRow][nCol].isWall) {
        continue;
      }

      const neighborKey = coordKey(nRow, nCol);

      if (!visited.has(neighborKey)) {
        visited.add(neighborKey);
        parentMap.set(neighborKey, current);
        queue.push({ row: nRow, col: nCol });

        stepEvents.push({
          row: nRow,
          col: nCol,
          action: 'open',
          stepIndex: stepCounter++,
        });
      }
    }
  }

  const path: GridCoordinates[] = [];
  if (found) {
    let curr: GridCoordinates | undefined = goal;
    while (curr) {
      path.push(curr);
      if (curr.row === start.row && curr.col === start.col) {
        break;
      }
      curr = parentMap.get(coordKey(curr.row, curr.col));
    }
    path.reverse();

    for (const node of path) {
      stepEvents.push({
        row: node.row,
        col: node.col,
        action: 'path',
        stepIndex: stepCounter++,
      });
    }
  }

  const executionTimeMs = performance.now() - startTime;
  const pathLength = path.length > 0 ? path.length - 1 : 0;

  return {
    path,
    stepEvents,
    visitedCount,
    pathLength,
    found,
    executionTimeMs,
    algorithm: 'bfs',
  };
}
