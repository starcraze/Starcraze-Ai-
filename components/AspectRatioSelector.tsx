import React, { useRef, useLayoutEffect, useState } from 'react';
import { AspectRatio } from '../types';
import { playClickSound } from '../utils/sound';

interface AspectRatioSelectorProps {
  aspectRatio: AspectRatio;
  setAspectRatio: (ratio: AspectRatio) => void;
  disabled: boolean;
}

const ratios = Object.values(AspectRatio);

export const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ aspectRatio, setAspectRatio, disabled }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [barStyle, setBarStyle] = useState({});

  useLayoutEffect(() => {
    const selectedIndex = ratios.findIndex(r => r === aspectRatio);
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const itemRect = selectedItem.getBoundingClientRect();
        setBarStyle({
            width: itemRect.width,
            left: itemRect.left - containerRect.left,
        });
    }
  }, [aspectRatio]);

  const handleClick = (ratio: AspectRatio) => {
    if (!disabled) {
      setAspectRatio(ratio);
      playClickSound();
    }
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">ASPECT RATIO</label>
      <div ref={containerRef} className="relative flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-between bg-black/40 p-1 rounded-xl border border-[var(--color-border)]">
        <div 
          className="absolute top-1 bottom-1 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 transition-all duration-300 ease-in-out" 
          style={barStyle}
        />
        {ratios.map((ratio, index) => (
          <button
            key={ratio}
            ref={el => { itemRefs.current[index] = el; }}
            onClick={() => handleClick(ratio)}
            disabled={disabled}
            className={`relative z-10 w-full text-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-0 disabled:opacity-50
              ${aspectRatio === ratio
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
          >
            {ratio.split(' ')[0]}
          </button>
        ))}
      </div>
    </div>
  );
};