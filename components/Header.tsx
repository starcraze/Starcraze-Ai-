import React from 'react';
import { LogoIcon } from './Icons';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <div className="inline-flex items-center gap-4">
        <LogoIcon />
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-wider text-[var(--color-primary)] [text-shadow:0_0_15px_var(--color-shadow)]">
          AI Prompt Starcraze
        </h1>
      </div>
      <p className="mt-4 text-sm text-[var(--color-text-secondary)] tracking-widest">
        Your Personal Prompt Engineering Studio
      </p>
    </header>
  );
};