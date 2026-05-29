import { motion } from 'framer-motion';
import type { Theme } from '../types';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={onToggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        background: 'var(--bg-btn-action)',
        border: '1px solid var(--border-btn)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--text-action)',
        fontSize: '15px',
        transition: 'background 0.2s ease',
        flexShrink: 0,
      }}
    >
      {isDark ? '☀' : '☾'}
    </motion.button>
  );
}