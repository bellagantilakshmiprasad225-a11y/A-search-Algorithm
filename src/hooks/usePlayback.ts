import { useState, useEffect, useRef, useCallback } from 'react';
import { AlgorithmResult, Grid, PlaybackState, StepEvent, NodeState } from '../types';
import { cloneGrid } from '../utils/gridHelpers';

export function usePlayback(
  algorithmResult: AlgorithmResult | null,
  setGrid: React.Dispatch<React.SetStateAction<Grid>>,
  onPlaybackComplete?: () => void
) {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('idle');
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [speedMs, setSpeedMs] = useState(25); // default ms delay per step

  const timerRef = useRef<number | null>(null);
  const stepEventsRef = useRef<StepEvent[]>([]);

  // Keep stepEventsRef in sync
  useEffect(() => {
    stepEventsRef.current = algorithmResult?.stepEvents || [];
    setCurrentStepIndex(0);
    setPlaybackState('idle');
  }, [algorithmResult]);

  // Pure function to project grid state at any given step index
  const applyTimelineToGrid = useCallback(
    (targetStep: number) => {
      const events = stepEventsRef.current;
      if (!events || events.length === 0) return;

      setGrid((prevGrid) => {
        // Start from pristine grid with walls intact
        const newGrid = cloneGrid(prevGrid, true);

        // Apply events up to targetStep
        const maxIdx = Math.min(targetStep, events.length);
        for (let i = 0; i < maxIdx; i++) {
          const ev = events[i];
          const node = newGrid[ev.row]?.[ev.col];
          if (!node || node.isStart || node.isGoal) continue;

          let state: NodeState = 'unvisited';
          if (ev.action === 'open') state = 'open';
          else if (ev.action === 'closed') state = 'closed';
          else if (ev.action === 'path') state = 'path';

          node.state = state;
          if (ev.f !== undefined) node.f = ev.f;
          if (ev.g !== undefined) node.g = ev.g;
          if (ev.h !== undefined) node.h = ev.h;
        }

        return newGrid;
      });
    },
    [setGrid]
  );

  // Stop active animation loop
  const clearTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  // Step Forward
  const stepForward = useCallback(() => {
    const events = stepEventsRef.current;
    if (currentStepIndex >= events.length) return;

    const nextIndex = currentStepIndex + 1;
    setCurrentStepIndex(nextIndex);
    applyTimelineToGrid(nextIndex);

    if (nextIndex >= events.length) {
      setPlaybackState('completed');
      if (onPlaybackComplete) onPlaybackComplete();
    }
  }, [currentStepIndex, applyTimelineToGrid, onPlaybackComplete]);

  // Step Backward
  const stepBackward = useCallback(() => {
    if (currentStepIndex <= 0) return;

    const prevIndex = currentStepIndex - 1;
    setCurrentStepIndex(prevIndex);
    applyTimelineToGrid(prevIndex);

    if (playbackState === 'completed') {
      setPlaybackState('paused');
    }
  }, [currentStepIndex, playbackState, applyTimelineToGrid]);

  // Jump to specific step (scrubbing)
  const jumpToStep = useCallback(
    (stepIndex: number) => {
      clearTimer();
      const events = stepEventsRef.current;
      const clamped = Math.max(0, Math.min(stepIndex, events.length));
      setCurrentStepIndex(clamped);
      applyTimelineToGrid(clamped);

      if (clamped >= events.length) {
        setPlaybackState('completed');
      } else if (playbackState === 'playing') {
        setPlaybackState('paused');
      }
    },
    [clearTimer, applyTimelineToGrid, playbackState]
  );

  // Play
  const play = useCallback(() => {
    const events = stepEventsRef.current;
    if (events.length === 0) return;

    // If at end, restart from step 0
    if (currentStepIndex >= events.length) {
      setCurrentStepIndex(0);
      applyTimelineToGrid(0);
    }

    setPlaybackState('playing');
  }, [currentStepIndex, applyTimelineToGrid]);

  // Pause
  const pause = useCallback(() => {
    clearTimer();
    setPlaybackState('paused');
  }, [clearTimer]);

  // Reset Playback
  const resetPlayback = useCallback(() => {
    clearTimer();
    setCurrentStepIndex(0);
    setPlaybackState('idle');
    applyTimelineToGrid(0);
  }, [clearTimer, applyTimelineToGrid]);

  // Playback Tick Effect
  useEffect(() => {
    if (playbackState !== 'playing') {
      clearTimer();
      return;
    }

    const events = stepEventsRef.current;
    if (currentStepIndex >= events.length) {
      setPlaybackState('completed');
      clearTimer();
      if (onPlaybackComplete) onPlaybackComplete();
      return;
    }

    timerRef.current = window.setTimeout(() => {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      applyTimelineToGrid(nextIndex);
    }, speedMs);

    return () => clearTimer();
  }, [playbackState, currentStepIndex, speedMs, applyTimelineToGrid, clearTimer, onPlaybackComplete]);

  // Calculate live stats up to currentStepIndex
  const events = stepEventsRef.current;
  const totalSteps = events.length;
  const progressPercent = totalSteps > 0 ? (currentStepIndex / totalSteps) * 100 : 0;

  // Track counts up to currentStepIndex
  let currentExploredCount = 0;
  const activeOpenSet = new Set<string>();

  for (let i = 0; i < Math.min(currentStepIndex, events.length); i++) {
    const ev = events[i];
    const key = `${ev.row},${ev.col}`;
    if (ev.action === 'open') {
      activeOpenSet.add(key);
    } else if (ev.action === 'closed') {
      activeOpenSet.delete(key);
      currentExploredCount++;
    }
  }

  return {
    playbackState,
    currentStepIndex,
    totalSteps,
    speedMs,
    setSpeedMs,
    progressPercent,
    currentExploredCount,
    currentOpenCount: activeOpenSet.size,
    play,
    pause,
    stepForward,
    stepBackward,
    jumpToStep,
    resetPlayback,
  };
}
