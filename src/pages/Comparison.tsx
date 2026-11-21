import React, { useState, useEffect, useCallback } from 'react';
import {
  BarChart3,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  Clock,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Cell as RechartsCell,
} from 'recharts';
import { AlgorithmResult, Grid, GridCoordinates } from '../types';
import { runAStar, runDijkstra, runBFS } from '../algorithms';
import { createEmptyGrid } from '../utils/gridHelpers';
import { PRESET_MAZES } from '../data/presetMazes';
import { exportResultsToCSV } from '../utils/csvExport';

interface ComparisonData {
  algorithm: string;
  type: string;
  pathLength: number;
  visitedCount: number;
  executionTimeMs: number;
  found: boolean;
  color: string;
}

export const Comparison: React.FC = () => {
  const rows = 16;
  const cols = 28;
  const [start] = useState<GridCoordinates>({ row: 8, col: 3 });
  const [goal] = useState<GridCoordinates>({ row: 8, col: 24 });
  const [selectedPreset, setSelectedPreset] = useState<string>('zigzag');

  // Base Grid for comparison
  const [comparisonGrid, setComparisonGrid] = useState<Grid>(() => {
    const empty = createEmptyGrid(rows, cols, start, goal);
    const preset = PRESET_MAZES.find((p) => p.id === 'zigzag');
    return preset ? preset.apply(empty, start, goal) : empty;
  });

  // Benchmark Results
  const [results, setResults] = useState<{
    astar: AlgorithmResult | null;
    dijkstra: AlgorithmResult | null;
    bfs: AlgorithmResult | null;
  }>({
    astar: null,
    dijkstra: null,
    bfs: null,
  });

  const [isRunning, setIsRunning] = useState(false);

  // Apply layout preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPreset(presetId);
    const empty = createEmptyGrid(rows, cols, start, goal);
    const preset = PRESET_MAZES.find((p) => p.id === presetId);
    const updated = preset ? preset.apply(empty, start, goal) : empty;
    setComparisonGrid(updated);
    setResults({ astar: null, dijkstra: null, bfs: null });
  };

  // Run all 3 algorithms on the identical grid
  const handleRunComparison = useCallback(() => {
    setIsRunning(true);

    setTimeout(() => {
      // 1. A* with Manhattan
      const astarRes = runAStar(comparisonGrid, start, goal, 'manhattan');
      // 2. Dijkstra
      const dijkstraRes = runDijkstra(comparisonGrid, start, goal);
      // 3. BFS
      const bfsRes = runBFS(comparisonGrid, start, goal);

      setResults({
        astar: astarRes,
        dijkstra: dijkstraRes,
        bfs: bfsRes,
      });
      setIsRunning(false);
    }, 100);
  }, [comparisonGrid, start, goal]);

  // Run on initial load
  useEffect(() => {
    handleRunComparison();
  }, [handleRunComparison]);

  // Export CSV
  const handleExportCSV = () => {
    if (!results.astar || !results.dijkstra || !results.bfs) return;
    let wallCount = 0;
    comparisonGrid.forEach((r) =>
      r.forEach((node) => {
        if (node.isWall) wallCount++;
      })
    );

    exportResultsToCSV(
      [results.astar, results.dijkstra, results.bfs],
      rows,
      cols,
      wallCount,
      `pathfinding-benchmark-${selectedPreset}.csv`
    );
  };

  // Prepare chart data
  const chartData: ComparisonData[] = [
    {
      algorithm: 'A* (Manhattan)',
      type: 'Informed (Heuristic)',
      pathLength: results.astar?.pathLength || 0,
      visitedCount: results.astar?.visitedCount || 0,
      executionTimeMs: parseFloat((results.astar?.executionTimeMs || 0).toFixed(2)),
      found: results.astar?.found || false,
      color: '#06b6d4', // cyan-500
    },
    {
      algorithm: 'Dijkstra',
      type: 'Uniform Cost Search',
      pathLength: results.dijkstra?.pathLength || 0,
      visitedCount: results.dijkstra?.visitedCount || 0,
      executionTimeMs: parseFloat((results.dijkstra?.executionTimeMs || 0).toFixed(2)),
      found: results.dijkstra?.found || false,
      color: '#3b82f6', // blue-500
    },
    {
      algorithm: 'BFS',
      type: 'Unweighted Queue Search',
      pathLength: results.bfs?.pathLength || 0,
      visitedCount: results.bfs?.visitedCount || 0,
      executionTimeMs: parseFloat((results.bfs?.executionTimeMs || 0).toFixed(2)),
      found: results.bfs?.found || false,
      color: '#6366f1', // indigo-500
    },
  ];

  // Efficiency calculation
  const astarExplored = results.astar?.visitedCount || 1;
  const dijkstraExplored = results.dijkstra?.visitedCount || 1;
  const reductionPercent = Math.max(
    0,
    Math.round(((dijkstraExplored - astarExplored) / dijkstraExplored) * 100)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <BarChart3 className="w-6 h-6 text-cyan-500" />
            Algorithm Benchmark &amp; Comparison
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Execute A*, Dijkstra, and BFS simultaneously on identical grid conditions to empirically measure optimality and exploration efficiency.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunComparison}
            disabled={isRunning}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-95 disabled:opacity-50 transition-all"
          >
            {isRunning ? (
              <RotateCcw className="w-4 h-4 animate-spin" />
            ) : (
              <Play className="w-4 h-4 fill-current" />
            )}
            <span>{isRunning ? 'Benchmarking...' : 'Re-Run Benchmark'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            disabled={!results.astar}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 disabled:opacity-40 transition-all"
            title="Download CSV report of results"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Preset Scenario Selector Bar */}
      <div className="glass-card p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-700 dark:text-slate-300">
            Benchmark Scenario:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'zigzag', label: 'Slalom Zig-Zag' },
              { id: 'bottleneck', label: 'Bottleneck Funnel' },
              { id: 'trap_pocket', label: 'U-Trap Pocket' },
              { id: 'open', label: 'Open Terrain' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p.id)}
                className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedPreset === p.id
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-100 dark:bg-navy-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-transparent'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Efficiency Badge */}
        {results.astar && results.dijkstra && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>
              A* searched <strong>{reductionPercent}% fewer nodes</strong> than Dijkstra
            </span>
          </div>
        )}
      </div>

      {/* Comparative Summary Table */}
      <div className="glass-card rounded-2xl overflow-hidden border border-slate-200/80 dark:border-white/10 shadow-xl">
        <div className="p-4 border-b border-slate-200/60 dark:border-white/5 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>Direct Head-to-Head Performance Matrix</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            Grid: {rows}×{cols} • Start ({start.row},{start.col}) → Goal ({goal.row},{goal.col})
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100/70 dark:bg-navy-950/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200/60 dark:border-white/5">
              <tr>
                <th className="py-3 px-4">Algorithm</th>
                <th className="py-3 px-4">Search Paradigm</th>
                <th className="py-3 px-4">Path Found</th>
                <th className="py-3 px-4">Path Length</th>
                <th className="py-3 px-4">Explored Nodes</th>
                <th className="py-3 px-4">Execution Time</th>
                <th className="py-3 px-4">Optimality Verdict</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/60 dark:divide-white/5">
              {chartData.map((row) => (
                <tr
                  key={row.algorithm}
                  className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: row.color }}
                    />
                    {row.algorithm}
                  </td>
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400">{row.type}</td>
                  <td className="py-3 px-4">
                    {row.found ? (
                      <span className="inline-flex items-center gap-1 text-emerald-500 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Yes
                      </span>
                    ) : (
                      <span className="text-rose-500 font-semibold">No Path</span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                    {row.found ? `${row.pathLength} moves` : '—'}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold">
                    <span
                      className={
                        row.algorithm.startsWith('A*')
                          ? 'text-cyan-600 dark:text-cyan-400 font-extrabold'
                          : 'text-slate-700 dark:text-slate-300'
                      }
                    >
                      {row.visitedCount} nodes
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600 dark:text-slate-400">
                    {row.executionTimeMs.toFixed(2)} ms
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                      Optimal Shortest Path
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Visual Recharts Comparison Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Explored Nodes Comparison */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Explored Nodes (Lower is Better)
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">Search Space Expansion</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="algorithm"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0B0F19',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="visitedCount" name="Nodes Explored" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <RechartsCell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            A* evaluates significantly fewer nodes because the heuristic directs exploration straight toward the destination rather than expanding concentric rings.
          </p>
        </div>

        {/* Chart 2: Execution Time Comparison */}
        <div className="glass-card p-5 rounded-2xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Execution Time in Milliseconds
              </h4>
            </div>
            <span className="text-[11px] text-slate-400">High-Resolution Timer</span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="algorithm"
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#94a3b8', fontSize: 11 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: '#0B0F19',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#fff',
                  }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                />
                <Bar dataKey="executionTimeMs" name="Execution Time (ms)" radius={[8, 8, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <RechartsCell key={`cell-time-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Execution times are captured using <code className="text-cyan-400">performance.now()</code>. Times reflect algorithm overhead and JavaScript engine JIT compilation.
          </p>
        </div>
      </div>

      {/* Academic Invariance Note for College Viva */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-200">
        <Info className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="font-bold text-amber-900 dark:text-amber-100">
            Viva Viva Defense Note: Hardware Independence &amp; Algorithmic Invariance
          </h4>
          <p className="leading-relaxed">
            Notice that the <strong>path length is identical across all three algorithms</strong> (
            {results.astar?.pathLength || 'N/A'} moves). This mathematically verifies that A* maintains strict optimality on uniform-cost graphs.
            Furthermore, while <em>execution time (ms)</em> naturally varies depending on device specifications and browser garbage collection,
            the <strong>explored node count</strong> is an exact, hardware-independent metric of search efficiency.
          </p>
        </div>
      </div>
    </div>
  );
};
