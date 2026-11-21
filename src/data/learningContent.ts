export interface VivaQuestion {
  question: string;
  category: 'Core Concepts' | 'Mathematical Foundation' | 'Practical Implementation' | 'Complexity';
  shortAnswer: string;
  detailedAnswer: string;
}

export interface WorkedStep {
  step: number;
  evaluatedNode: string;
  g: number;
  h: number;
  f: number;
  action: string;
  openSetContent: string;
}

export const A_STAR_PSEUDOCODE = `function A_Star(start, goal, heuristic):
    // Initialize Min-Priority Queue for Open Set (Nodes to be explored)
    openQueue = PriorityQueue()
    openQueue.enqueue(start, priority=0)

    // Maps to store costs and path pointers
    gScore = Map(default=Infinity)
    gScore[start] = 0

    fScore = Map(default=Infinity)
    fScore[start] = heuristic(start, goal)

    closedSet = Set()  // Finalized nodes
    cameFrom = Map()   // Parent pointers for path reconstruction

    while not openQueue.isEmpty():
        current = openQueue.dequeue()  // Node with lowest f(n)

        // Goal check
        if current == goal:
            return reconstructPath(cameFrom, current)

        closedSet.add(current)

        for neighbor in getValidOrthogonalNeighbors(current):
            if neighbor in closedSet or neighbor.isWall:
                continue

            tentative_gScore = gScore[current] + 1  // Unit edge cost = 1

            if tentative_gScore < gScore[neighbor]:
                // Found a better path to this neighbor!
                cameFrom[neighbor] = current
                gScore[neighbor] = tentative_gScore
                h = heuristic(neighbor, goal)
                fScore[neighbor] = tentative_gScore + h

                if neighbor not in openQueue:
                    openQueue.enqueue(neighbor, priority=fScore[neighbor])

    return Failure  // No path exists`;

export const WORKED_EXAMPLE_STEPS: WorkedStep[] = [
  {
    step: 1,
    evaluatedNode: 'Start Node A (0, 0)',
    g: 0,
    h: 4,
    f: 4,
    action: 'Initialize start node. Push to Open Set. g=0, h=|0-2|+|0-2|=4, f=4.',
    openSetContent: '[A: f=4, g=0, h=4]',
  },
  {
    step: 2,
    evaluatedNode: 'Node A expanded',
    g: 0,
    h: 4,
    f: 4,
    action: 'Dequeue A. Inspect orthogonal neighbors: B(0,1) and C(1,0). Both have g=1, h=3, f=4. Add both to Open Set.',
    openSetContent: '[B: f=4, g=1, h=3], [C: f=4, g=1, h=3]',
  },
  {
    step: 3,
    evaluatedNode: 'Node B (0, 1)',
    g: 1,
    h: 3,
    f: 4,
    action: 'Dequeue B. Inspect neighbors. D(0,2) has wall blocking forward path; E(1,1) has g=2, h=2, f=4. Add E.',
    openSetContent: '[C: f=4, g=1, h=3], [E: f=4, g=2, h=2]',
  },
  {
    step: 4,
    evaluatedNode: 'Node C (1, 0)',
    g: 1,
    h: 3,
    f: 4,
    action: 'Dequeue C. Discovers F(2,0) with g=2, h=2, f=4. E(1,1) already in Open Set with equal cost.',
    openSetContent: '[E: f=4, g=2, h=2], [F: f=4, g=2, h=2]',
  },
  {
    step: 5,
    evaluatedNode: 'Node E (1, 1)',
    g: 2,
    h: 2,
    f: 4,
    action: 'Dequeue E. Direct neighbor G(2,1) and H(1,2) explored with g=3, h=1, f=4.',
    openSetContent: '[H: f=4, g=3, h=1], [G: f=4, g=3, h=1]',
  },
  {
    step: 6,
    evaluatedNode: 'Node H (1, 2)',
    g: 3,
    h: 1,
    f: 4,
    action: 'Dequeue H. Discovers Goal (2,2) with tentative g=4, h=0, f=4. Goal enqueued.',
    openSetContent: '[Goal: f=4, g=4, h=0]',
  },
  {
    step: 7,
    evaluatedNode: 'Goal (2, 2) Dequeued',
    g: 4,
    h: 0,
    f: 4,
    action: 'Goal reached! Terminate search. Backtrack parent pointers: A -> B -> E -> H -> Goal. Path length = 4.',
    openSetContent: 'Path finalized: [A, B, E, H, Goal]',
  },
];

export const FLOWCHART_STEPS = [
  {
    title: '1. Initialization',
    desc: 'Insert Start node into Open Set with g=0, h=heuristic(Start, Goal), f=g+h. Initialize Closed Set as empty.',
  },
  {
    title: '2. Check Termination',
    desc: 'Is the Open Set empty? If YES, return "No Path Exists". Otherwise, proceed to expansion.',
  },
  {
    title: '3. Extract Minimum',
    desc: 'Dequeue node "Current" with lowest f(n) from Open Set using the Min-Priority Queue (tie-break on lower h).',
  },
  {
    title: '4. Goal Test',
    desc: 'Is "Current" equal to Goal? If YES, follow parent pointers from Goal to Start to reconstruct the optimal path and terminate.',
  },
  {
    title: '5. Expand Neighbors',
    desc: 'Add "Current" to Closed Set. For each valid 4-way orthogonal neighbor not in Closed Set and not a wall:',
  },
  {
    title: '6. Relaxation Check',
    desc: 'Calculate tentative_g = current.g + 1. If tentative_g < neighbor.g, update parent, gScore, and fScore. Enqueue into Open Set.',
  },
  {
    title: '7. Repeat Loop',
    desc: 'Loop back to Step 2 until the goal is dequeued or the Open Set is exhausted.',
  },
];

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    question: '1. What is the fundamental difference between uninformed and informed search?',
    category: 'Core Concepts',
    shortAnswer: 'Uninformed search operates blindly without domain guidance, whereas informed search uses a heuristic function h(n) to estimate distance to the goal.',
    detailedAnswer:
      'Uninformed algorithms like BFS and DFS have no knowledge of whether an expanded state is closer to or farther from the goal—they explore uniformly in all directions. Informed search (like A* and Greedy Best-First) uses domain heuristics h(n) to prioritize nodes that appear closer to the target, drastically pruning the state search space.',
  },
  {
    question: '2. What is the A* evaluation function and what does each component represent?',
    category: 'Core Concepts',
    shortAnswer: 'f(n) = g(n) + h(n), where g(n) is the exact cost from start to n, and h(n) is the estimated cost from n to the goal.',
    detailedAnswer:
      'f(n) estimates the total cost of the cheapest path from the start node through node n to the goal. g(n) measures the actual cost already incurred, preventing deep runaway branches. h(n) measures the expected remaining cost, pulling exploration directly toward the goal.',
  },
  {
    question: '3. What does it mean for a heuristic to be "admissible"?',
    category: 'Mathematical Foundation',
    shortAnswer: 'A heuristic is admissible if it never overestimates the true cost to reach the goal (h(n) <= h*(n)).',
    detailedAnswer:
      'Admissibility ensures that the algorithm never rejects an optimal path in favor of a seemingly shorter but actually sub-optimal path. If h(n) is admissible, tree-search A* is guaranteed to return an optimal solution.',
  },
  {
    question: '4. What does it mean for a heuristic to be "consistent" (monotonic)?',
    category: 'Mathematical Foundation',
    shortAnswer: 'Consistency requires h(n) <= c(n, a, n\') + h(n\') for any neighbor n\', satisfying the triangle inequality.',
    detailedAnswer:
      'Consistency is a stronger condition than admissibility. When a heuristic is consistent, the f-scores along any path are monotonically non-decreasing. This guarantees that whenever a node is closed, the shortest path to that node has already been found, eliminating the need to ever reopen closed nodes.',
  },
  {
    question: '5. Why is Manhattan distance preferred over Euclidean distance on a 4-directional grid?',
    category: 'Practical Implementation',
    shortAnswer: 'Manhattan distance matches the orthogonal movement constraints, providing a tighter (more informed) admissible bound.',
    detailedAnswer:
      'On a 4-directional grid, diagonal movement is forbidden. The shortest path between (x1, y1) and (x2, y2) without obstacles is exactly |x1 - x2| + |y1 - y2|. Euclidean distance calculates straight-line diagonal distance, which is strictly less than Manhattan distance. While Euclidean is technically admissible (since Euclidean <= Manhattan), it is less informed and causes A* to expand more redundant nodes.',
  },
  {
    question: '6. What happens if h(n) = 0 for all nodes?',
    category: 'Core Concepts',
    shortAnswer: 'A* degrades into Dijkstra\'s Algorithm (Uniform Cost Search).',
    detailedAnswer:
      'When h(n) = 0, f(n) = g(n) + 0 = g(n). The priority queue orders nodes solely based on the cost from the start node. The search radiates outward uniformly in all directions, losing all directional guidance.',
  },
  {
    question: '7. What happens if h(n) is not admissible and overestimates true cost?',
    category: 'Mathematical Foundation',
    shortAnswer: 'A* loses its optimality guarantee and may return a sub-optimal path.',
    detailedAnswer:
      'If h(n) overestimates, A* may perceive the true shortest path as overly expensive and explore an inferior path instead. In practice, this is sometimes used deliberately (Weighted A*, f = g + w*h with w > 1) to find solutions faster at the cost of bounded sub-optimality.',
  },
  {
    question: '8. What is the time and space complexity of A*?',
    category: 'Complexity',
    shortAnswer: 'Worst-case time and space complexity are O(b^d), where b is branching factor and d is solution depth.',
    detailedAnswer:
      'Because A* must keep all generated nodes in memory (in the Open Set and Closed Set) to avoid cycles and check for cheaper paths, memory (space) is typically the practical bottleneck long before CPU time expires.',
  },
  {
    question: '9. How does A* handle tie-breaking among nodes with identical f-scores?',
    category: 'Practical Implementation',
    shortAnswer: 'By prioritizing the node with the smaller h(n) value.',
    detailedAnswer:
      'If two nodes have identical f(n), breaking ties in favor of lower h(n) (higher g(n)) prioritizes nodes that are physically closer to the destination rather than wandering sideways at the same depth.',
  },
  {
    question: '10. Can A* handle negative edge weights?',
    category: 'Mathematical Foundation',
    shortAnswer: 'No, standard A* assumes non-negative edge costs.',
    detailedAnswer:
      'Negative edge weights violate the monotonic non-decreasing nature of path costs and can cause infinite cycles in graphs with negative cycles. If negative edge weights exist, algorithms like Bellman-Ford or SPFA must be used.',
  },
  {
    question: '11. How does A* compare against Breadth-First Search (BFS)?',
    category: 'Core Concepts',
    shortAnswer: 'BFS is unweighted and explores level-by-level; A* uses costs and heuristics to explore greedily toward the goal.',
    detailedAnswer:
      'On uniform-cost grids, both BFS and A* guarantee the shortest path. However, BFS spreads out radially like ripples in a pond, visiting a circular area of nodes, while A* focuses its search beam toward the destination, visiting a fraction of the nodes.',
  },
  {
    question: '12. What real-world applications utilize A* pathfinding?',
    category: 'Practical Implementation',
    shortAnswer: 'GPS navigation, video game AI, robotic motion planning, and VLSI circuit routing.',
    detailedAnswer:
      'Navigation systems like Google Maps use hierarchical contraction hierarchies combined with A*. Video games (StarCraft, Dota, Unity NavMesh) use A* on navigation meshes for unit movement. Autonomous robots (ROS Navigation stack) use A* for global trajectory generation around lidar-mapped obstacles.',
  },
  {
    question: '13. What is the difference between Open Set and Closed Set in A*?',
    category: 'Practical Implementation',
    shortAnswer: 'Open Set contains discovered frontier nodes awaiting evaluation; Closed Set contains nodes that have already been expanded.',
    detailedAnswer:
      'The Open Set is typically implemented with a Min-Priority Queue (Binary Heap) for O(log N) extraction of the minimum f-value. The Closed Set is implemented as a Hash Set (Set/Map) for O(1) membership testing to avoid infinite loops and duplicate expansions.',
  },
  {
    question: '14. Why is memory consumption the primary drawback of A* search?',
    category: 'Complexity',
    shortAnswer: 'A* stores all explored and frontier states in memory, scaling exponentially with search depth.',
    detailedAnswer:
      'Unlike Depth-First Search which only stores the current branch in memory (O(d) space), A* must retain all generated nodes in the Open and Closed sets. Memory-bounded variants like IDA* (Iterative Deepening A*) and SMA* (Simplified Memory-Bounded A*) were invented to address this constraint.',
  },
  {
    question: '15. How does A* reconstruct the final path once the goal is found?',
    category: 'Practical Implementation',
    shortAnswer: 'By following parent pointers backward from the Goal node to the Start node and reversing the sequence.',
    detailedAnswer:
      'Whenever an algorithm finds a superior path to a neighbor, it records cameFrom[neighbor] = current. When the goal is reached, the algorithm traces cameFrom pointers from Goal back to Start in O(path length) time and reverses the array to yield the forward path.',
  },
];
