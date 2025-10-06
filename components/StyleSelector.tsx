import React from 'react';
import { PromptStyle, PromptStyles } from '../types';
import { playClickSound } from '../utils/sound';

interface StyleSelectorProps {
  onSelectStyle: (style: PromptStyle) => void;
  disabled: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelectStyle, disabled }) => {
  const handleClick = (style: PromptStyle) => {
    onSelectStyle(style);
    playClickSound();
  };

  return (
    <div className="mt-6">
      <h3 className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">REFINE WITH A STYLE</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {PromptStyles.map((style) => (
          <button
            key={style}
            onClick={() => handleClick(style)}
            disabled={disabled}
            className="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-opacity-50 disabled:opacity-50 bg-black/20 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)] disabled:hover:border-[var(--color-border)] disabled:hover:text-[var(--color-text-secondary)]"
          >
            {style}
          </button>
        ))}
      </div>
    </div>
  );
};