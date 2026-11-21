import { describe, it, expect } from 'vitest';
import { MinPriorityQueue } from '../priorityQueue';
import { manhattanDistance, euclideanDistance } from '../heuristics';
import { runAStar } from '../astar';
import { runDijkstra } from '../dijkstra';
import { runBFS } from '../bfs';
import { createEmptyGrid, toggleWall } from '../../utils/gridHelpers';

describe('MinPriorityQueue', () => {
  it('correctly maintains min-heap order', () => {
    const pq = new MinPriorityQueue<string>();
    pq.enqueue('C', 10);
    pq.enqueue('A', 2);
    pq.enqueue('B', 5);
    pq.enqueue('D', 1);

    expect(pq.size()).toBe(4);
    expect(pq.dequeue()).toBe('D');
    expect(pq.dequeue()).toBe('A');
    expect(pq.dequeue()).toBe('B');
    expect(pq.dequeue()).toBe('C');
    expect(pq.isEmpty()).toBe(true);
  });

  it('correctly breaks ties using secondaryPriority (lower h wins)', () => {
    const pq = new MinPriorityQueue<string>();
    // Both have f = 10, but item 'CloserToGoal' has lower h = 2 vs 'FarFromGoal' h = 8
    pq.enqueue('FarFromGoal', 10, 8);
    pq.enqueue('CloserToGoal', 10, 2);

    expect(pq.dequeue()).toBe('CloserToGoal');
    expect(pq.dequeue()).toBe('FarFromGoal');
  });
});

describe('Heuristics', () => {
  it('calculates exact Manhattan distance', () => {
    const p1 = { row: 2, col: 3 };
    const p2 = { row: 7, col: 9 };
    // |2 - 7| + |3 - 9| = 5 + 6 = 11
    expect(manhattanDistance(p1, p2)).toBe(11);
  });

  it('calculates exact Euclidean distance', () => {
    const p1 = { row: 0, col: 0 };
    const p2 = { row: 3, col: 4 };
    // sqrt(3^2 + 4^2) = 5
    expect(euclideanDistance(p1, p2)).toBe(5);
  });

  it('satisfies admissibility (Euclidean <= Manhattan on 4-way grid)', () => {
    const p1 = { row: 5, col: 12 };
    const p2 = { row: 18, col: 4 };
    expect(euclideanDistance(p1, p2)).toBeLessThanOrEqual(manhattanDistance(p1, p2));
  });
});

describe('Pathfinding Algorithm Correctness & Equivalence', () => {
  it('A*, Dijkstra, and BFS find identical shortest path lengths on an open grid', () => {
    const rows = 15;
    const cols = 15;
    const start = { row: 2, col: 2 };
    const goal = { row: 12, col: 12 };

    const grid = createEmptyGrid(rows, cols, start, goal);

    const astarResult = runAStar(grid, start, goal, 'manhattan');
    const dijkstraResult = runDijkstra(grid, start, goal);
    const bfsResult = runBFS(grid, start, goal);

    expect(astarResult.found).toBe(true);
    expect(dijkstraResult.found).toBe(true);
    expect(bfsResult.found).toBe(true);

    // Theoretical shortest path on 15x15 open grid with 4-directional moves:
    // |2-12| + |2-12| = 10 + 10 = 20 steps
    expect(astarResult.pathLength).toBe(20);
    expect(dijkstraResult.pathLength).toBe(20);
    expect(bfsResult.pathLength).toBe(20);

    // Invariant: All three algorithm path lengths MUST equal
    expect(astarResult.pathLength).toBe(dijkstraResult.pathLength);
    expect(astarResult.pathLength).toBe(bfsResult.pathLength);

    // Efficiency invariant: Informed A* explores fewer or equal nodes than uninformed Dijkstra & BFS
    expect(astarResult.visitedCount).toBeLessThanOrEqual(dijkstraResult.visitedCount);
    expect(astarResult.visitedCount).toBeLessThanOrEqual(bfsResult.visitedCount);
  });

  it('A*, Dijkstra, and BFS find identical shortest path length around a wall obstacle', () => {
    const rows = 11;
    const cols = 11;
    const start = { row: 5, col: 2 };
    const goal = { row: 5, col: 8 };

    let grid = createEmptyGrid(rows, cols, start, goal);

    // Place a vertical wall between start and goal from row 2 to row 8 at col 5
    for (let r = 2; r <= 8; r++) {
      grid = toggleWall(grid, r, 5, true);
    }

    const astarResult = runAStar(grid, start, goal, 'manhattan');
    const dijkstraResult = runDijkstra(grid, start, goal);
    const bfsResult = runBFS(grid, start, goal);

    expect(astarResult.found).toBe(true);
    expect(dijkstraResult.found).toBe(true);
    expect(bfsResult.found).toBe(true);

    // Path must navigate around wall: path length must be strictly identical across all 3
    expect(astarResult.pathLength).toBe(dijkstraResult.pathLength);
    expect(astarResult.pathLength).toBe(bfsResult.pathLength);
  });

  it('correctly handles start equal to goal', () => {
    const rows = 10;
    const cols = 10;
    const start = { row: 4, col: 4 };
    const goal = { row: 4, col: 4 };

    const grid = createEmptyGrid(rows, cols, start, goal);

    const astarResult = runAStar(grid, start, goal);
    const dijkstraResult = runDijkstra(grid, start, goal);
    const bfsResult = runBFS(grid, start, goal);

    expect(astarResult.found).toBe(true);
    expect(astarResult.pathLength).toBe(0);
    expect(astarResult.path.length).toBe(1);

    expect(dijkstraResult.found).toBe(true);
    expect(dijkstraResult.pathLength).toBe(0);

    expect(bfsResult.found).toBe(true);
    expect(bfsResult.pathLength).toBe(0);
  });

  it('detects and reports correctly when no path exists (unreachable goal)', () => {
    const rows = 10;
    const cols = 10;
    const start = { row: 1, col: 1 };
    const goal = { row: 8, col: 8 };

    let grid = createEmptyGrid(rows, cols, start, goal);

    // Fully box in the goal with walls
    grid = toggleWall(grid, 7, 7, true);
    grid = toggleWall(grid, 7, 8, true);
    grid = toggleWall(grid, 7, 9, true);
    grid = toggleWall(grid, 8, 7, true);
    grid = toggleWall(grid, 8, 9, true);
    grid = toggleWall(grid, 9, 7, true);
    grid = toggleWall(grid, 9, 8, true);
    grid = toggleWall(grid, 9, 9, true);

    const astarResult = runAStar(grid, start, goal);
    const dijkstraResult = runDijkstra(grid, start, goal);
    const bfsResult = runBFS(grid, start, goal);

    expect(astarResult.found).toBe(false);
    expect(astarResult.path).toEqual([]);
    expect(astarResult.pathLength).toBe(0);
    expect(astarResult.visitedCount).toBeGreaterThan(0);

    expect(dijkstraResult.found).toBe(false);
    expect(dijkstraResult.path).toEqual([]);

    expect(bfsResult.found).toBe(false);
    expect(bfsResult.path).toEqual([]);
  });

  it('ensures wall cannot overwrite start or goal coordinates', () => {
    const rows = 10;
    const cols = 10;
    const start = { row: 2, col: 3 };
    const goal = { row: 7, col: 8 };

    let grid = createEmptyGrid(rows, cols, start, goal);

    // Attempt to place wall on start
    grid = toggleWall(grid, start.row, start.col, true);
    expect(grid[start.row][start.col].isWall).toBe(false);
    expect(grid[start.row][start.col].isStart).toBe(true);

    // Attempt to place wall on goal
    grid = toggleWall(grid, goal.row, goal.col, true);
    expect(grid[goal.row][goal.col].isWall).toBe(false);
    expect(grid[goal.row][goal.col].isGoal).toBe(true);
  });
});
