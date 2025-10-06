import React, { useState, ChangeEvent, useRef } from 'react';
import { AiModel } from '../types';
import { generateStoryPrompts } from '../services/geminiService';
import { ModelSelector } from './ModelSelector';
import { ActionButton } from './ActionButton';
import { Loader } from './Loader';
import { GeneratedPrompt } from './GeneratedPrompt';
import { playCompleteSound, playClickSound } from '../utils/sound';
import { ZapIcon, SparklesIcon, ImageIcon } from './Icons';

// A custom, styled image uploader specifically for the StoryMaker view.
const StoryImageUploader: React.FC<{
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled: boolean;
  imagePreview: string | null;
}> = ({ handleImageChange, disabled, imagePreview }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <div>
            <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">
                STARTING IMAGE (SETS THE STYLE)
            </label>
            <input
                type="file"
                ref={inputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                disabled={disabled}
            />
            <div
                onClick={() => !disabled && inputRef.current?.click()}
                className={`relative flex items-center justify-center w-full h-48 bg-black/30 border-2 border-dashed rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
                    ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[var(--color-primary)] border-[var(--color-border)]'}
                    ${imagePreview ? 'border-solid border-[var(--color-primary)]/50' : ''}`}
            >
                {imagePreview ? (
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded-lg p-1" />
                ) : (
                    <div className="text-center text-[var(--color-text-secondary)]">
                        <div className="flex justify-center mb-2 text-[var(--color-text-primary)]">
                           <ImageIcon />
                        </div>
                        <p className="font-semibold">Click to upload an image</p>
                        <p className="text-xs text-gray-500">PNG, JPG, WEBP</p>
                    </div>
                )}
            </div>
        </div>
    );
};


export const StoryMaker: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [description, setDescription] = useState<string>('A hero discovers a hidden power and confronts a shadow lurking in the city.');
  const [frameCount, setFrameCount] = useState<number>(3);
  const [selectedModel, setSelectedModel] = useState<AiModel>(AiModel.MidJourney);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setGeneratedPrompts([]);
    }
  };

  const handleFrameCountChange = (count: number) => {
    playClickSound();
    setFrameCount(count);
  };
  
  const handleSubmit = async () => {
    if (!imageFile) {
      setError("Please upload an image to set the story's style.");
      return;
    }
    if (!description.trim()) {
      setError("Please provide a story description.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompts([]);

    try {
      const result = await generateStoryPrompts(imageFile, description, frameCount, selectedModel);
      setGeneratedPrompts(result);
      playCompleteSound();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred while creating the story.');
        console.error("Caught a non-Error object in StoryMaker handleSubmit:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="p-6 content-pane rounded-2xl">
      <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />

      <div className="mt-6">
        <StoryImageUploader handleImageChange={handleImageChange} disabled={isLoading} imagePreview={imagePreview} />
      </div>

      <div className="mt-6">
        <label htmlFor="story-description" className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">
          STORY DESCRIPTION
        </label>
        <textarea
          id="story-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          rows={3}
          placeholder="e.g., A robot exploring a lush, overgrown alien planet..."
          className="w-full bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-0 focus:border-[var(--color-border-hover)] focus:bg-black/40 transition-all duration-300 resize-none disabled:opacity-50"
        />
      </div>
      
      <div className="mt-6">
        <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">STORY FRAMES</label>
        <div className="grid grid-cols-3 sm:grid-cols-9 gap-2">
          {Array.from({ length: 9 }, (_, i) => i + 1).map(num => (
            <button
              key={num}
              onClick={() => handleFrameCountChange(num)}
              disabled={isLoading}
              className={`w-full text-center px-2 py-3 text-sm font-semibold rounded-lg transition-all duration-300 ease-in-out border focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] focus-visible:ring-opacity-50 disabled:opacity-50
                ${frameCount === num
                  ? 'bg-[var(--color-primary)]/20 border-[var(--color-primary)]/80 text-[var(--color-primary)]'
                  : 'bg-black/20 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-primary)]'
                }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 text-center">
        <ActionButton onClick={handleSubmit} disabled={isLoading || !imageFile || !description.trim()}>
          <ZapIcon />
          Generate Story
        </ActionButton>
      </div>
      
      {isLoading && <Loader message="Weaving your narrative..." />}
      
      {error && <div className="mt-6 p-4 bg-red-900/40 border border-red-500/50 text-red-300 rounded-lg text-center">{error}</div>}

      {generatedPrompts.length > 0 && !isLoading && (
        <div className="mt-8">
          <h2 className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2 mb-3">
            <SparklesIcon />
            Your Story Prompts
          </h2>
          <div className="space-y-4">
            {generatedPrompts.map((prompt, index) => (
               <div key={index} className="flex items-start gap-3">
                 <span className="text-lg font-bold text-[var(--color-primary)] pt-3">{index + 1}.</span>
                 <GeneratedPrompt prompt={prompt} />
               </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
};