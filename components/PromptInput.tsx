import React from 'react';

interface PromptInputProps {
  userInput: string;
  setUserInput: (value: string) => void;
  disabled: boolean;
}

export const PromptInput: React.FC<PromptInputProps> = ({ userInput, setUserInput, disabled }) => {
  return (
    <div>
      <label htmlFor="prompt-input" className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">
        YOUR IDEA
      </label>
      <textarea
        id="prompt-input"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        disabled={disabled}
        rows={4}
        placeholder="e.g., A majestic lion wearing a crown, oil painting style..."
        className="w-full bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-0 focus:border-[var(--color-border-hover)] focus:bg-black/40 transition-all duration-300 resize-none disabled:opacity-50"
      />
    </div>
  );
};