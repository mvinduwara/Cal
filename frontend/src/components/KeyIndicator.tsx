import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const KEY_LABELS: Record<string, string> = {
  'Enter': '⏎', 'Backspace': '⌫', 'Escape': 'ESC', 'Delete': 'DEL',
  '*': '×', '/': '÷',
};

export function KeyIndicator() {
  const [key, setKey] = useState<string | null>(null);
  const [id, setId] = useState(0);

  const handleKey = useCallback((e: KeyboardEvent) => {
    const relevant = /^[0-9+\-*/.%]$/.test(e.key) || ['Enter','Backspace','Escape','Delete'].includes(e.key);
    if (!relevant) return;
    setKey(KEY_LABELS[e.key] ?? e.key);
    setId(n => n + 1);
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  return (
    <AnimatePresence>
      {key && (
        <motion.div
          key={id}
          initial={{ opacity: 0, y: 4, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.12 }}
          onAnimationComplete={() => setTimeout(() => setKey(null), 600)}
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'var(--bg-key-indicator)',
            border: '1px solid var(--border-btn)',
            borderRadius: '8px',
            padding: '4px 10px',
            fontSize: '0.72rem',
            fontFamily: 'var(--font-mono)',
            color: 'var(--text-secondary)',
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          {key}
        </motion.div>
      )}
    </AnimatePresence>
  );
}