import React from 'react';

interface NegativePromptProps {
  value: string;
  onChange: (value: string) => void;
  show: boolean;
  disabled: boolean;
}

export const NegativePrompt: React.FC<NegativePromptProps> = ({ value, onChange, show, disabled }) => {
  return (
    <div className={`transition-all duration-500 ease-in-out overflow-hidden ${show ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0'}`}>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        rows={2}
        placeholder="e.g., blurry, text, watermark, extra fingers..."
        className="w-full bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg p-3 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-0 focus:border-[var(--color-border-hover)] focus:bg-black/40 transition-all duration-300 resize-none disabled:opacity-50"
        aria-hidden={!show}
        tabIndex={show ? 0 : -1}
      />
    </div>
  );
};
