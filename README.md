# A* Search Algorithm Visualizer – AI Pathfinding System
### 3rd-Year B.Tech Computer Science & Engineering Mini-Project
**Artificial Intelligence & Algorithm Design Laboratory**

---

## 📌 1. Project Overview

The **A* Search Algorithm Visualizer** is an interactive, production-grade web application built to visually demonstrate and empirically analyze informed search algorithms in Artificial Intelligence.

Designed specifically for academic demonstrations, university laboratory evaluations, and technical viva examinations, the system allows students and examiners to:
- Draw and erase obstacles in real time with mouse/touch support.
- Reposition start ($\mathbf{S}$) and goal ($\mathbf{G}$) nodes.
- Watch **A\***, **Dijkstra’s Algorithm**, and **Breadth-First Search (BFS)** explore state spaces step-by-step.
- Inspect the exact evaluation functions $f(n) = g(n) + h(n)$ on individual grid cells.
- Compare algorithm optimality, node expansion counts, and execution times side-by-side using **Recharts**.
- Export benchmark performance records directly to **CSV**.
- Study textbook-grade theory, worked mathematical traces, and **15+ curated viva questions with model answers**.

> **Zero Backend Requirement**: The application is 100% client-side, self-contained, requires no paid API keys or network calls at runtime, and persists user configurations locally via **LocalStorage**.

---

## 🛠️ 2. Technology Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **React 18** + **TypeScript** (Strict Mode) | Component-driven architecture and compile-time type safety. |
| **Build Tool** | **Vite 6** | Instant HMR development server and optimized Rollup production bundling. |
| **Styling** | **Tailwind CSS** + PostCSS | Custom Dark Navy AI laboratory aesthetic with glassmorphism and radiant accents. |
| **Icons** | **Lucide React** | Clean, accessible vector icons for all interactive states. |
| **Animations** | **Framer Motion** + CSS Keyframes | Fluid page transitions and grid cell expansion micro-animations. |
| **Data Visualization**| **Recharts** | Hardware-independent comparative bar charts for explored nodes and execution latency. |
| **Testing** | **Vitest** | Automated unit tests validating algorithm equivalence, heuristics, and invariants. |
| **Persistence** | **HTML5 LocalStorage API** | Seamless browser storage for theme preferences, custom grids, and student credentials. |

---

## 🧠 3. Mathematical Foundations of A* Search

### The Evaluation Function
$$f(n) = g(n) + h(n)$$

Where:
- **$g(n)$**: The **exact known cost** from the starting node to node $n$. On our uniform-cost orthogonal grid, each move has a cost $c = 1$.
- **$h(n)$**: The **heuristic estimate** of the cheapest path from node $n$ to the goal.
- **$f(n)$**: The **estimated total cost** of the cheapest solution passing through node $n$.

```
 [Start] ──(g(n): Exact Path Cost)──> [Node n] ┄┄(h(n): Heuristic Estimate)┄┄> [Goal]
 └──────────────────────────── f(n) = g(n) + h(n) ────────────────────────────┘
```

### Heuristic Admissibility & Consistency
1. **Admissibility ($h(n) \le h^*(n)$)**:
   A heuristic is *admissible* if it never overestimates the true cost to reach the goal. On a 4-directional grid, the **Manhattan Distance** ($L_1$ norm):
   $$h(n) = |x_n - x_{\text{goal}}| + |y_n - y_{\text{goal}}|$$
   is admissible and consistent, guaranteeing that A* finds an **optimal shortest path**.
2. **Euclidean Distance ($L_2$ norm)**:
   $$h(n) = \sqrt{(x_n - x_{\text{goal}})^2 + (y_n - y_{\text{goal}})^2}$$
   is also admissible ($L_2 \le L_1$), but is *less informed* on 4-way orthogonal grids, leading to more node expansions.
3. **When $h(n) = 0$**:
   A* degenerates into **Dijkstra’s Algorithm** (Uniform Cost Search), expanding concentric rings radially without directional guidance.

---

## 📊 4. Algorithm Comparison Matrix

| Property | A* Search (Manhattan) | Dijkstra’s Algorithm | Breadth-First Search (BFS) |
|---|---|---|---|
| **Search Paradigm** | Informed (Heuristic Best-First) | Uniform Cost Search | Unweighted Blind Search |
| **Guaranteed Shortest Path** | ✅ Yes (with admissible $h$) | ✅ Yes (non-negative costs) | ✅ Yes (unweighted graphs) |
| **Evaluation Function** | $f(n) = g(n) + h(n)$ | $f(n) = g(n)$ | FIFO Queue Order |
| **Time Complexity** | $O(b^d)$ worst-case; $O(d)$ best-case | $O((V + E) \log V)$ | $O(V + E)$ |
| **Space Complexity** | $O(b^d)$ (Open & Closed sets) | $O(V)$ | $O(V)$ |
| **Search Pattern** | Directional beam toward goal | Radiating concentric circles | Uniform wave outward |
| **Typical Expansions** | **Minimal (~70% fewer nodes)** | Large | Large |

---

## 📂 5. Project Directory Architecture

```
astar-pathfinding-visualizer/
├── index.html                     # Entry HTML template with dark theme and typography
├── package.json                   # Dependencies, scripts, and build configurations
├── tsconfig.json                  # Strict TypeScript compiler options
├── tailwind.config.js             # Custom Dark Navy & Neon Cyan theme palette
├── postcss.config.js              # PostCSS Tailwind and Autoprefixer integration
├── vite.config.ts                 # Vite server and React plugin setup
├── src/
│   ├── main.tsx                   # React root entry point
│   ├── App.tsx                    # Shell layout, hash router & toast notifications
│   ├── index.css                  # Global styles, scrollbars, and cell keyframe animations
│   ├── types/
│   │   └── index.ts               # Complete TypeScript interfaces (GridNode, StepEvent, AlgorithmResult)
│   ├── algorithms/
│   │   ├── astar.ts               # Pure A* implementation with binary heap priority queue
│   │   ├── dijkstra.ts            # Pure Dijkstra uniform-cost implementation
│   │   ├── bfs.ts                 # Pure BFS queue implementation
│   │   ├── heuristics.ts          # Manhattan and Euclidean distance formulas
│   │   ├── priorityQueue.ts       # O(log N) Min-Priority Queue with secondary tie-breaking
│   │   ├── index.ts               # Dispatcher and unified algorithm runner
│   │   └── __tests__/
│   │       └── algorithms.test.ts # Vitest suite verifying algorithm optimality & invariants
│   ├── hooks/
│   │   ├── useGrid.ts             # Interactive grid state, drawing walls, maze generators
│   │   ├── usePlayback.ts         # Deterministic timeline playback (play, pause, step forward/backward)
│   │   ├── useLocalStorage.ts     # Generic typed LocalStorage synchronization
│   │   └── useTheme.ts            # Dark/Light mode toggle and class switcher
│   ├── components/
│   │   ├── Cell.tsx               # Individual cell renderer with start, goal, wall & path states
│   │   ├── Grid.tsx               # Responsive matrix with mouse and touch drag listeners
│   │   ├── Controls.tsx           # Playback toolbar, speed presets, step scrubber
│   │   ├── Legend.tsx             # Interactive color code legend and tool switcher
│   │   ├── StatCard.tsx           # Metric cards for explored counts, path length, and latency
│   │   ├── MazeControls.tsx       # Maze generator buttons and LocalStorage save/load modals
│   │   ├── Navbar.tsx             # Top header with engine status, academic badge, theme toggle
│   │   ├── Sidebar.tsx            # Left navigation sidebar with active page indicators
│   │   ├── Toast.tsx              # Animated notification toasts
│   │   └── Tooltip.tsx            # Accessible contextual tooltip component
│   ├── pages/
│   │   ├── Dashboard.tsx          # Executive dashboard with overview metrics and Recharts graphs
│   │   ├── Visualizer.tsx         # Core interactive pathfinding laboratory canvas
│   │   ├── Comparison.tsx         # 3-way head-to-head benchmark with Recharts and CSV export
│   │   ├── Learn.tsx              # Theory guide, worked traces, flowchart, and 15+ viva FAQs
│   │   └── ProjectInfo.tsx        # Technical specs, architecture principles & editable student credits
│   ├── utils/
│   │   ├── gridHelpers.ts         # Grid initialization, cloning, and safe wall toggling
│   │   ├── mazeGenerators.ts      # Recursive division, random obstacles, and spiral labyrinth
│   │   └── csvExport.ts           # Benchmark CSV report generator and file download trigger
│   └── data/
│       ├── presetMazes.ts         # Pre-configured test scenarios (Slalom, Bottleneck, U-Trap)
│       └── learningContent.ts     # A* pseudocode, worked trace steps, and curated viva QA
```

---

## 🚀 6. Installation & Execution Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher (v24.x tested and supported)
- **npm**: v9.0.0 or higher

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to:
👉 **`http://localhost:3000/`**

### Step 3: Run the Automated Unit Tests (Vitest)
```bash
npm test
```
*Executes all 10 unit tests comparing path lengths, priority queue invariants, and edge cases.*

### Step 4: Verify the Production Bundle
```bash
npm run build
```
*Compiles the TypeScript source with zero errors and outputs minified static assets to `/dist`.*

---

## 🎓 7. Viva Defense & Demonstration Checklist

Follow this workflow during your college mini-project examination:

1. **Demonstrate A\* End-to-End**:
   - Navigate to **Visualizer** (`#visualizer`).
   - Click **"Sample Demo"**. The app automatically loads the *Slalom Zig-Zag* maze and runs A* with Manhattan distance.
   - Explain the color legend:
     - 🟢 **Start Node** (Emerald flag)
     - 🔴 **Goal Node** (Rose target)
     - ⬛ **Wall Obstacles** (Dark blocks)
     - 🔵 **Open Set** (Cyan glow - nodes on the frontier)
     - 🟣 **Closed Set** (Indigo fill - evaluated nodes)
     - 🟡 **Shortest Path** (Golden amber radiant trail)
2. **Demonstrate Replay & Exact Step Backward**:
   - Pause playback using the Pause button.
   - Click **Step Backward** and **Step Forward** to show the examiner that steps are recorded deterministically in an event stream and can be inspected without state drift.
   - Toggle **"f/g/h Scores"** to show actual numeric calculations on the cells.
3. **Prove Optimality & Node Efficiency (Comparison Page)**:
   - Navigate to **Comparison** (`#comparison`).
   - Click **"Re-Run Benchmark"**.
   - Point out to the examiner:
     - **Path Length is identical across all three algorithms**: mathematically proving that A* preserves optimality.
     - **A\* evaluates ~70% fewer nodes**: demonstrating how heuristic guidance prunes the search space.
     - Explain why *explored node count* is the true hardware-independent metric, while *execution time (ms)* fluctuates with CPU scheduling.
4. **Export CSV Live**:
   - Click **"Export CSV"** to download the live benchmark report as evidence of empirical evaluation.
5. **Answer Theory Questions**:
   - Navigate to **Learn A\*** (`#learn`).
   - Review Section 3 (Worked Example), Section 4 (Pseudocode), and Section 8 (15+ Viva FAQs) for questions on admissibility ($h(n) \le h^*(n)$) and consistency.
6. **Showcase Student Metadata**:
   - Navigate to **Project Info** (`#project-info`).
   - Enter your name, roll number, and college name into the form; click **"Save Credentials"** to show LocalStorage persistence.

---

## 🔮 8. Future Scope

1. **Weighted A\* Search ($\epsilon$-Admissible)**: Incorporating user-adjustable heuristic weighting $f(n) = g(n) + w \cdot h(n)$ to demonstrate the trade-off between search speed and path optimality.
2. **8-Directional Diagonal Movement with Octile Distance**: Supporting diagonal transitions with corner-cutting prevention and Octile/Chebyshev heuristics.
3. **Dynamic Moving Obstacles (D\* Lite)**: Visualizing incremental heuristic replanning when obstacles move in real-time.
4. **Bi-Directional A\* Search**: Simultaneously expanding frontiers from both the Start and Goal nodes to meet in the middle.

---

## 📄 9. License

This project is developed for educational and academic submission purposes under the **MIT License**.
Students are encouraged to modify, extend, and present it for academic evaluations.
