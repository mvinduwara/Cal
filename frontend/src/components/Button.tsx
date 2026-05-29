import { useRef } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  label: string;
  type: 'number' | 'operator' | 'action' | 'equals' | 'zero';
  action: string;
  wide?: boolean;
  onPress: (action: string) => void;
  isActive?: boolean;
  soundType?: 'number' | 'operator' | 'equals' | 'action';
  onSound?: (t: 'number' | 'operator' | 'equals' | 'action') => void;
}

const baseStyles: Record<string, React.CSSProperties> = {
  number: { background: 'var(--bg-btn-number)', color: 'var(--text-primary)' },
  zero: { background: 'var(--bg-btn-number)', color: 'var(--text-primary)', justifyContent: 'flex-start', paddingLeft: '26px' },
  action: { background: 'var(--bg-btn-action)', color: 'var(--text-action)' },
  operator: { background: 'var(--bg-btn-operator)', color: 'var(--text-operator)' },
  equals: { background: 'var(--bg-btn-equals)', color: '#ffffff', boxShadow: 'var(--shadow-equals)' },
};

export function Button({ label, type, action, wide, onPress, isActive, onSound }: ButtonProps) {
  const btnRef = useRef<HTMLDivElement>(null);

  function handleClick() {
    createRipple();
    const st = type === 'equals' ? 'equals' : type === 'operator' ? 'operator' : type === 'action' ? 'action' : 'number';
    onSound?.(st);
    onPress(action);
  }

  function createRipple() {
    const el = btnRef.current;
    if (!el) return;
    const span = document.createElement('span');
    span.style.cssText = `
      position:absolute;width:10px;height:10px;border-radius:50%;
      top:50%;left:50%;
      background:rgba(255,255,255,${type === 'equals' ? '0.25' : '0.12'});
      transform:translate(-50%,-50%) scale(0);
      animation:ripple 0.55s ease-out forwards;
      pointer-events:none;
    `;
    el.appendChild(span);
    setTimeout(() => span.remove(), 600);
  }

  const isOperatorActive = type === 'operator' && isActive;

  return (
    <motion.div
      ref={btnRef}
      onClick={handleClick}
      role="button"
      aria-label={label}
      tabIndex={0}
      onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && handleClick()}
      whileTap={{ scale: type === 'equals' ? 0.94 : 0.91 }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        height: '74px',
        gridColumn: wide ? 'span 2' : 'span 1',
        borderRadius: '16px',
        border: `1px solid ${isOperatorActive ? 'rgba(var(--accent-rgb),0.4)' : 'var(--border-btn)'}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: type === 'action' ? '1rem' : type === 'operator' ? '1.45rem' : '1.3rem',
        fontWeight: type === 'operator' ? 400 : 500,
        fontFamily: type === 'number' || type === 'zero' ? 'var(--font-mono)' : 'var(--font-display)',
        letterSpacing: type === 'number' || type === 'zero' ? '-0.01em' : '0',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        userSelect: 'none',
        WebkitTapHighlightColor: 'transparent',
        transition: 'background 0.15s ease, border-color 0.2s ease, box-shadow 0.2s ease',
        ...baseStyles[type],
        ...(isOperatorActive ? {
          background: 'var(--bg-btn-operator-hover)',
          boxShadow: '0 0 0 1px rgba(var(--accent-rgb),0.3)',
        } : {}),
      }}
    >
      {label}
    </motion.div>
  );
}