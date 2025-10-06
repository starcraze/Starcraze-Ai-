import React from 'react';
import { LoaderIcon } from './Icons';

interface LoaderProps {
  message?: string;
}

export const Loader: React.FC<LoaderProps> = ({ message = "AI Thinking..." }) => {
  return (
    <div className="flex flex-col justify-center items-center my-8" role="status" aria-live="polite">
      <LoaderIcon />
      <p className="mt-4 text-[var(--color-primary)] text-sm tracking-widest animate-pulse">{message}</p>
    </div>
  );
};