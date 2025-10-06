import React, { useRef } from 'react';
import { ImageIcon, XCircleIcon } from './Icons';
import { playClickSound } from '../utils/sound';

interface ImageUploaderProps {
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  disabled: boolean;
  imagePreview: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ handleImageChange, onClear, disabled, imagePreview }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    playClickSound();
    onClear();
    if(inputRef.current) {
        inputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        onChange={handleImageChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled}
      />
      <div className="absolute top-1 right-2 flex items-center gap-2">
        {imagePreview && (
          <div className="group relative">
             <img src={imagePreview} alt="Preview" className="w-10 h-10 rounded-md object-cover border border-[var(--color-primary)]/50" />
             <button
                onClick={handleClear}
                disabled={disabled}
                className="absolute -top-2 -right-2 p-0.5 rounded-full bg-gray-900 text-gray-400 hover:text-white hover:bg-red-600/80 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100"
                title="Clear image"
             >
                <XCircleIcon />
             </button>
          </div>
        )}
        <button
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="p-2 rounded-full bg-black/30 hover:bg-[var(--color-primary)]/20 text-[var(--color-primary)] hover:text-yellow-300 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] disabled:opacity-50 disabled:cursor-not-allowed"
          title="Upload image to generate prompt"
          aria-label="Upload image to generate prompt"
        >
          <ImageIcon />
        </button>
      </div>
    </>
  );
};