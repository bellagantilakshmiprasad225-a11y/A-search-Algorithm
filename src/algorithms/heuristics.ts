import { GridCoordinates, HeuristicType } from '../types';

/**
 * Manhattan Distance (L1 Norm / Taxicab Distance)
 * Formula: |row1 - row2| + |col1 - col2|
 *
 * Properties for 4-directional grid movement with unit cost:
 * - Admissible: Never overestimates the true cost to the goal (h(n) <= h*(n)).
 * - Consistent (Monotonic): Satisfies triangle inequality h(n) <= c(n, a, n') + h(n').
 * - Guaranteed to find the optimal shortest path.
 */
export function manhattanDistance(a: GridCoordinates, b: GridCoordinates): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

/**
 * Euclidean Distance (L2 Norm / Straight-line Distance)
 * Formula: sqrt((row1 - row2)^2 + (col1 - col2)^2)
 *
 * Properties for 4-directional grid movement:
 * - Admissible: The straight line is always <= the true 4-directional path cost.
 * - Under-estimates more than Manhattan on a 4-directional grid because diagonal
 *   motion is not permitted in 4-way grids, causing A* to expand more nodes than Manhattan.
 */
export function euclideanDistance(a: GridCoordinates, b: GridCoordinates): number {
  const dRow = a.row - b.row;
  const dCol = a.col - b.col;
  return Math.sqrt(dRow * dRow + dCol * dCol);
}

/**
 * Returns the appropriate heuristic function given a HeuristicType.
 */
export function getHeuristic(type: HeuristicType = 'manhattan'): (a: GridCoordinates, b: GridCoordinates) => number {
  switch (type) {
    case 'euclidean':
      return euclideanDistance;
    case 'manhattan':
    default:
      return manhattanDistance;
  }
}

export interface HeuristicInfo {
  id: HeuristicType;
  name: string;
  formula: string;
  admissible: boolean;
  consistent: boolean;
  recommendedFor: string;
  explanation: string;
}

export const HEURISTIC_DETAILS: Record<HeuristicType, HeuristicInfo> = {
  manhattan: {
    id: 'manhattan',
    name: 'Manhattan Distance',
    formula: '|x1 - x2| + |y1 - y2|',
    admissible: true,
    consistent: true,
    recommendedFor: '4-directional orthogonal movement (Default)',
    explanation:
      'Standard for 4-directional grid navigation. Because agents can only move up, down, left, or right, the shortest obstacle-free distance is the taxicab distance. It matches the movement rules perfectly and guarantees optimal pathfinding.',
  },
  euclidean: {
    id: 'euclidean',
    name: 'Euclidean Distance',
    formula: '√((x1 - x2)² + (y1 - y2)²)',
    admissible: true,
    consistent: true,
    recommendedFor: 'Any-angle movement or 8-directional movement',
    explanation:
      'Calculates Euclidean straight-line distance. While mathematically admissible on a 4-directional grid (since Euclidean ≤ Manhattan), it is less informed and underestimates actual movement costs, leading to more node expansions.',
  },
};
