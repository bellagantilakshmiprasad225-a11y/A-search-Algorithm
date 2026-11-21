import { useState, useCallback } from 'react';
import { Grid, GridCoordinates } from '../types';
import { createEmptyGrid, cloneGrid, toggleWall } from '../utils/gridHelpers';
import {
  generateRandomMaze,
  generateRecursiveDivisionMaze,
  generateSpiralMaze,
} from '../utils/mazeGenerators';
import { PRESET_MAZES } from '../data/presetMazes';
import { useLocalStorage } from './useLocalStorage';

export type ToolMode = 'wall' | 'erase' | 'move-start' | 'move-goal';

export interface SavedGridConfig {
  id: string;
  name: string;
  createdAt: string;
  rows: number;
  cols: number;
  start: GridCoordinates;
  goal: GridCoordinates;
  walls: [number, number][]; // list of [row, col] coordinates
}

export function useGrid(initialRows: number = 18, initialCols: number = 32) {
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);

  const [start, setStart] = useState<GridCoordinates>({
    row: Math.floor(initialRows / 2),
    col: Math.max(1, Math.floor(initialCols * 0.15)),
  });

  const [goal, setGoal] = useState<GridCoordinates>({
    row: Math.floor(initialRows / 2),
    col: Math.min(initialCols - 2, Math.floor(initialCols * 0.85)),
  });

  const [grid, setGrid] = useState<Grid>(() =>
    createEmptyGrid(initialRows, initialCols, {
      row: Math.floor(initialRows / 2),
      col: Math.max(1, Math.floor(initialCols * 0.15)),
    }, {
      row: Math.floor(initialRows / 2),
      col: Math.min(initialCols - 2, Math.floor(initialCols * 0.85)),
    })
  );

  const [activeTool, setActiveTool] = useState<ToolMode>('wall');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [dragMode, setDragMode] = useState<ToolMode | null>(null);

  // gridVersion counter increments on any grid modification, invalidating old search results
  const [gridVersion, setGridVersion] = useState(0);

  // LocalStorage persistence for saved grids
  const [savedGrids, setSavedGrids] = useLocalStorage<SavedGridConfig[]>(
    'pathfinder-saved-grids',
    []
  );

  const invalidateResults = useCallback(() => {
    setGridVersion((v) => v + 1);
  }, []);

  // Resize Grid
  const resizeGrid = useCallback(
    (newRows: number, newCols: number) => {
      const clampedRows = Math.max(8, Math.min(40, newRows));
      const clampedCols = Math.max(12, Math.min(60, newCols));

      const newStart = {
        row: Math.min(start.row, clampedRows - 1),
        col: Math.min(start.col, clampedCols - 1),
      };
      let newGoal = {
        row: Math.min(goal.row, clampedRows - 1),
        col: Math.min(goal.col, clampedCols - 1),
      };
      if (newStart.row === newGoal.row && newStart.col === newGoal.col) {
        newGoal = {
          row: Math.max(0, newStart.row - 1),
          col: Math.max(0, newStart.col - 1),
        };
      }

      setRows(clampedRows);
      setCols(clampedCols);
      setStart(newStart);
      setGoal(newGoal);
      setGrid(createEmptyGrid(clampedRows, clampedCols, newStart, newGoal));
      invalidateResults();
    },
    [start, goal, invalidateResults]
  );

  // Clear Walls
  const clearWalls = useCallback(() => {
    setGrid((prev) => cloneGrid(prev, false));
    invalidateResults();
  }, [invalidateResults]);

  // Reset Search Visualization States (keeps walls intact)
  const resetVisualizationState = useCallback(() => {
    setGrid((prev) => cloneGrid(prev, true));
  }, []);

  // Full Reset to default layout
  const resetToDefault = useCallback(() => {
    const defaultStart = {
      row: Math.floor(initialRows / 2),
      col: Math.max(1, Math.floor(initialCols * 0.15)),
    };
    const defaultGoal = {
      row: Math.floor(initialRows / 2),
      col: Math.min(initialCols - 2, Math.floor(initialCols * 0.85)),
    };
    setRows(initialRows);
    setCols(initialCols);
    setStart(defaultStart);
    setGoal(defaultGoal);
    setGrid(createEmptyGrid(initialRows, initialCols, defaultStart, defaultGoal));
    invalidateResults();
  }, [initialRows, initialCols, invalidateResults]);

  // Move Start or Goal node safely
  const moveNode = useCallback(
    (type: 'start' | 'goal', targetRow: number, targetCol: number) => {
      if (targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= cols) return;

      if (type === 'start') {
        if (targetRow === goal.row && targetCol === goal.col) return; // cannot overlap goal
        setStart({ row: targetRow, col: targetCol });
        setGrid((prev) =>
          prev.map((rList, r) =>
            rList.map((node, c) => ({
              ...node,
              isStart: r === targetRow && c === targetCol,
              isWall: r === targetRow && c === targetCol ? false : node.isWall,
              state: 'unvisited',
            }))
          )
        );
      } else {
        if (targetRow === start.row && targetCol === start.col) return; // cannot overlap start
        setGoal({ row: targetRow, col: targetCol });
        setGrid((prev) =>
          prev.map((rList, r) =>
            rList.map((node, c) => ({
              ...node,
              isGoal: r === targetRow && c === targetCol,
              isWall: r === targetRow && c === targetCol ? false : node.isWall,
              state: 'unvisited',
            }))
          )
        );
      }
      invalidateResults();
    },
    [rows, cols, start, goal, invalidateResults]
  );

  // Mouse Down Event on Cell
  const handleCellMouseDown = useCallback(
    (row: number, col: number) => {
      setIsMouseDown(true);
      const isStartNode = row === start.row && col === start.col;
      const isGoalNode = row === goal.row && col === goal.col;

      if (isStartNode) {
        setDragMode('move-start');
        return;
      }
      if (isGoalNode) {
        setDragMode('move-goal');
        return;
      }

      // Check active tool or toggle wall
      if (activeTool === 'erase') {
        setDragMode('erase');
        setGrid((prev) => toggleWall(prev, row, col, false));
        invalidateResults();
      } else {
        const currentIsWall = grid[row]?.[col]?.isWall;
        const targetWallState = !currentIsWall;
        const currentMode: ToolMode = targetWallState ? 'wall' : 'erase';
        setDragMode(currentMode);
        setGrid((prev) => toggleWall(prev, row, col, targetWallState));
        invalidateResults();
      }
    },
    [start, goal, activeTool, grid, invalidateResults]
  );

  // Mouse Enter Event on Cell during drag
  const handleCellMouseEnter = useCallback(
    (row: number, col: number) => {
      if (!isMouseDown || !dragMode) return;

      if (dragMode === 'move-start') {
        moveNode('start', row, col);
      } else if (dragMode === 'move-goal') {
        moveNode('goal', row, col);
      } else if (dragMode === 'wall') {
        setGrid((prev) => toggleWall(prev, row, col, true));
        invalidateResults();
      } else if (dragMode === 'erase') {
        setGrid((prev) => toggleWall(prev, row, col, false));
        invalidateResults();
      }
    },
    [isMouseDown, dragMode, moveNode, invalidateResults]
  );

  // Mouse Up Event
  const handleMouseUp = useCallback(() => {
    setIsMouseDown(false);
    setDragMode(null);
  }, []);

  // Touch handlers for mobile/tablet support
  const handleTouchMove = useCallback(
    (e: React.TouchEvent<HTMLDivElement>) => {
      if (!isMouseDown || !dragMode) return;
      const touch = e.touches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      if (target) {
        const rowAttr = target.getAttribute('data-row');
        const colAttr = target.getAttribute('data-col');
        if (rowAttr !== null && colAttr !== null) {
          const r = parseInt(rowAttr, 10);
          const c = parseInt(colAttr, 10);
          handleCellMouseEnter(r, c);
        }
      }
    },
    [isMouseDown, dragMode, handleCellMouseEnter]
  );

  // Maze Generators
  const applyRandomObstacles = useCallback(
    (density: number = 0.28) => {
      setGrid((prev) => generateRandomMaze(prev, start, goal, density));
      invalidateResults();
    },
    [start, goal, invalidateResults]
  );

  const applyRecursiveDivision = useCallback(() => {
    setGrid((prev) => generateRecursiveDivisionMaze(prev, start, goal));
    invalidateResults();
  }, [start, goal, invalidateResults]);

  const applySpiral = useCallback(() => {
    setGrid((prev) => generateSpiralMaze(prev, start, goal));
    invalidateResults();
  }, [start, goal, invalidateResults]);

  const applyPreset = useCallback(
    (presetId: string) => {
      const preset = PRESET_MAZES.find((p) => p.id === presetId);
      if (preset) {
        setGrid((prev) => preset.apply(prev, start, goal));
        invalidateResults();
      }
    },
    [start, goal, invalidateResults]
  );

  // LocalStorage Grid Management
  const saveCurrentGrid = useCallback(
    (name: string): SavedGridConfig => {
      const walls: [number, number][] = [];
      grid.forEach((row, r) => {
        row.forEach((node, c) => {
          if (node.isWall) walls.push([r, c]);
        });
      });

      const newConfig: SavedGridConfig = {
        id: `grid-${Date.now()}`,
        name: name.trim() || `Grid ${savedGrids.length + 1}`,
        createdAt: new Date().toLocaleDateString(),
        rows,
        cols,
        start,
        goal,
        walls,
      };

      setSavedGrids((prev) => [newConfig, ...prev]);
      return newConfig;
    },
    [grid, rows, cols, start, goal, savedGrids.length, setSavedGrids]
  );

  const loadSavedGrid = useCallback(
    (config: SavedGridConfig) => {
      setRows(config.rows);
      setCols(config.cols);
      setStart(config.start);
      setGoal(config.goal);

      let newGrid = createEmptyGrid(config.rows, config.cols, config.start, config.goal);
      config.walls.forEach(([r, c]) => {
        newGrid = toggleWall(newGrid, r, c, true);
      });

      setGrid(newGrid);
      invalidateResults();
    },
    [invalidateResults]
  );

  const deleteSavedGrid = useCallback(
    (id: string) => {
      setSavedGrids((prev) => prev.filter((g) => g.id !== id));
    },
    [setSavedGrids]
  );

  return {
    rows,
    cols,
    start,
    goal,
    grid,
    setGrid,
    activeTool,
    setActiveTool,
    isMouseDown,
    gridVersion,
    savedGrids,
    resizeGrid,
    clearWalls,
    resetVisualizationState,
    resetToDefault,
    moveNode,
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
    invalidateResults,
  };
}
