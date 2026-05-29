import { useState, useCallback, useId } from 'react';
import { motion } from 'framer-motion';
import { useCalculator } from '../hooks/useCalculator';
import { useTheme } from '../hooks/useTheme';
import { useSound } from '../hooks/useSound';
import { Display } from './Display';
import { ButtonGrid } from './ButtonGrid';
import { HistoryPanel } from './HistoryPanel';
import { ThemeToggle } from './ThemeToggle';
import { SoundToggle } from './SoundToggle';
import { KeyIndicator } from './KeyIndicator';
import type { HistoryEntry } from '../types';

export function Calculator() {
  const { state, handleButton } = useCalculator();
  const { theme, toggle: toggleTheme } = useTheme();
  const { enabled: soundEnabled, toggle: toggleSound, playClick } = useSound();
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const uid = useId();

  const handlePress = useCallback((action: string) => {
    if (action === 'equals' && state.operator && !state.waitingForOperand && state.previousValue) {
      const expr = `${state.previousValue} ${state.operator} ${state.display} =`;
      const entry: HistoryEntry = {
        id: `${uid}-${Date.now()}`,
        expression: expr,
        result: '',
        timestamp: Date.now(),
      };
      setHistory(prev => [...prev.slice(-4), entry]);
    }
    handleButton(action);
  }, [state, handleButton, uid]);

  const handleSound = useCallback((t: 'number' | 'operator' | 'equals' | 'action') => {
    playClick(t);
  }, [playClick]);

  const handleHistorySelect = useCallback((value: string) => {
    handleButton('clear');
    for (const ch of value) {
      if (/[\d.]/.test(ch)) handleButton(ch);
    }
  }, [handleButton]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const displayHistory: HistoryEntry[] = history.map((h, idx) => ({
    ...h,
    result: idx === history.length - 1 && state.hasResult ? state.display : h.result || '?',
  }));

  return (
    <div style={{ position: 'relative' }}>
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring' as const, stiffness: 300, damping: 30, delay: 0.05 }}
        style={{
          width: '360px',
          background: 'transparent',
          borderRadius: '30px',
          border: 'none',
          boxShadow: 'none',
          overflow: 'visible',
          transition: 'background 0.3s ease',
        }}
      >
        <div
          style={{
            padding: '18px 20px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.65rem',
                fontFamily: 'var(--font-display)',
                color: 'var(--text-expression)',
                letterSpacing: '0.18em',
                fontWeight: 700,
                textTransform: 'uppercase',
              }}
            >
              Calc
            </span>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <SoundToggle enabled={soundEnabled} onToggle={toggleSound} />
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
          </div>
        </div>

        <Display
          value={state.display}
          expression={state.expression}
          operator={state.operator}
        />

        <div style={{ padding: '0 18px', marginBottom: '6px' }}>
          <div
            style={{
              height: '1px',
              background: 'var(--border-display)',
              transition: 'background 0.3s ease',
            }}
          />
        </div>

        <ButtonGrid
          onPress={handlePress}
          activeOperator={state.operator}
          onSound={handleSound}
        />

        <HistoryPanel
          entries={displayHistory}
          onSelect={handleHistorySelect}
          onClear={handleClearHistory}
        />
      </motion.div>

      <KeyIndicator />
    </div>
  );
}