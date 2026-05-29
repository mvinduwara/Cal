import { useRef, useState, useCallback } from 'react';

export function useSound() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [enabled, setEnabled] = useState(false);

  function getCtx(): AudioContext {
    if (!ctxRef.current) ctxRef.current = new AudioContext();
    return ctxRef.current;
  }

  const playClick = useCallback((type: 'number' | 'operator' | 'equals' | 'action') => {
    if (!enabled) return;
    try {
      const ctx = getCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      const freqMap = { number: 440, operator: 520, equals: 620, action: 380 };
      osc.frequency.value = freqMap[type];
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  }, [enabled]);

  const toggle = useCallback(() => setEnabled(e => !e), []);

  return { enabled, toggle, playClick };
}