import React, { useState, useCallback, ChangeEvent, useRef, useEffect } from 'react';
import { AspectRatio, ImageStyle, DetailLevel, ImageStyles, PromptMode } from '../types';
import { generateImage, generateRandomImagePrompt, generateNegativePrompt } from '../services/geminiService';
import { ActionButton } from './ActionButton';
import { Loader } from './Loader';
import { ZapIcon, ImageIcon, XCircleIcon, DownloadIcon, WandIcon, ChevronDownIcon, NegativePromptIcon } from './Icons';
import { AspectRatioSelector } from './AspectRatioSelector';
import { playClickSound, playCompleteSound, playMagicSound, playToggleSound } from '../utils/sound';
import { NegativePrompt } from './NegativePrompt';
import { PromptModeSelector } from './PromptModeSelector';

// Style Selector (Popover Dropdown)
const ImageStyleSelector: React.FC<{
  selectedStyle: ImageStyle;
  setSelectedStyle: (style: ImageStyle) => void;
  disabled: boolean;
}> = ({ selectedStyle, setSelectedStyle, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (style: ImageStyle) => {
        setSelectedStyle(style);
        setIsOpen(false);
        playClickSound();
    };

    return (
        <div ref={wrapperRef} className="relative">
            <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">ARTISTIC STYLE</label>
            <button
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
                className="relative flex items-center justify-between w-full px-4 py-3 text-left bg-black/40 border border-[var(--color-border)] rounded-xl transition-colors duration-300 ease-in-out focus:outline-none focus:border-[var(--color-border-hover)] disabled:opacity-50"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="text-[var(--color-text-primary)] font-semibold">{selectedStyle}</span>
                <ChevronDownIcon className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-[var(--color-bg-dark)] border border-[var(--color-border-hover)] rounded-xl shadow-lg animate-popover max-h-60 overflow-y-auto" role="listbox">
                    <ul className="py-1">
                        {ImageStyles.map(style => (
                            <li
                                key={style}
                                onClick={() => handleSelect(style)}
                                className="px-4 py-2 cursor-pointer text-[var(--color-text-secondary)] hover:bg-[var(--color-primary)]/10 hover:text-[var(--color-text-primary)] transition-colors duration-200"
                                role="option"
                                aria-selected={selectedStyle === style}
                            >
                                {style}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

// Detail Level Selector
const detailLevels = Object.values(DetailLevel);
const DetailLevelSelector: React.FC<{
  selectedLevel: DetailLevel;
  setSelectedLevel: (level: DetailLevel) => void;
  disabled: boolean;
}> = ({ selectedLevel, setSelectedLevel, disabled }) => {
    const handleClick = (level: DetailLevel) => {
        if (!disabled) {
            setSelectedLevel(level);
            playClickSound();
        }
    };
    
    return (
        <div>
          <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">DETAIL LEVEL</label>
          <div className="relative flex justify-between bg-black/40 p-1 rounded-xl border border-[var(--color-border)]">
            {detailLevels.map((level) => (
              <button
                key={level}
                onClick={() => handleClick(level)}
                disabled={disabled}
                className={`relative z-10 w-full text-center px-2 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-0 disabled:opacity-50
                  ${selectedLevel === level
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
              >
                {level.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
    );
};

// Quantity Selector
const quantities = [1, 2, 3];
const QuantitySelector: React.FC<{
  selectedQuantity: number;
  setSelectedQuantity: (q: number) => void;
  disabled: boolean;
}> = ({ selectedQuantity, setSelectedQuantity, disabled }) => {
    const handleClick = (quantity: number) => {
        if (!disabled) {
            setSelectedQuantity(quantity);
            playClickSound();
        }
    };
    
    return (
        <div>
          <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">IMAGES</label>
          <div className="relative grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-xl border border-[var(--color-border)]">
            {quantities.map((quantity) => (
              <button
                key={quantity}
                onClick={() => handleClick(quantity)}
                disabled={disabled}
                className={`relative z-10 w-full text-center px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 ease-in-out focus:outline-none focus-visible:ring-0 disabled:opacity-50
                  ${selectedQuantity === quantity
                    ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                  }`}
              >
                {quantity}
              </button>
            ))}
          </div>
        </div>
    );
};

// Image Uploader
const StudioImageUploader: React.FC<{
  handleImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClear: () => void;
  disabled: boolean;
  imagePreview: string | null;
}> = ({ handleImageChange, onClear, disabled, imagePreview }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    return (
      <div>
        <label className="block text-sm font-bold mb-2 text-[var(--color-primary)] tracking-wider">
          REFERENCE IMAGE (OPTIONAL)
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
          className={`group relative flex items-center justify-center w-full h-48 bg-black/30 border-2 border-dashed rounded-lg transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]
            ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[var(--color-primary)] border-[var(--color-border)]'}
            ${imagePreview ? 'border-solid border-[var(--color-primary)]/50' : ''}`}
        >
          {imagePreview ? (
            <>
              <img src={imagePreview} alt="Reference Preview" className="w-full h-full object-contain rounded-lg p-1" />
              <button
                onClick={(e) => { e.stopPropagation(); onClear(); }}
                disabled={disabled}
                className="absolute top-2 right-2 p-1 rounded-full bg-gray-900/70 text-gray-300 hover:text-white hover:bg-red-600/80 transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 opacity-0 group-hover:opacity-100"
                title="Clear image"
              >
                <XCircleIcon />
              </button>
            </>
          ) : (
            <div className="text-center text-[var(--color-text-secondary)]">
              <div className="flex justify-center mb-2 text-[var(--color-text-primary)]">
                 <ImageIcon />
              </div>
              <p className="font-semibold">Upload a reference image</p>
              <p className="text-xs">Adds accuracy to your generation</p>
            </div>
          )}
        </div>
      </div>
    );
};

export const ImageStudio: React.FC = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [prompt, setPrompt] = useState<string>('A stunning castle on a cliff by the sea, evening sun.');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SixteenNine);
    const [style, setStyle] = useState<ImageStyle>(ImageStyles[0]);
    const [generatedImages, setGeneratedImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isGeneratingRandom, setIsGeneratingRandom] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [negativePrompt, setNegativePrompt] = useState<string>('');
    const [showNegativePrompt, setShowNegativePrompt] = useState<boolean>(false);
    const [detailLevel, setDetailLevel] = useState<DetailLevel>(DetailLevel.High);
    const [quantity, setQuantity] = useState<number>(1);
    const [promptMode, setPromptMode] = useState<PromptMode>(PromptMode.Enhanced);
    const [modalImageSrc, setModalImageSrc] = useState<string | null>(null);
    const lastGenerationDetailLevel = useRef<DetailLevel>(detailLevel);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setModalImageSrc(null);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    const handleClearImage = useCallback(() => {
        playClickSound();
        setImageFile(null);
        setImagePreview(null);
    }, []);

    const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            playClickSound();
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDownloadImage = (imageSrc: string) => {
      if (imageSrc) {
        const link = document.createElement('a');
        link.href = imageSrc;
        link.download = `starcraze-studio-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    };
    
    const handleSurpriseMe = async () => {
      setIsGeneratingRandom(true);
      setError(null);
      playMagicSound();
      try {
          const randomPrompt = await generateRandomImagePrompt();
          setPrompt(randomPrompt);
      } catch (err) {
          setError("Could not generate a surprise prompt. Please try again.");
      } finally {
          setIsGeneratingRandom(false);
      }
    };

    const handleAutoNegativePrompt = async () => {
      setIsGeneratingRandom(true); // Re-use loader state
      setError(null);
      playMagicSound();
      try {
        const result = await generateNegativePrompt(prompt, imageFile);
        setNegativePrompt(result);
        if (!showNegativePrompt) {
            setShowNegativePrompt(true);
        }
      } catch (err) {
        setError("Could not auto-generate negative prompt.");
      } finally {
        setIsGeneratingRandom(false);
      }
    }

    const handleSubmit = useCallback(async (overrideDetailLevel?: DetailLevel) => {
        if (!prompt.trim()) {
            setError("Please enter a description for the image.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setGeneratedImages([]);

        const currentDetailLevel = overrideDetailLevel || detailLevel;

        try {
            const negPrompt = showNegativePrompt ? negativePrompt : '';
            const result = await generateImage(prompt, style, aspectRatio, imageFile, negPrompt, currentDetailLevel, quantity, promptMode);
            setGeneratedImages(result.map(base64 => `data:image/jpeg;base64,${base64}`));
            lastGenerationDetailLevel.current = currentDetailLevel;
            playCompleteSound();
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An unexpected error occurred while generating the image.');
                console.error("Caught a non-Error object in ImageStudio handleSubmit:", err);
            }
        } finally {
            setIsLoading(false);
        }
    }, [prompt, style, aspectRatio, imageFile, negativePrompt, showNegativePrompt, detailLevel, quantity, promptMode]);
    
    return (
        <main className="p-6 content-pane rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
                <div className="space-y-6">
                    <StudioImageUploader handleImageChange={handleImageChange} onClear={handleClearImage} disabled={isLoading} imagePreview={imagePreview} />
                    
                    <div>
                        <div className="flex items-center justify-between mb-2">
                           <label htmlFor="image-prompt" className="block text-sm font-bold text-[var(--color-primary)] tracking-wider">
                              IMAGE DESCRIPTION
                           </label>
                           <button onClick={handleSurpriseMe} disabled={isGeneratingRandom || isLoading} className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-yellow-300 transition-colors disabled:opacity-50" title="Generate a random prompt">
                              <WandIcon />
                              Surprise Me
                           </button>
                        </div>
                        <textarea
                          id="image-prompt"
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          disabled={isLoading}
                          rows={4}
                          placeholder="e.g., A majestic lion wearing a crown..."
                          className="w-full bg-[var(--color-input-bg)] border border-[var(--color-border)] rounded-lg p-4 text-[var(--color-text-primary)] placeholder-[var(--color-text-secondary)] focus:outline-none focus:ring-0 focus:border-[var(--color-border-hover)] focus:bg-black/40 transition-all duration-300 resize-none disabled:opacity-50"
                        />
                         <div className="mt-2">
                            <PromptModeSelector promptMode={promptMode} setPromptMode={setPromptMode} disabled={isLoading} />
                         </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center justify-between">
                          <button 
                            onClick={() => { playToggleSound(); setShowNegativePrompt(!showNegativePrompt); }}
                            disabled={isLoading}
                            className="flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] rounded-md p-1"
                            aria-expanded={showNegativePrompt}
                          >
                            <NegativePromptIcon />
                            <span className="text-sm font-bold tracking-wider">{showNegativePrompt ? 'Hide' : 'Add'} Negative Prompt</span>
                          </button>
                           <button onClick={handleAutoNegativePrompt} disabled={isGeneratingRandom || isLoading} className="flex items-center gap-1 text-sm text-[var(--color-primary)] hover:text-yellow-300 transition-colors disabled:opacity-50" title="Auto-generate negative prompt">
                              <WandIcon />
                              Auto
                           </button>
                      </div>
                      <NegativePrompt
                          value={negativePrompt}
                          onChange={setNegativePrompt}
                          show={showNegativePrompt}
                          disabled={isLoading}
                      />
                    </div>
                </div>
                <div className="space-y-6">
                    <ImageStyleSelector selectedStyle={style} setSelectedStyle={setStyle} disabled={isLoading} />
                    <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} disabled={isLoading} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <DetailLevelSelector selectedLevel={detailLevel} setSelectedLevel={setDetailLevel} disabled={isLoading} />
                      <QuantitySelector selectedQuantity={quantity} setSelectedQuantity={setQuantity} disabled={isLoading} />
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center">
                <ActionButton onClick={() => handleSubmit()} disabled={isLoading || !prompt.trim()}>
                    <ZapIcon />
                    Generate Image{quantity > 1 ? 's' : ''}
                </ActionButton>
            </div>

            {isLoading && <Loader message="Generating your masterpiece..." />}
            {error && <div className="mt-6 p-4 bg-red-900/40 border border-red-500/50 text-red-300 rounded-lg text-center">{error}</div>}

            {generatedImages.length > 0 && !isLoading && (
                <div className="mt-8 animate-simple-fade-in">
                    <h2 className="text-lg font-bold text-center text-[var(--color-primary)] mb-4">Generated Artwork</h2>
                    <div className={`grid gap-4 grid-cols-1 ${generatedImages.length > 1 ? 'sm:grid-cols-2' : ''} ${generatedImages.length > 2 ? 'lg:grid-cols-3' : ''}`}>
                      {generatedImages.map((imageSrc, index) => (
                         <div key={index} className="group relative bg-black/40 border border-[var(--color-border)] rounded-lg p-2">
                           <img
                               src={imageSrc}
                               alt={`Generated Artwork ${index + 1}`}
                               className="w-full h-full object-contain rounded-md cursor-pointer aspect-auto"
                               onClick={() => setModalImageSrc(imageSrc)}
                           />
                           <button
                               onClick={() => handleDownloadImage(imageSrc)}
                               className="absolute top-4 right-4 p-2 rounded-full bg-gray-900/60 text-gray-200 hover:text-white hover:bg-[var(--color-primary)] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)] opacity-0 group-hover:opacity-100"
                               title="Download image"
                           >
                               <DownloadIcon />
                           </button>
                         </div>
                      ))}
                    </div>
                     <div className="mt-6 flex flex-wrap justify-center gap-4">
                        <ActionButton onClick={() => handleSubmit()} disabled={isLoading}>
                          Regenerate
                        </ActionButton>
                        {lastGenerationDetailLevel.current !== DetailLevel.Ultra && (
                           <ActionButton onClick={() => handleSubmit(DetailLevel.Ultra)} disabled={isLoading}>
                            Enhance to 4K
                           </ActionButton>
                        )}
                    </div>
                </div>
            )}

            {modalImageSrc && (
                <div 
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-simple-fade-in"
                    onClick={() => setModalImageSrc(null)}
                    role="dialog"
                    aria-modal="true"
                    aria-label="Image Preview"
                >
                    <img 
                        src={modalImageSrc} 
                        alt="Generated Artwork Full Preview" 
                        className="max-w-full max-h-full object-contain rounded-lg shadow-2xl shadow-[var(--color-shadow-heavy)] animate-popover"
                        onClick={(e) => e.stopPropagation()}
                    />
                    <button
                        onClick={() => setModalImageSrc(null)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:text-[var(--color-primary)] hover:bg-black/75 transition-all"
                        aria-label="Close full preview"
                    >
                       <XCircleIcon />
                    </button>
                </div>
            )}
        </main>
    );
};
