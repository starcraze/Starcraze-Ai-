import React, { useRef, useLayoutEffect, useState } from 'react';
import { PromptLength } from '../types';
import { playClickSound } from '../utils/sound';

interface LengthSelectorProps {
  promptLength: PromptLength;
  setPromptLength: (length: PromptLength) => void;
  disabled: boolean;
}

const lengths = Object.values(PromptLength);

export const LengthSelector: React.FC<LengthSelectorProps> = ({ promptLength, setPromptLength, disabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [barStyle, setBarStyle] = useState({});

  useLayoutEffect(() => {
    const selectedIndex = lengths.findIndex(l => l === promptLength);
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        setBarStyle({
            width: itemRect.width,
            left: itemRect.left - containerRect.left,
        });
    }
  }, [promptLength]);

  const handleClick = (length: PromptLength) => {
    if (!disabled) {
        setPromptLength(length);
        playClickSound();
    }
  };

  return (
    <div className="mt-6 md:mt-0">
      <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">PROMPT LENGTH</label>
      <div ref={containerRef} className="relative flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between bg-black/40 p-1 rounded-xl border border-[var(--color-border)]">
         <div 
          className="absolute top-1 bottom-1 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 transition-all duration-300 ease-in-out" 
          style={barStyle}
        />
        {lengths.map((length, index) => (
          <button
            key={length}
            ref={el => { itemRefs.current[index] = el; }}
            onClick={() => handleClick(length)}
            disabled={disabled}
            className={`relative z-10 w-full text-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-0 disabled:opacity-50
              ${promptLength === length
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
          >
            {length.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};