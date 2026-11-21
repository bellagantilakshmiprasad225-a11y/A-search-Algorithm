import {
  Grid,
  GridCoordinates,
  AlgorithmType,
  HeuristicType,
  AlgorithmResult,
} from '../types';
import { runAStar } from './astar';
import { runDijkstra } from './dijkstra';
import { runBFS } from './bfs';

export * from './priorityQueue';
export * from './heuristics';
export * from './astar';
export * from './dijkstra';
export * from './bfs';

/**
 * Unified Algorithm Runner
 * Executes the requested algorithm with pure function semantics.
 */
export function runAlgorithm(
  algorithm: AlgorithmType,
  grid: Grid,
  start: GridCoordinates,
  goal: GridCoordinates,
  heuristic: HeuristicType = 'manhattan'
): AlgorithmResult {
  switch (algorithm) {
    case 'astar':
      return runAStar(grid, start, goal, heuristic);
    case 'dijkstra':
      return runDijkstra(grid, start, goal);
    case 'bfs':
      return runBFS(grid, start, goal);
    default:
      return runAStar(grid, start, goal, heuristic);
  }
}
