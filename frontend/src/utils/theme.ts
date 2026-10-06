import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import React from 'react';

/**
 * Theme Context — Functional Paradigm
 * 
 * Demonstrates functional programming principles:
 * - Pure function for theme initialization (getInitialTheme)
 * - Side effects isolated in useEffect
 * - Immutable state via useState
 * - Context composition for dependency injection
 */

type Theme = 'light' | 'dark';

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * Pure function to determine the initial theme.
 * Checks localStorage first, then system preference, defaults to light.
 */
const getInitialTheme = (): Theme => {
  if (typeof window === 'undefined') return 'light';
  
  const stored = localStorage.getItem('theme');
  if (stored === 'dark' || stored === 'light') return stored;
  
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

/**
 * ThemeProvider — wraps the app to provide theme context.
 * Applies/removes the `.dark` class on the root <html> element.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Side effect: sync theme class to DOM and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const value: ThemeContextValue = {
    theme,
    toggleTheme,
    isDark: theme === 'dark',
  };

  return React.createElement(ThemeContext.Provider, { value }, children);
}

/**
 * useTheme hook — provides access to theme state and toggle.
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    return {
      theme: isDark ? 'dark' : 'light',
      toggleTheme: () => {
        if (typeof document !== 'undefined') {
          const root = document.documentElement;
          if (root.classList.contains('dark')) {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
          } else {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
          }
        }
      },
      isDark,
    };
  }
  return context;
}
