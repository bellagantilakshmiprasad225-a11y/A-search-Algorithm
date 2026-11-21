export type NodeType = 'empty' | 'wall' | 'start' | 'goal';

export type NodeState = 'unvisited' | 'open' | 'closed' | 'path';

export interface GridCoordinates {
  row: number;
  col: number;
}

export interface GridNode {
  row: number;
  col: number;
  isStart: boolean;
  isGoal: boolean;
  isWall: boolean;
  state: NodeState;
  g: number;
  h: number;
  f: number;
  parent: GridNode | null;
}

export type Grid = GridNode[][];

export type AlgorithmType = 'astar' | 'bfs' | 'dijkstra';

export type HeuristicType = 'manhattan' | 'euclidean';

export type StepActionType = 'open' | 'closed' | 'path';

export interface StepEvent {
  row: number;
  col: number;
  action: StepActionType;
  f?: number;
  g?: number;
  h?: number;
  stepIndex: number;
}

export interface AlgorithmResult {
  path: GridCoordinates[];
  stepEvents: StepEvent[];
  visitedCount: number;
  pathLength: number;
  found: boolean;
  executionTimeMs: number;
  algorithm: AlgorithmType;
  heuristic?: HeuristicType;
}

export type PlaybackState = 'idle' | 'playing' | 'paused' | 'completed';

export interface GridSettings {
  rows: number;
  cols: number;
  speed: number; // delay in ms
  algorithm: AlgorithmType;
  heuristic: HeuristicType;
  allowDiagonal?: boolean;
}

export type PageId = 'dashboard' | 'visualizer' | 'comparison' | 'learn' | 'project-info';

export type ThemeMode = 'dark' | 'light';

export interface ToastMessage {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  description?: string;
  duration?: number;
}
