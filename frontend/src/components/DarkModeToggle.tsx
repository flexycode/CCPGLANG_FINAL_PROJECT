import { useTheme } from '../utils/theme';
import { Sun, Moon } from 'lucide-react';

/**
 * DarkModeToggle — Animated sun/moon toggle button.
 * 
 * Functional component using the useTheme hook.
 * Features a smooth rotation + scale animation on toggle.
 */
export default function DarkModeToggle({ className = '' }: { className?: string }) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer
        ${isDark
          ? 'bg-white/10 hover:bg-white/20 text-amber-300'
          : 'bg-black/5 hover:bg-black/10 text-gray-600'
        } ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      <div
        className="transition-all duration-500 ease-in-out"
        style={{
          transform: isDark ? 'rotate(360deg) scale(1)' : 'rotate(0deg) scale(1)',
        }}
      >
        {isDark ? <Moon size={18} /> : <Sun size={18} />}
      </div>
    </button>
  );
}
