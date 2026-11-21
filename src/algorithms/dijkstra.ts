import {
  Grid,
  GridCoordinates,
  AlgorithmResult,
  StepEvent,
} from '../types';
import { MinPriorityQueue } from './priorityQueue';

const DIRECTIONS: readonly [number, number][] = [
  [-1, 0], // Up
  [0, 1],  // Right
  [1, 0],  // Down
  [0, -1], // Left
];

const coordKey = (r: number, c: number): string => `${r},${c}`;

/**
 * Pure Dijkstra's Algorithm (Uniform Cost Search)
 * Prioritizes nodes purely on g(n), the exact cost from the start node.
 * Equivalent to A* where h(n) = 0 for all nodes.
 */
export function runDijkstra(
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
      algorithm: 'dijkstra',
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
      algorithm: 'dijkstra',
    };
  }

  // Edge case: start node is goal node
  if (start.row === goal.row && start.col === goal.col) {
    stepEvents.push({
      row: start.row,
      col: start.col,
      action: 'path',
      f: 0,
      g: 0,
      h: 0,
      stepIndex: stepCounter++,
    });

    return {
      path: [{ row: start.row, col: start.col }],
      stepEvents,
      visitedCount: 1,
      pathLength: 0,
      found: true,
      executionTimeMs: performance.now() - startTime,
      algorithm: 'dijkstra',
    };
  }

  const openQueue = new MinPriorityQueue<GridCoordinates>();
  const dist = new Map<string, number>();
  const closedSet = new Set<string>();
  const parentMap = new Map<string, GridCoordinates>();

  const startKey = coordKey(start.row, start.col);
  dist.set(startKey, 0);
  openQueue.enqueue(start, 0);

  stepEvents.push({
    row: start.row,
    col: start.col,
    action: 'open',
    g: 0,
    f: 0,
    h: 0,
    stepIndex: stepCounter++,
  });

  let found = false;
  let visitedCount = 0;

  while (!openQueue.isEmpty()) {
    const current = openQueue.dequeue()!;
    const currentKey = coordKey(current.row, current.col);

    if (closedSet.has(currentKey)) {
      continue;
    }

    closedSet.add(currentKey);
    visitedCount++;

    const currentDist = dist.get(currentKey) ?? Infinity;

    stepEvents.push({
      row: current.row,
      col: current.col,
      action: 'closed',
      g: currentDist,
      f: currentDist,
      h: 0,
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

      if (closedSet.has(neighborKey)) {
        continue;
      }

      const newDist = currentDist + 1;
      const prevDist = dist.get(neighborKey) ?? Infinity;

      if (newDist < prevDist) {
        dist.set(neighborKey, newDist);
        parentMap.set(neighborKey, current);
        openQueue.enqueue({ row: nRow, col: nCol }, newDist);

        stepEvents.push({
          row: nRow,
          col: nCol,
          action: 'open',
          g: newDist,
          f: newDist,
          h: 0,
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
    algorithm: 'dijkstra',
  };
}
