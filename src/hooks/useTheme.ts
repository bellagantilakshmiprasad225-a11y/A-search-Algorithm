import { useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { ThemeMode } from '../types';

export function useTheme(): [ThemeMode, () => void] {
  const [theme, setTheme] = useLocalStorage<ThemeMode>('pathfinder-theme', 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  return [theme, toggleTheme];
}
