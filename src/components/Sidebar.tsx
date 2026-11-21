import React from 'react';
import {
  LayoutDashboard,
  Compass,
  BarChart3,
  BookOpen,
  Info,
  Layers,
  ChevronRight,
  X
} from 'lucide-react';
import { PageId } from '../types';

interface SidebarProps {
  activePage: PageId;
  onSelectPage: (page: PageId) => void;
  isOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ElementType;
  badge?: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'System overview & metrics',
  },
  {
    id: 'visualizer',
    label: 'Visualizer',
    icon: Compass,
    badge: 'Core',
    description: 'Interactive pathfinding',
  },
  {
    id: 'comparison',
    label: 'Comparison',
    icon: BarChart3,
    badge: 'Benchmark',
    description: 'A* vs Dijkstra vs BFS',
  },
  {
    id: 'learn',
    label: 'Learn A*',
    icon: BookOpen,
    description: 'Theory, proofs & viva FAQs',
  },
  {
    id: 'project-info',
    label: 'Project Info',
    icon: Info,
    description: 'Architecture & documentation',
  },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activePage,
  onSelectPage,
  isOpen,
  onCloseMobile,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 flex flex-col border-r border-slate-200/80 dark:border-white/5 bg-slate-50 dark:bg-navy-900 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200/80 dark:border-white/5">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-500/20">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  A* Explorer
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Pathfinding System</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Algorithm quick tag */}
        <div className="px-5 py-3 border-b border-slate-200/60 dark:border-white/5 bg-slate-100/50 dark:bg-navy-950/40">
          <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">
            Supported Algorithms
          </p>
          <div className="flex flex-wrap gap-1.5">
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30">
              A* Search
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 border border-blue-500/30">
              Dijkstra
            </span>
            <span className="px-2 py-0.5 text-[10px] font-semibold rounded-md bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border border-indigo-500/30">
              BFS
            </span>
          </div>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectPage(item.id);
                  onCloseMobile();
                }}
                className={`w-full group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-blue-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-1.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-500 dark:text-cyan-300'
                        : 'text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-left">
                    <span className="block leading-none">{item.label}</span>
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-400">
                      {item.description}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-cyan-500 text-slate-950 font-bold'
                          : 'bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer Academic Info */}
        <div className="p-4 border-t border-slate-200/80 dark:border-white/5 bg-slate-100/50 dark:bg-navy-950/40">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>CSE Mini-Project</span>
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/5">
              v1.0.0
            </span>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">
            Artificial Intelligence &amp; Search
          </p>
        </div>
      </aside>
    </>
  );
};
