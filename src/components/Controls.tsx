import React from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  StepForward,
  StepBack,
  Trash2,
  FastForward,
  Compass,
} from 'lucide-react';
import { AlgorithmType, HeuristicType, PlaybackState } from '../types';

interface ControlsProps {
  algorithm: AlgorithmType;
  heuristic: HeuristicType;
  onChangeAlgorithm: (algo: AlgorithmType) => void;
  onChangeHeuristic: (heuristic: HeuristicType) => void;
  playbackState: PlaybackState;
  currentStepIndex: number;
  totalSteps: number;
  speedMs: number;
  onChangeSpeed: (ms: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onJumpToStep: (step: number) => void;
  onResetPlayback: () => void;
  onClearWalls: () => void;
  onVisualize: () => void;
  showScores: boolean;
  onToggleScores: () => void;
  hasResult: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  algorithm,
  heuristic,
  onChangeAlgorithm,
  onChangeHeuristic,
  playbackState,
  currentStepIndex,
  totalSteps,
  speedMs,
  onChangeSpeed,
  onPlay,
  onPause,
  onStepForward,
  onStepBackward,
  onJumpToStep,
  onResetPlayback,
  onClearWalls,
  onVisualize,
  showScores,
  onToggleScores,
  hasResult,
}) => {
  const isPlaying = playbackState === 'playing';

  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl space-y-4">
      {/* Top Bar: Algorithm, Heuristic, and Primary Action */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Left: Algorithm & Heuristic Pickers */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Algorithm Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-900 p-1 rounded-xl border border-slate-200 dark:border-white/5">
            {(['astar', 'dijkstra', 'bfs'] as AlgorithmType[]).map((algo) => (
              <button
                key={algo}
                onClick={() => onChangeAlgorithm(algo)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  algorithm === algo
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-md shadow-cyan-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {algo === 'astar' ? 'A* Search' : algo === 'dijkstra' ? 'Dijkstra' : 'BFS'}
              </button>
            ))}
          </div>

          {/* Heuristic Selector (Only when A* selected) */}
          {algorithm === 'astar' && (
            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-navy-900 p-1 rounded-xl border border-slate-200 dark:border-white/5">
              {(['manhattan', 'euclidean'] as HeuristicType[]).map((h) => (
                <button
                  key={h}
                  onClick={() => onChangeHeuristic(h)}
                  className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    heuristic === h
                      ? 'bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border border-cyan-500/40 font-semibold'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                  title={h === 'manhattan' ? 'Standard for 4-directional grids' : 'Admissible straight-line'}
                >
                  {h === 'manhattan' ? 'Manhattan' : 'Euclidean'}
                </button>
              ))}
            </div>
          )}

          {/* Scores inspection toggle */}
          <button
            onClick={onToggleScores}
            className={`px-2.5 py-1.5 text-xs rounded-xl border transition-all ${
              showScores
                ? 'bg-amber-500/20 text-amber-600 dark:text-amber-300 border-amber-500/40 font-semibold'
                : 'bg-slate-100 dark:bg-navy-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:text-slate-200'
            }`}
            title="Display f, g, h calculation scores on explored cells"
          >
            f/g/h Scores
          </button>
        </div>

        {/* Right: Visualize Primary Trigger */}
        <div className="flex items-center gap-2">
          <button
            onClick={onVisualize}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 active:scale-95 transition-all"
          >
            <Compass className="w-4 h-4 animate-spin-slow" />
            <span>{hasResult ? 'Re-Compute Path' : 'Run Algorithm'}</span>
          </button>

          <button
            onClick={onClearWalls}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-navy-900 hover:bg-rose-500/10 hover:text-rose-500 border border-slate-200 dark:border-white/5 transition-all"
            title="Clear all walls while keeping start and goal"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear Walls</span>
          </button>
        </div>
      </div>

      {/* Playback Controls & Timeline (Active once algorithm is run) */}
      <div className="pt-3 border-t border-slate-200/60 dark:border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Step Navigation Controls */}
        <div className="flex items-center gap-1.5">
          {/* Play/Pause */}
          <button
            onClick={isPlaying ? onPause : onPlay}
            disabled={!hasResult}
            className={`flex items-center justify-center w-10 h-10 rounded-xl transition-all ${
              !hasResult
                ? 'opacity-40 cursor-not-allowed bg-slate-200 dark:bg-white/5 text-slate-400'
                : isPlaying
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                : 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20 hover:bg-emerald-400'
            }`}
            title={isPlaying ? 'Pause playback' : 'Play animation'}
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
          </button>

          {/* Step Backward */}
          <button
            onClick={onStepBackward}
            disabled={!hasResult || currentStepIndex <= 0 || isPlaying}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-white/5 transition-all"
            title="Step Backward (exact replay)"
          >
            <StepBack className="w-4 h-4" />
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={!hasResult || currentStepIndex >= totalSteps || isPlaying}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-white/5 transition-all"
            title="Step Forward"
          >
            <StepForward className="w-4 h-4" />
          </button>

          {/* Reset Timeline */}
          <button
            onClick={onResetPlayback}
            disabled={!hasResult || currentStepIndex === 0}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 dark:border-white/5 transition-all"
            title="Rewind Timeline to Step 0"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 max-w-md flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={totalSteps || 1}
            value={currentStepIndex}
            onChange={(e) => onJumpToStep(parseInt(e.target.value, 10))}
            disabled={!hasResult || totalSteps === 0}
            className="w-full h-1.5 bg-slate-200 dark:bg-navy-950 rounded-lg appearance-none cursor-pointer accent-cyan-500 disabled:opacity-40"
          />
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap min-w-[70px] text-right">
            {currentStepIndex} / {totalSteps}
          </span>
        </div>

        {/* Speed Adjustment Controls */}
        <div className="flex items-center gap-2">
          <FastForward className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center gap-1 text-xs">
            {[
              { label: 'Slow', ms: 75 },
              { label: 'Normal', ms: 25 },
              { label: 'Fast', ms: 8 },
            ].map((spd) => (
              <button
                key={spd.label}
                onClick={() => onChangeSpeed(spd.ms)}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-all ${
                  speedMs === spd.ms
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40'
                    : 'bg-slate-100 dark:bg-navy-900 text-slate-500 hover:text-slate-200'
                }`}
              >
                {spd.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
