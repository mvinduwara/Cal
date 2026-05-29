import { useRef, useEffect, useState } from 'react';
import type { Operator } from '../types';

interface DisplayProps {
  value: string;
  expression: string;
  operator: Operator;
}

function fitFontSize(value: string): string {
  const len = value.replace('-', '').length;
  if (len <= 6) return '3.8rem';
  if (len <= 9) return '2.9rem';
  if (len <= 12) return '2.2rem';
  return '1.7rem';
}

const OPERATOR_COLORS: Record<string, string> = {
  '+': '#34c97e',
  '-': '#f06292',
  '×': '#ffb74d',
  '÷': '#64b5f6',
};

export function Display({ value, expression, operator }: DisplayProps) {
  const valueRef = useRef<HTMLDivElement>(null);
  const prevValue = useRef(value);
  const prevNumeric = useRef(parseFloat(value));
  const [animClass, setAnimClass] = useState('display-up');

  useEffect(() => {
    if (prevValue.current === value) return;
    const prev = parseFloat(prevValue.current);
    const next = parseFloat(value);
    const dir = next >= prev ? 'display-up' : 'display-down';
    setAnimClass('');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setAnimClass(dir);
        prevValue.current = value;
        prevNumeric.current = next;
      });
    });
  }, [value]);

  const isError = value === 'Error';
  const operatorColor = operator ? OPERATOR_COLORS[operator] : null;

  return (
    <div
      style={{
        padding: '24px 28px 12px',
        minHeight: '148px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: '8px',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {operator && (
        <div
          style={{
            position: 'absolute',
            top: '20px',
            left: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <div
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: operatorColor || 'var(--accent)',
              boxShadow: `0 0 8px ${operatorColor || 'var(--accent)'}`,
              animation: 'glowPulse 2s ease infinite',
            }}
          />
          <span
            style={{
              fontSize: '0.7rem',
              fontFamily: 'var(--font-display)',
              color: operatorColor || 'var(--accent-light)',
              opacity: 0.8,
              letterSpacing: '0.06em',
            }}
          >
            {operator === '+' ? 'ADD' : operator === '-' ? 'SUB' : operator === '×' ? 'MUL' : 'DIV'}
          </span>
        </div>
      )}

      <div
        key={expression}
        className="expression-animate"
        style={{
          fontSize: '0.73rem',
          fontFamily: 'var(--font-display)',
          color: 'var(--text-expression)',
          letterSpacing: '0.04em',
          minHeight: '18px',
          textAlign: 'right',
          width: '100%',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {expression || '\u00A0'}
      </div>

      <div
        ref={valueRef}
        className={animClass}
        style={{
          fontSize: fitFontSize(value),
          fontFamily: 'var(--font-display)',
          fontWeight: 300,
          color: isError ? '#ff6b6b' : 'var(--text-display)',
          letterSpacing: '-0.025em',
          textAlign: 'right',
          width: '100%',
          lineHeight: 1.1,
          transition: 'font-size 0.15s ease, color 0.2s ease',
          wordBreak: 'break-all',
          fontVariantNumeric: 'normal',
          fontFeatureSettings: '"zero" 0',
        }}
      >
        {value}
      </div>
    </div>
  );
}