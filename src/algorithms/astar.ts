import {
  Grid,
  GridCoordinates,
  AlgorithmResult,
  StepEvent,
  HeuristicType,
} from '../types';
import { MinPriorityQueue } from './priorityQueue';
import { getHeuristic } from './heuristics';

// 4-directional orthogonal neighbors (up, right, down, left)
const DIRECTIONS: readonly [number, number][] = [
  [-1, 0], // Up
  [0, 1],  // Right
  [1, 0],  // Down
  [0, -1], // Left
];

const coordKey = (r: number, c: number): string => `${r},${c}`;

/**
 * Pure A* Search Algorithm
 * Evaluation function: f(n) = g(n) + h(n)
 *
 * @param grid 2D matrix of GridNode
 * @param start Coordinates of the start cell
 * @param goal Coordinates of the goal cell
 * @param heuristicType 'manhattan' (default) or 'euclidean'
 * @returns Complete AlgorithmResult with deterministic StepEvent[] timeline
 */
export function runAStar(
  grid: Grid,
  start: GridCoordinates,
  goal: GridCoordinates,
  heuristicType: HeuristicType = 'manhattan'
): AlgorithmResult {
  const startTime = performance.now();
  const rows = grid.length;
  const cols = rows > 0 ? grid[0].length : 0;

  const heuristic = getHeuristic(heuristicType);
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
      algorithm: 'astar',
      heuristic: heuristicType,
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
      algorithm: 'astar',
      heuristic: heuristicType,
    };
  }

  // Edge case: start node is already goal node
  if (start.row === goal.row && start.col === goal.col) {
    const singlePath = [{ row: start.row, col: start.col }];
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
      path: singlePath,
      stepEvents,
      visitedCount: 1,
      pathLength: 0,
      found: true,
      executionTimeMs: performance.now() - startTime,
      algorithm: 'astar',
      heuristic: heuristicType,
    };
  }

  // Priority Queue: min-heap comparing f(n). Secondary tie-breaker: lower h(n).
  const openQueue = new MinPriorityQueue<GridCoordinates>();
  const gScores = new Map<string, number>();
  const fScores = new Map<string, number>();
  const closedSet = new Set<string>();
  const parentMap = new Map<string, GridCoordinates>();

  const startKey = coordKey(start.row, start.col);
  const initialH = heuristic(start, goal);

  gScores.set(startKey, 0);
  fScores.set(startKey, initialH);

  // Enqueue start node: primary priority = f, secondary priority = h
  openQueue.enqueue(start, initialH, initialH);

  stepEvents.push({
    row: start.row,
    col: start.col,
    action: 'open',
    f: initialH,
    g: 0,
    h: initialH,
    stepIndex: stepCounter++,
  });

  let found = false;
  let visitedCount = 0;

  while (!openQueue.isEmpty()) {
    const current = openQueue.dequeue()!;
    const currentKey = coordKey(current.row, current.col);

    // Skip if already evaluated in closed set
    if (closedSet.has(currentKey)) {
      continue;
    }

    closedSet.add(currentKey);
    visitedCount++;

    const currentG = gScores.get(currentKey) ?? Infinity;
    const currentH = heuristic(current, goal);
    const currentF = currentG + currentH;

    // Record node closed event (unless start/goal)
    stepEvents.push({
      row: current.row,
      col: current.col,
      action: 'closed',
      f: currentF,
      g: currentG,
      h: currentH,
      stepIndex: stepCounter++,
    });

    // Check if goal reached
    if (current.row === goal.row && current.col === goal.col) {
      found = true;
      break;
    }

    // Inspect orthogonal neighbors
    for (const [dRow, dCol] of DIRECTIONS) {
      const nRow = current.row + dRow;
      const nCol = current.col + dCol;

      // Bounds check
      if (nRow < 0 || nRow >= rows || nCol < 0 || nCol >= cols) {
        continue;
      }

      // Wall check
      if (grid[nRow][nCol].isWall) {
        continue;
      }

      const neighborKey = coordKey(nRow, nCol);

      // Already finalized in closed set
      if (closedSet.has(neighborKey)) {
        continue;
      }

      // Unit movement cost is 1
      const tentativeG = currentG + 1;
      const prevNeighborG = gScores.get(neighborKey) ?? Infinity;

      if (tentativeG < prevNeighborG) {
        // Discovered a superior path to neighbor
        parentMap.set(neighborKey, current);
        gScores.set(neighborKey, tentativeG);

        const h = heuristic({ row: nRow, col: nCol }, goal);
        const f = tentativeG + h;
        fScores.set(neighborKey, f);

        openQueue.enqueue({ row: nRow, col: nCol }, f, h);

        stepEvents.push({
          row: nRow,
          col: nCol,
          action: 'open',
          f,
          g: tentativeG,
          h,
          stepIndex: stepCounter++,
        });
      }
    }
  }

  // Reconstruct path if found
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

    // Record path steps in forward sequence for smooth playback
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
  // Path length in moves = path.length - 1 (or 0 if start === goal)
  const pathLength = path.length > 0 ? path.length - 1 : 0;

  return {
    path,
    stepEvents,
    visitedCount,
    pathLength,
    found,
    executionTimeMs,
    algorithm: 'astar',
    heuristic: heuristicType,
  };
}
