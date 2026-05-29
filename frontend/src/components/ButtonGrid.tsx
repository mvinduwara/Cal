import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './Button';
import type { ButtonConfig, Operator } from '../types';

const BUTTONS: ButtonConfig[] = [
  { label: 'AC', type: 'action', action: 'clear' },
  { label: '±', type: 'action', action: 'toggle_sign' },
  { label: '%', type: 'action', action: 'percentage' },
  { label: '÷', type: 'operator', action: '÷' },
  { label: '7', type: 'number', action: '7' },
  { label: '8', type: 'number', action: '8' },
  { label: '9', type: 'number', action: '9' },
  { label: '×', type: 'operator', action: '×' },
  { label: '4', type: 'number', action: '4' },
  { label: '5', type: 'number', action: '5' },
  { label: '6', type: 'number', action: '6' },
  { label: '−', type: 'operator', action: '-' },
  { label: '1', type: 'number', action: '1' },
  { label: '2', type: 'number', action: '2' },
  { label: '3', type: 'number', action: '3' },
  { label: '+', type: 'operator', action: '+' },
  { label: '0', type: 'zero', action: '0', wide: true },
  { label: '.', type: 'number', action: 'decimal' },
  { label: '=', type: 'equals', action: 'equals' },
];

const KEY_MAP: Record<string, string> = {
  '0':'0','1':'1','2':'2','3':'3','4':'4','5':'5','6':'6','7':'7','8':'8','9':'9',
  '+':'+','-':'-','*':'×','/':'÷','x':'×',
  'Enter':'equals','=':'equals',
  'Backspace':'backspace','Delete':'clear','Escape':'clear',
  '.':'decimal',',':'decimal','%':'percentage',
};

interface ButtonGridProps {
  onPress: (action: string) => void;
  activeOperator: Operator;
  onSound?: (t: 'number' | 'operator' | 'equals' | 'action') => void;
}

export function ButtonGrid({ onPress, activeOperator, onSound }: ButtonGridProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      const mapped = KEY_MAP[e.key];
      if (mapped) { e.preventDefault(); onPress(mapped); }
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onPress]);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '10px',
        padding: '0 18px 22px',
      }}
    >
      {BUTTONS.map((btn, i) => (
        <motion.div
          key={`${btn.action}-${i}`}
          initial={{ opacity: 0, scale: 0.85, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ type: 'spring' as const, stiffness: 400, damping: 28, delay: i * 0.025 }}
          style={{ gridColumn: btn.wide ? 'span 2' : 'span 1', display: 'contents' }}
        >
          <Button
            label={btn.label}
            type={btn.type}
            action={btn.action}
            wide={btn.wide}
            onPress={onPress}
            isActive={btn.type === 'operator' && btn.action === activeOperator}
            onSound={onSound}
          />
        </motion.div>
      ))}
    </div>
  );
}