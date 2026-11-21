import React, { useState } from 'react';
import {
  Shuffle,
  Grid3X3,
  Sparkles,
  Save,
  FolderOpen,
  Trash2,
  X,
  PlayCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { SavedGridConfig } from '../hooks/useGrid';
import { PRESET_MAZES } from '../data/presetMazes';

interface MazeControlsProps {
  onGenerateRandom: () => void;
  onGenerateRecursive: () => void;
  onGenerateSpiral: () => void;
  onApplyPreset: (presetId: string) => void;
  onRunDemo: () => void;
  savedGrids: SavedGridConfig[];
  onSaveGrid: (name: string) => void;
  onLoadGrid: (config: SavedGridConfig) => void;
  onDeleteGrid: (id: string) => void;
  rows: number;
  cols: number;
  onChangeGridSize: (rows: number, cols: number) => void;
}

export const MazeControls: React.FC<MazeControlsProps> = ({
  onGenerateRandom,
  onGenerateRecursive,
  onGenerateSpiral,
  onApplyPreset,
  onRunDemo,
  savedGrids,
  onSaveGrid,
  onLoadGrid,
  onDeleteGrid,
  rows,
  cols,
  onChangeGridSize,
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showSizeModal, setShowSizeModal] = useState(false);
  const [gridName, setGridName] = useState('');

  const [inputRows, setInputRows] = useState(rows);
  const [inputCols, setInputCols] = useState(cols);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveGrid(gridName);
    setGridName('');
    setShowSaveModal(false);
  };

  const handleResize = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeGridSize(inputRows, inputCols);
    setShowSizeModal(false);
  };

  return (
    <>
      <div className="glass-card p-3 sm:p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Left: Maze & Preset Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Demo Button */}
          <button
            onClick={onRunDemo}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            title="Auto-run a preset showcase demonstrating A* end-to-end"
          >
            <PlayCircle className="w-3.5 h-3.5 fill-current" />
            <span>Sample Demo</span>
          </button>

          {/* Random Maze */}
          <button
            onClick={onGenerateRandom}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all"
            title="Generate random obstacles (28% density)"
          >
            <Shuffle className="w-3.5 h-3.5 text-cyan-500" />
            <span>Random Maze</span>
          </button>

          {/* Recursive Division Maze */}
          <button
            onClick={onGenerateRecursive}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all"
            title="Generate algorithmic recursive division corridors"
          >
            <Grid3X3 className="w-3.5 h-3.5 text-blue-500" />
            <span>Recursive Maze</span>
          </button>

          {/* Spiral Maze */}
          <button
            onClick={onGenerateSpiral}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all"
            title="Generate concentric spiral labyrinth"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Spiral Maze</span>
          </button>

          {/* Presets dropdown */}
          <select
            onChange={(e) => {
              if (e.target.value) onApplyPreset(e.target.value);
              e.target.value = '';
            }}
            defaultValue=""
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 cursor-pointer font-medium"
          >
            <option value="" disabled>
              Preset Challenges...
            </option>
            {PRESET_MAZES.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name}
              </option>
            ))}
          </select>
        </div>

        {/* Right: Grid Dimensions & LocalStorage Actions */}
        <div className="flex items-center gap-2">
          {/* Custom Grid Dimensions Trigger */}
          <button
            onClick={() => {
              setInputRows(rows);
              setInputCols(cols);
              setShowSizeModal(true);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all font-mono"
            title="Adjust grid rows and columns"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
            <span>{rows} × {cols}</span>
          </button>

          {/* Save Grid Button */}
          <button
            onClick={() => setShowSaveModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all"
            title="Save current grid layout to LocalStorage"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save</span>
          </button>

          {/* Load Grid Button */}
          <button
            onClick={() => setShowLoadModal(true)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100 dark:bg-navy-900 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all"
            title="Load saved grid layouts"
          >
            <FolderOpen className="w-3.5 h-3.5 text-amber-400" />
            <span>Saved ({savedGrids.length})</span>
          </button>
        </div>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-sm w-full bg-navy-900 border border-white/10 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Save className="w-4 h-4 text-emerald-400" />
                Save Grid Configuration
              </h3>
              <button
                onClick={() => setShowSaveModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Grid Name / Description
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. My Complex Maze 1"
                  value={gridName}
                  onChange={(e) => setGridName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-white shadow-md shadow-emerald-500/20"
                >
                  Save Locally
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-md w-full bg-navy-900 border border-white/10 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-amber-400" />
                Saved Grid Layouts ({savedGrids.length})
              </h3>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {savedGrids.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No saved grids found in LocalStorage. Draw walls and click "Save" to persist your layout.
              </p>
            ) : (
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {savedGrids.map((g) => (
                  <div
                    key={g.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-white/5 hover:border-cyan-500/30 transition-all group"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white">{g.name}</h4>
                      <p className="text-[10px] text-slate-400">
                        {g.rows}×{g.cols} • {g.walls.length} walls • {g.createdAt}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => {
                          onLoadGrid(g);
                          setShowLoadModal(false);
                        }}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500 hover:text-black transition-all"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onDeleteGrid(g.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
                        title="Delete saved grid"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowLoadModal(false)}
                className="px-4 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Resize Grid Dimensions Modal */}
      {showSizeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass-panel p-6 rounded-2xl max-w-xs w-full bg-navy-900 border border-white/10 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
                Grid Dimensions
              </h3>
              <button
                onClick={() => setShowSizeModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleResize} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Rows (8–40)
                  </label>
                  <input
                    type="number"
                    min={8}
                    max={40}
                    value={inputRows}
                    onChange={(e) => setInputRows(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Cols (12–60)
                  </label>
                  <input
                    type="number"
                    min={12}
                    max={60}
                    value={inputCols}
                    onChange={(e) => setInputCols(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  />
                </div>
              </div>

              {/* Quick Dimension Presets */}
              <div className="flex items-center gap-1.5 pt-1">
                {[
                  { label: 'Compact', r: 14, c: 24 },
                  { label: 'Standard', r: 18, c: 32 },
                  { label: 'Wide', r: 22, c: 42 },
                ].map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setInputRows(preset.r);
                      setInputCols(preset.c);
                    }}
                    className="flex-1 py-1 text-[10px] font-medium rounded-lg bg-navy-950 hover:bg-white/5 text-slate-400 hover:text-cyan-300 border border-white/5"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSizeModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20"
                >
                  Apply Size
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
