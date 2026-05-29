import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { HistoryEntry } from '../types';

interface HistoryPanelProps {
  entries: HistoryEntry[];
  onSelect: (value: string) => void;
  onClear: () => void;
}

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
  return `${Math.floor(diff / 3600000)}h ago`;
}

export function HistoryPanel({ entries, onSelect, onClear }: HistoryPanelProps) {
  const selectedRef = useRef<string | null>(null);

  if (entries.length === 0) return null;

  return (
    <div
      style={{
        borderTop: '1px solid var(--border-display)',
        padding: '14px 18px 16px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
        <span
          style={{
            fontSize: '0.62rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-expression)',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 700,
          }}
        >
          History
        </span>
        <button
          onClick={onClear}
          style={{
            fontSize: '0.62rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-expression)',
            letterSpacing: '0.08em',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: '2px 6px',
            borderRadius: '6px',
            transition: 'color 0.15s ease, background 0.15s ease',
          }}
          onMouseEnter={e => {
            (e.target as HTMLElement).style.color = '#ff6b6b';
            (e.target as HTMLElement).style.background = 'rgba(255,107,107,0.08)';
          }}
          onMouseLeave={e => {
            (e.target as HTMLElement).style.color = 'var(--text-expression)';
            (e.target as HTMLElement).style.background = 'transparent';
          }}
        >
          Clear
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <AnimatePresence initial={false}>
          {[...entries].reverse().map((entry) => (
            <motion.button
              key={entry.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10, height: 0, marginBottom: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 35 }}
              onClick={() => {
                selectedRef.current = entry.id;
                onSelect(entry.result);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '7px 10px',
                borderRadius: '12px',
                width: '100%',
                transition: 'background 0.15s ease',
                gap: '8px',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-history-hover)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', minWidth: 0 }}>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-history-expr)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '180px',
                  }}
                >
                  {entry.expression}
                </span>
                <span
                  style={{
                    fontSize: '0.58rem',
                    fontFamily: 'var(--font-display)',
                    color: 'var(--text-expression)',
                    opacity: 0.6,
                    marginTop: '1px',
                  }}
                >
                  {timeAgo(entry.timestamp)}
                </span>
              </div>
              <span
                style={{
                  fontSize: '0.88rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-history-result)',
                  fontWeight: 400,
                  flexShrink: 0,
                }}
              >
                {entry.result}
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}