import React, { useState } from 'react';
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Code2,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Workflow,
  Compass,
  Cpu,
  ShieldCheck,
  Bot,
  Car,
  Gamepad2,
  Network,
} from 'lucide-react';
import {
  A_STAR_PSEUDOCODE,
  WORKED_EXAMPLE_STEPS,
  FLOWCHART_STEPS,
  VIVA_QUESTIONS,
} from '../data/learningContent';

export const Learn: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [currentTraceStep, setCurrentTraceStep] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(A_STAR_PSEUDOCODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const categories = ['All', 'Core Concepts', 'Mathematical Foundation', 'Practical Implementation', 'Complexity'];

  const filteredFaqs =
    selectedCategory === 'All'
      ? VIVA_QUESTIONS
      : VIVA_QUESTIONS.filter((q) => q.category === selectedCategory);

  const traceStep = WORKED_EXAMPLE_STEPS[currentTraceStep];

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-5xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-cyan-500" />
            A* Search Algorithm Theory &amp; Viva Guide
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            In-depth academic reference covering informed search, heuristic mathematical proofs, worked traces, and college viva questions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>AI Syllabus Companion</span>
          </span>
        </div>
      </div>

      {/* Section 1: Introduction to Informed Search */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              1. Introduction to Informed (Heuristic) Search
            </h3>
            <p className="text-xs text-slate-400">Overcoming the limitations of blind exploration</p>
          </div>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          In Artificial Intelligence, search algorithms are divided into <strong>uninformed (blind)</strong> search
          and <strong>informed (heuristic)</strong> search. Uninformed algorithms such as Breadth-First Search (BFS)
          and Depth-First Search (DFS) systematically explore every branch without knowing whether a path leads toward
          the destination. In large state spaces, this results in combinatorial explosion ($O(b^d)$ expansions).
        </p>

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          <strong>A* (A-Star)</strong> is a best-first graph traversal algorithm developed in 1968 by Peter Hart, Nils
          Nilsson, and Bertram Raphael at Stanford Research Institute. By augmenting path costs with an estimated
          distance to the goal—a <em>heuristic function</em> $h(n)$—A* focuses search effort along the most promising
          corridor while strictly preserving path optimality.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-navy-950/70 border border-slate-200 dark:border-white/5 space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Uninformed: BFS</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explores uniformly in concentric circles like ripples in a pond. Guarantees minimum steps on unit grids, but visits large numbers of irrelevant nodes.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-navy-950/70 border border-slate-200 dark:border-white/5 space-y-1">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Uniform Cost: Dijkstra</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Expands in order of cumulative cost $g(n)$. Guarantees shortest path on weighted graphs, but explores in all directions without goal awareness.
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-navy-950/70 border border-cyan-500/30 bg-cyan-500/5 space-y-1">
            <h4 className="text-xs font-bold text-cyan-400">Informed: A* Search</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Combines exact cost $g(n)$ with goal distance $h(n)$. Prunes irrelevant state branches, yielding optimal paths with minimal node expansions.
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Mathematical Formulation */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              2. The Evaluation Function: f(n) = g(n) + h(n)
            </h3>
            <p className="text-xs text-slate-400">Balancing past cost with future expectation</p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-navy-950/90 border border-white/10 text-center space-y-2">
          <p className="font-mono text-xl sm:text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
            f(n) = g(n) + h(n)
          </p>
          <p className="text-xs text-slate-400 max-w-lg mx-auto">
            Estimated Total Cost through Node n = Exact Cost from Start to n + Estimated Cost from n to Goal
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          <div className="space-y-1 p-3 rounded-xl bg-slate-100 dark:bg-navy-950/40 border border-slate-200 dark:border-white/5">
            <span className="font-mono text-sm font-bold text-emerald-400">g(n)</span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Actual Path Cost</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The exact accumulated edge weight from the start node to node $n$. Prevents the algorithm from straying too far into speculative paths.
            </p>
          </div>
          <div className="space-y-1 p-3 rounded-xl bg-slate-100 dark:bg-navy-950/40 border border-slate-200 dark:border-white/5">
            <span className="font-mono text-sm font-bold text-cyan-400">h(n)</span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Heuristic Estimate</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Estimated distance from node $n$ to the goal. Provides directional pulling force toward the destination. Must never overestimate true cost.
            </p>
          </div>
          <div className="space-y-1 p-3 rounded-xl bg-slate-100 dark:bg-navy-950/40 border border-slate-200 dark:border-white/5">
            <span className="font-mono text-sm font-bold text-amber-400">f(n)</span>
            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">Total Ranking Cost</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              The priority key inserted into the Min-Priority Queue. The node with smallest $f(n)$ is dequeued first at every search step.
            </p>
          </div>
        </div>

        {/* Admissibility & Consistency Box */}
        <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20 space-y-2 text-xs">
          <h4 className="font-bold text-indigo-300 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            Admissibility and Monotonicity (Consistency)
          </h4>
          <ul className="space-y-1.5 text-slate-300 leading-relaxed list-disc list-inside">
            <li>
              <strong>Admissibility ($h(n) \le h^*(n)$):</strong> A heuristic is admissible if it never overestimates the true cost to reach the goal. Admissibility guarantees A* will always return an optimal path.
            </li>
            <li>
              <strong>Consistency ($h(n) \le c(n, a, n') + h(n')$):</strong> The heuristic satisfies the triangle inequality. If consistent, f-scores along any path are monotonically non-decreasing, ensuring nodes are expanded once and never need reopening.
            </li>
          </ul>
        </div>
      </section>

      {/* Section 3: Step-by-Step Worked Trace Example */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                3. Concrete Step-by-Step Worked Trace Example
              </h3>
              <p className="text-xs text-slate-400">
                Interactive walk-through from Start (0,0) to Goal (2,2) with obstacle at (0,2)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setCurrentTraceStep((s) => Math.max(0, s - 1))}
              disabled={currentTraceStep === 0}
              className="px-2.5 py-1 rounded-lg bg-navy-950 text-slate-300 hover:bg-white/10 disabled:opacity-40 border border-white/5"
            >
              Back
            </button>
            <span className="font-mono text-cyan-400 px-1">
              {currentTraceStep + 1} / {WORKED_EXAMPLE_STEPS.length}
            </span>
            <button
              onClick={() =>
                setCurrentTraceStep((s) => Math.min(WORKED_EXAMPLE_STEPS.length - 1, s + 1))
              }
              disabled={currentTraceStep === WORKED_EXAMPLE_STEPS.length - 1}
              className="px-2.5 py-1 rounded-lg bg-navy-950 text-slate-300 hover:bg-white/10 disabled:opacity-40 border border-white/5"
            >
              Next
            </button>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-navy-950 border border-white/10 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <span className="font-mono text-sm font-bold text-cyan-400">
              Step {traceStep.step}: {traceStep.evaluatedNode}
            </span>
            <div className="flex gap-3 text-xs font-mono">
              <span className="text-emerald-400">g = {traceStep.g}</span>
              <span className="text-cyan-400">h = {traceStep.h}</span>
              <span className="text-amber-400 font-bold">f = {traceStep.f}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{traceStep.action}</p>

          <div className="p-2.5 rounded-xl bg-navy-900/80 border border-white/5 font-mono text-xs text-slate-400">
            <span className="text-slate-500 mr-2">Open Set Frontier:</span>
            <span className="text-cyan-300">{traceStep.openSetContent}</span>
          </div>
        </div>
      </section>

      {/* Section 4: Pseudocode */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                4. A* Algorithm Formal Pseudocode
              </h3>
              <p className="text-xs text-slate-400">
                Standard priority queue implementation with relaxation logic
              </p>
            </div>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-slate-100 dark:bg-navy-950 hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5 transition-all"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>

        <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-white/10 bg-navy-950 p-4 font-mono text-xs text-slate-200 leading-relaxed overflow-x-auto">
          <pre>{A_STAR_PSEUDOCODE}</pre>
        </div>
      </section>

      {/* Section 5: Algorithm Flowchart Pipeline */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Workflow className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              5. Algorithm Execution Flowchart Pipeline
            </h3>
            <p className="text-xs text-slate-400">The cyclical state loop of A* graph search</p>
          </div>
        </div>

        <div className="space-y-2 pt-1">
          {FLOWCHART_STEPS.map((step, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-3 rounded-xl bg-slate-100/70 dark:bg-navy-950/60 border border-slate-200 dark:border-white/5 hover:border-cyan-500/30 transition-all"
            >
              <div className="w-6 h-6 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-mono font-bold text-xs flex-shrink-0 mt-0.5">
                {idx + 1}
              </div>
              <div className="space-y-0.5">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">{step.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6: Complexity, Pros & Cons */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Complexity Analysis &amp; Trade-offs
            </h3>
            <p className="text-xs text-slate-400">Theoretical bounds and practical constraints</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-navy-950 border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-cyan-400">Time Complexity: O(b^d)</h4>
            <p className="text-slate-400 leading-relaxed">
              In the worst case where the heuristic is uninformative ($h(n) = 0$), A* degrades to Dijkstra with $O(b^d)$, where $b$ is the branching factor and $d$ is solution depth. With an accurate heuristic, the <em>effective branching factor</em> $b^*$ approaches 1, leading to linear time.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-navy-950 border border-white/5 space-y-2 text-xs">
            <h4 className="font-bold text-rose-400">Space Complexity: O(b^d)</h4>
            <p className="text-slate-400 leading-relaxed">
              A* must keep all generated nodes in memory (in Open and Closed sets) to guarantee cycle checking and optimal cost tracking. Consequently, <strong>memory is usually exhausted long before processor time</strong>. Memory-bounded variants include IDA* and SMA*.
            </p>
          </div>
        </div>
      </section>

      {/* Section 7: Real-World Applications */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              7. Real-World Applications of A* Search
            </h3>
            <p className="text-xs text-slate-400">Industrial and consumer software systems powered by A*</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              title: 'GPS & Road Navigation',
              icon: Car,
              desc: 'Used in routing engines (Google Maps, OSRM) with highway hierarchies for turn-by-turn routing.',
            },
            {
              title: 'Autonomous Robotics',
              icon: Bot,
              desc: 'ROS (Robot Operating System) navigation stack uses A* for global trajectory path generation.',
            },
            {
              title: 'Video Game AI',
              icon: Gamepad2,
              desc: 'RTS and open-world games (StarCraft, Unity NavMesh) use A* on navmeshes for troop steering.',
            },
            {
              title: 'Network Packet Routing',
              icon: Network,
              desc: 'Telecommunications routing protocols find lowest latency paths through dynamic network nodes.',
            },
          ].map((app, i) => {
            const Icon = app.icon;
            return (
              <div key={i} className="p-4 rounded-2xl bg-navy-950 border border-white/5 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-bold text-xs text-white">{app.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed">{app.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Section 8: College Viva Exam Questions & Answers */}
      <section className="glass-card p-6 sm:p-7 rounded-3xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                8. Frequently Asked Questions for College Viva Examinations
              </h3>
              <p className="text-xs text-slate-400">
                15 curated questions with concise and in-depth model answers
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyan-500/20 text-cyan-600 dark:text-cyan-300 border border-cyan-500/40 font-semibold'
                    : 'bg-slate-100 dark:bg-navy-950 text-slate-500 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-2 pt-2">
          {filteredFaqs.map((faq, index) => {
            const isOpen = expandedFaq === index;
            return (
              <div
                key={faq.question}
                className="rounded-2xl border border-slate-200/80 dark:border-white/5 bg-slate-50/50 dark:bg-navy-950/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isOpen ? null : index)}
                  className="w-full text-left p-4 flex items-center justify-between gap-3 hover:bg-slate-100 dark:hover:bg-white/[0.02] transition-colors"
                >
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                      {faq.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      {faq.question}
                    </h4>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="p-4 pt-1 border-t border-slate-200/60 dark:border-white/5 space-y-2 text-xs leading-relaxed animate-in fade-in duration-150">
                    <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-900 dark:text-cyan-200 font-medium">
                      <strong>Direct Answer: </strong>
                      {faq.shortAnswer}
                    </div>
                    <div className="text-slate-600 dark:text-slate-300">
                      <strong>In-Depth Academic Explanation: </strong>
                      {faq.detailedAnswer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
