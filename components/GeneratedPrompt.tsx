import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from './Icons';
import { playClickSound } from '../utils/sound';

interface GeneratedPromptProps {
  prompt: string;
}

export const GeneratedPrompt: React.FC<GeneratedPromptProps> = ({ prompt }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    playClickSound();
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative p-4 bg-black/40 border border-[var(--color-border)] rounded-lg">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-lg bg-white/5 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:text-yellow-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
        title="Copy prompt"
        aria-label="Copy prompt to clipboard"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
      <p className="text-[var(--color-text-primary)] leading-relaxed pr-8 whitespace-pre-wrap">{prompt}</p>
    </div>
  );
};