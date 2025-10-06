import React, { useRef, useLayoutEffect, useState } from 'react';
import { PromptMode } from '../types';
import { playClickSound } from '../utils/sound';

interface PromptModeSelectorProps {
  promptMode: PromptMode;
  setPromptMode: (mode: PromptMode) => void;
  disabled: boolean;
}

const modes = Object.values(PromptMode);

export const PromptModeSelector: React.FC<PromptModeSelectorProps> = ({ promptMode, setPromptMode, disabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [barStyle, setBarStyle] = useState({});

  useLayoutEffect(() => {
    const selectedIndex = modes.findIndex(m => m === promptMode);
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        setBarStyle({
            width: itemRect.width,
            left: itemRect.left - containerRect.left,
        });
    }
  }, [promptMode]);

  const handleClick = (mode: PromptMode) => {
    if (!disabled) {
      setPromptMode(mode);
      playClickSound();
    }
  };

  return (
    <div className="mb-6">
      <div ref={containerRef} className="relative flex justify-center gap-2 bg-black/40 p-1 rounded-xl border border-[var(--color-border)] max-w-xs mx-auto">
        <div 
          className="absolute top-1 bottom-1 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 transition-all duration-300 ease-in-out" 
          style={barStyle}
        />
        {modes.map((mode, index) => (
          <button
            key={mode}
            ref={el => { itemRefs.current[index] = el; }}
            onClick={() => handleClick(mode)}
            disabled={disabled}
            className={`relative z-10 w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-0 disabled:opacity-50
              ${promptMode === mode
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
          >
            {mode} Mode
          </button>
        ))}
      </div>
    </div>
  );
};