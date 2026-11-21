import { AlgorithmResult } from '../types';

export interface BenchmarkRecord {
  algorithm: string;
  heuristic?: string;
  found: boolean;
  pathLength: number;
  visitedCount: number;
  executionTimeMs: number;
  gridRows: number;
  gridCols: number;
  wallCount: number;
  wallDensityPercent: number;
  timestamp: string;
}

/**
 * Converts benchmark results into CSV formatted string and triggers browser download.
 */
export function exportResultsToCSV(
  results: AlgorithmResult[],
  rows: number,
  cols: number,
  wallCount: number,
  filename: string = 'pathfinding-algorithm-comparison.csv'
): void {
  const wallDensity = ((wallCount / (rows * cols)) * 100).toFixed(1);
  const now = new Date().toISOString();

  const headers = [
    'Algorithm',
    'Heuristic',
    'Path Found',
    'Path Length (Steps)',
    'Explored Nodes',
    'Execution Time (ms)',
    'Grid Dimensions',
    'Obstacle Count',
    'Obstacle Density (%)',
    'Timestamp',
  ];

  const rowsData = results.map((res) => {
    const algoName =
      res.algorithm === 'astar'
        ? 'A* Search'
        : res.algorithm === 'dijkstra'
        ? "Dijkstra's Algorithm"
        : 'Breadth-First Search (BFS)';

    const heuristicName = res.heuristic ? res.heuristic.toUpperCase() : 'N/A';

    return [
      `"${algoName}"`,
      `"${heuristicName}"`,
      res.found ? 'Yes' : 'No',
      res.found ? res.pathLength : 0,
      res.visitedCount,
      res.executionTimeMs.toFixed(3),
      `"${rows}x${cols}"`,
      wallCount,
      `${wallDensity}%`,
      `"${now}"`,
    ];
  });

  const csvContent = [headers.join(','), ...rowsData.map((r) => r.join(','))].join('\r\n');

  // Trigger file download via Blob URL
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
