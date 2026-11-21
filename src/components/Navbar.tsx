import React from 'react';
import { Sun, Moon, Sparkles, Cpu, Menu } from 'lucide-react';
import { PageId, ThemeMode } from '../types';

interface NavbarProps {
  activePage: PageId;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onToggleSidebar?: () => void;
}

const pageTitles: Record<PageId, string> = {
  dashboard: 'Executive Dashboard',
  visualizer: 'Pathfinding Visualizer',
  comparison: 'Algorithm Benchmark & Comparison',
  learn: 'Educational Guide & Theory',
  'project-info': 'Project Documentation',
};

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  theme,
  onToggleTheme,
  onToggleSidebar,
}) => {
  return (
    <header className="sticky top-0 z-30 w-full h-16 border-b border-slate-200/80 dark:border-white/5 bg-white/70 dark:bg-navy-950/80 backdrop-blur-md transition-colors duration-200">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        {/* Left: Mobile Toggle & Page Title */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> AI Pathfinder
              </span>
              <span className="text-xs text-slate-400 dark:text-slate-500">/</span>
              <h1 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                {pageTitles[activePage]}
              </h1>
            </div>
          </div>
        </div>

        {/* Right: Engine Status, College Badge & Theme Toggle */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Status Badge */}
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Informed Search Engine Ready</span>
          </div>

          {/* Academic Badge */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-navy-850 border border-slate-200 dark:border-white/5">
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>CSE Mini-Project</span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-transparent hover:border-slate-200 dark:hover:border-white/10 transition-all duration-200"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-600 hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
