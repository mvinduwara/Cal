import { motion } from 'framer-motion';

interface SoundToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export function SoundToggle({ enabled, onToggle }: SoundToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      aria-label={enabled ? 'Mute sounds' : 'Enable sounds'}
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.08 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '50%',
        background: enabled ? 'rgba(var(--accent-rgb),0.15)' : 'var(--bg-btn-action)',
        border: `1px solid ${enabled ? 'rgba(var(--accent-rgb),0.3)' : 'var(--border-btn)'}`,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: enabled ? 'var(--accent-light)' : 'var(--text-action)',
        fontSize: '13px',
        transition: 'all 0.2s ease',
        flexShrink: 0,
      }}
    >
      {enabled ? '♪' : '♩'}
    </motion.button>
  );
}