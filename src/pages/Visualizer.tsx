import React, { useState, useEffect, useCallback } from 'react';
import {
  Compass,
  Footprints,
  Eye,
  Clock,
  Layers,
  AlertCircle,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import { AlgorithmType, HeuristicType, AlgorithmResult } from '../types';
import { runAlgorithm } from '../algorithms';
import { HEURISTIC_DETAILS } from '../algorithms/heuristics';
import { useGrid } from '../hooks/useGrid';
import { usePlayback } from '../hooks/usePlayback';
import { Grid } from '../components/Grid';
import { Controls } from '../components/Controls';
import { Legend } from '../components/Legend';
import { StatCard } from '../components/StatCard';
import { MazeControls } from '../components/MazeControls';

export const Visualizer: React.FC = () => {
  // Grid management hook
  const {
    rows,
    cols,
    start,
    goal,
    grid,
    setGrid,
    activeTool,
    setActiveTool,
    gridVersion,
    savedGrids,
    resizeGrid,
    clearWalls,
    resetVisualizationState,
    handleCellMouseDown,
    handleCellMouseEnter,
    handleMouseUp,
    handleTouchMove,
    applyRandomObstacles,
    applyRecursiveDivision,
    applySpiral,
    applyPreset,
    saveCurrentGrid,
    loadSavedGrid,
    deleteSavedGrid,
  } = useGrid(18, 32);

  // Algorithm & Heuristic settings
  const [algorithm, setAlgorithm] = useState<AlgorithmType>('astar');
  const [heuristic, setHeuristic] = useState<HeuristicType>('manhattan');
  const [showScores, setShowScores] = useState(false);

  // Computed Algorithm Result
  const [algorithmResult, setAlgorithmResult] = useState<AlgorithmResult | null>(null);

  // Playback Hook for deterministic step-by-step animation
  const {
    playbackState,
    currentStepIndex,
    totalSteps,
    speedMs,
    setSpeedMs,
    currentExploredCount,
    currentOpenCount,
    play,
    pause,
    stepForward,
    stepBackward,
    jumpToStep,
    resetPlayback,
  } = usePlayback(algorithmResult, setGrid);

  // Invalidate algorithm result whenever the grid is edited
  useEffect(() => {
    setAlgorithmResult(null);
    resetPlayback();
  }, [gridVersion, resetPlayback]);

  // Execute Algorithm and trigger playback
  const handleVisualize = useCallback(() => {
    // 1. Reset any existing visual markings on the grid
    resetVisualizationState();

    // 2. Execute pure algorithm function
    const result = runAlgorithm(algorithm, grid, start, goal, heuristic);
    setAlgorithmResult(result);

    // 3. Begin playback automatically
    // Use requestAnimationFrame so state updates propagate before playing
    requestAnimationFrame(() => {
      // Play will run the timeline
    });
  }, [algorithm, grid, start, goal, heuristic, resetVisualizationState]);

  // Once algorithmResult changes, start playing automatically
  useEffect(() => {
    if (algorithmResult && algorithmResult.stepEvents.length > 0) {
      play();
    }
  }, [algorithmResult, play]);

  // Demonstration mode
  const handleRunDemo = useCallback(() => {
    applyPreset('zigzag');
    setAlgorithm('astar');
    setHeuristic('manhattan');
    setSpeedMs(25);

    // Give grid state a tick to apply preset then run
    setTimeout(() => {
      handleVisualize();
    }, 150);
  }, [applyPreset, handleVisualize, setSpeedMs]);

  const activeHeuristicInfo = HEURISTIC_DETAILS[heuristic];

  // Count active walls
  let wallCount = 0;
  grid.forEach((r) =>
    r.forEach((node) => {
      if (node.isWall) wallCount++;
    })
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {/* Top Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2.5">
            <Compass className="w-6 h-6 text-cyan-500 animate-spin-slow" />
            Pathfinding Visualizer
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Draw obstacles, reposition Start <span className="text-emerald-400 font-bold">▲</span> and
            Goal <span className="text-rose-400 font-bold">●</span>, and observe search exploration in
            real-time.
          </p>
        </div>

        {/* Algorithm Badge */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
            <Sliders className="w-3.5 h-3.5" />
            <span>
              {algorithm === 'astar'
                ? `A* Search (${activeHeuristicInfo.name})`
                : algorithm === 'dijkstra'
                ? 'Dijkstra (Uniform Cost)'
                : 'BFS (Breadth-First)'}
            </span>
          </div>
        </div>
      </div>

      {/* Heuristic Academic Note Alert (for Viva & Understanding) */}
      {algorithm === 'astar' && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/25 text-xs text-cyan-800 dark:text-cyan-200">
          <HelpCircle className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-bold">Heuristic Optimality Principle: </span>
            <span>
              {heuristic === 'manhattan'
                ? 'Manhattan distance (|Δx| + |Δy|) is admissible and monotonic for 4-directional grids, guaranteeing the optimal shortest path.'
                : 'Euclidean distance (straight line) is admissible on 4-way grids but less informed (Euclidean ≤ Manhattan), expanding more frontier nodes.'}
            </span>
          </div>
        </div>
      )}

      {/* Primary Control Deck */}
      <Controls
        algorithm={algorithm}
        heuristic={heuristic}
        onChangeAlgorithm={setAlgorithm}
        onChangeHeuristic={setHeuristic}
        playbackState={playbackState}
        currentStepIndex={currentStepIndex}
        totalSteps={totalSteps}
        speedMs={speedMs}
        onChangeSpeed={setSpeedMs}
        onPlay={play}
        onPause={pause}
        onStepForward={stepForward}
        onStepBackward={stepBackward}
        onJumpToStep={jumpToStep}
        onResetPlayback={resetPlayback}
        onClearWalls={clearWalls}
        onVisualize={handleVisualize}
        showScores={showScores}
        onToggleScores={() => setShowScores((prev) => !prev)}
        hasResult={algorithmResult !== null}
      />

      {/* Maze Toolbar & Saved Grids Drawer */}
      <MazeControls
        onGenerateRandom={() => applyRandomObstacles(0.28)}
        onGenerateRecursive={applyRecursiveDivision}
        onGenerateSpiral={applySpiral}
        onApplyPreset={applyPreset}
        onRunDemo={handleRunDemo}
        savedGrids={savedGrids}
        onSaveGrid={saveCurrentGrid}
        onLoadGrid={loadSavedGrid}
        onDeleteGrid={deleteSavedGrid}
        rows={rows}
        cols={cols}
        onChangeGridSize={resizeGrid}
      />

      {/* Live Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <StatCard
          label="Path Status"
          value={
            algorithmResult === null
              ? 'Ready'
              : algorithmResult.found
              ? 'Found'
              : 'No Path'
          }
          subValue={
            algorithmResult?.found
              ? `${algorithmResult.pathLength} steps to goal`
              : 'Destination unreachable'
          }
          icon={Compass}
          colorClass={
            algorithmResult?.found
              ? 'text-emerald-400'
              : algorithmResult
              ? 'text-rose-400'
              : 'text-cyan-400'
          }
          badge={algorithmResult?.found ? 'Optimal' : undefined}
        />

        <StatCard
          label="Explored (Closed)"
          value={algorithmResult ? currentExploredCount : 0}
          subValue={`of ${rows * cols - wallCount} traversable`}
          icon={Layers}
          colorClass="text-indigo-400"
        />

        <StatCard
          label="Frontier (Open Set)"
          value={algorithmResult ? currentOpenCount : 0}
          subValue="Active boundary nodes"
          icon={Eye}
          colorClass="text-cyan-400"
        />

        <StatCard
          label="Shortest Path Length"
          value={algorithmResult?.found ? `${algorithmResult.pathLength} moves` : '—'}
          subValue={`Start (${start.row},${start.col}) → (${goal.row},${goal.col})`}
          icon={Footprints}
          colorClass="text-amber-400"
        />

        <StatCard
          label="Execution Time"
          value={
            algorithmResult
              ? `${algorithmResult.executionTimeMs.toFixed(2)} ms`
              : '—'
          }
          subValue={`${wallCount} walls (${Math.round((wallCount / (rows * cols)) * 100)}% density)`}
          icon={Clock}
          colorClass="text-emerald-400"
        />
      </div>

      {/* Unreachable Goal Alert Banner */}
      {algorithmResult && !algorithmResult.found && (
        <div className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          <span>
            <strong>No path found!</strong> The goal destination is completely blocked by wall obstacles. Clear walls or move the goal to find a path.
          </span>
        </div>
      )}

      {/* Main Interactive Grid Canvas */}
      <Grid
        grid={grid}
        onCellMouseDown={handleCellMouseDown}
        onCellMouseEnter={handleCellMouseEnter}
        onMouseUp={handleMouseUp}
        onTouchMove={handleTouchMove}
        showScores={showScores}
      />

      {/* Interactive Color Legend */}
      <Legend activeTool={activeTool} onSelectTool={setActiveTool} />
    </div>
  );
};
