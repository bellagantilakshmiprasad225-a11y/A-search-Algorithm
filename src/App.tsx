import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageId, ToastMessage } from './types';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { Toast } from './components/Toast';
import { Dashboard } from './pages/Dashboard';
import { Visualizer } from './pages/Visualizer';
import { Comparison } from './pages/Comparison';
import { Learn } from './pages/Learn';
import { ProjectInfo } from './pages/ProjectInfo';

export const App: React.FC = () => {
  const [theme, toggleTheme] = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Hash-based routing to support browser history without extra router bloat
  const getPageFromHash = (): PageId => {
    const hash = window.location.hash.replace('#', '') as PageId;
    const validPages: PageId[] = ['dashboard', 'visualizer', 'comparison', 'learn', 'project-info'];
    return validPages.includes(hash) ? hash : 'dashboard';
  };

  const [activePage, setActivePage] = useState<PageId>(getPageFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setActivePage(getPageFromHash());
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectPage = (page: PageId) => {
    setActivePage(page);
    window.location.hash = page;
  };

  // Initial greeting toast on first load
  useEffect(() => {
    const timer = setTimeout(() => {
      addToast({
        id: 'init-toast',
        type: 'info',
        title: 'AI Pathfinding System Online',
        description: 'A*, Dijkstra & BFS engines ready. 10 unit tests verified.',
        duration: 4000,
      });
    }, 600);

    return () => clearTimeout(timer);
  }, []);

  const addToast = (toast: ToastMessage) => {
    setToasts((prev) => [...prev, toast]);
    if (toast.duration) {
      setTimeout(() => {
        dismissToast(toast.id);
      }, toast.duration);
    }
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleSelectPage} />;
      case 'visualizer':
        return <Visualizer />;
      case 'comparison':
        return <Comparison />;
      case 'learn':
        return <Learn />;
      case 'project-info':
        return <ProjectInfo />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {/* Navigation Sidebar */}
      <Sidebar
        activePage={activePage}
        onSelectPage={handleSelectPage}
        isOpen={sidebarOpen}
        onCloseMobile={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="lg:pl-72 flex flex-col flex-1 min-w-0">
        <Navbar
          activePage={activePage}
          theme={theme}
          onToggleTheme={toggleTheme}
          onToggleSidebar={() => setSidebarOpen(true)}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default App;
