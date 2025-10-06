import React from 'react';
import { playClickSound } from '../utils/sound';

interface ActionButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ onClick, disabled, children }) => {
  const handleClick = () => {
    if (!disabled) {
      playClickSound();
      onClick();
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className="relative inline-flex items-center justify-center px-8 py-3 overflow-hidden font-bold text-white transition-all duration-300 ease-in-out rounded-xl bg-gradient-to-r from-[#1A221A] to-[#121812] group hover:scale-105 disabled:scale-100 disabled:shadow-none disabled:opacity-60 disabled:cursor-not-allowed border border-[var(--color-border-hover)] shadow-lg shadow-[var(--color-shadow)] hover:shadow-[var(--color-shadow-heavy)]"
      aria-disabled={disabled}
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-[var(--color-primary)] via-yellow-200 to-[var(--color-primary)] opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"></span>
      <span className="relative flex items-center gap-2 text-[var(--color-accent)]">
        {children}
      </span>
    </button>
  );
};