import React, { useRef, useLayoutEffect, useState } from 'react';
import { AiModel } from '../types';
import { playClickSound } from '../utils/sound';

interface ModelSelectorProps {
  selectedModel: AiModel;
  setSelectedModel: (model: AiModel) => void;
}

const models = Object.values(AiModel);

export const ModelSelector: React.FC<ModelSelectorProps> = ({ selectedModel, setSelectedModel }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [barStyle, setBarStyle] = useState({});

  useLayoutEffect(() => {
    const selectedIndex = models.findIndex(m => m === selectedModel);
    const selectedItem = itemRefs.current[selectedIndex];
    if (selectedItem && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const itemRect = selectedItem.getBoundingClientRect();
      setBarStyle({
        width: itemRect.width,
        left: itemRect.left - containerRect.left,
      });
    }
  }, [selectedModel]);

  const handleClick = (model: AiModel) => {
    setSelectedModel(model);
    playClickSound();
  };

  return (
    <div>
      <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">TARGET MODEL</label>
      <div ref={containerRef} className="relative flex justify-between bg-black/40 p-1 rounded-xl border border-[var(--color-border)]">
        <div 
          className="absolute top-1 bottom-1 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 transition-all duration-300 ease-in-out" 
          style={barStyle}
        />
        {models.map((model, index) => (
          <button
            key={model}
            ref={el => { itemRefs.current[index] = el; }}
            onClick={() => handleClick(model)}
            className={`relative z-10 w-full px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-0
              ${selectedModel === model
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
              }`}
          >
            {model}
          </button>
        ))}
      </div>
    </div>
  );
};