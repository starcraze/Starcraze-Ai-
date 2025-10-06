
import React, { useState, useCallback, ChangeEvent, useRef, useLayoutEffect, useEffect } from 'react';
import { AiModel, PromptLength, PromptStyle, AspectRatio, PromptMode } from './types';
import { generateEnhancedPrompt, generatePromptFromImage, generateStyledPrompt } from './services/geminiService';
import { Header } from './components/Header';
import { ModelSelector } from './components/ModelSelector';
import { PromptInput } from './components/PromptInput';
import { ImageUploader } from './components/ImageUploader';
import { LengthSelector } from './components/LengthSelector';
import { ActionButton } from './components/ActionButton';
import { GeneratedPrompt } from './components/GeneratedPrompt';
import { Loader } from './components/Loader';
import { SparklesIcon, ZapIcon, BrushIcon, StoryIcon, CameraIcon, LogoIcon } from './components/Icons';
import { StyleSelector } from './components/StyleSelector';
import { NegativePrompt } from './components/NegativePrompt';
import { playSuccessSound, playClickSound, playMagicSound } from './utils/sound';
import { StoryMaker } from './components/StoryMaker';
import { AspectRatioSelector } from './components/AspectRatioSelector';
import { PromptModeSelector } from './components/PromptModeSelector';
import { ImageStudio } from './components/ImageStudio';

type AppView = 'starcraze' | 'story' | 'studio';

const ViewSwitcher: React.FC<{ currentView: AppView, setView: (view: AppView) => void }> = ({ currentView, setView }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const starcrazeRef = useRef<HTMLButtonElement>(null);
  const storyRef = useRef<HTMLButtonElement>(null);
  const studioRef = useRef<HTMLButtonElement>(null);
  const [barStyle, setBarStyle] = useState({});

  useLayoutEffect(() => {
    let targetRef: HTMLButtonElement | null = null;
    if (currentView === 'starcraze') {
      targetRef = starcrazeRef.current;
    } else if (currentView === 'story') {
      targetRef = storyRef.current;
    } else {
      targetRef = studioRef.current;
    }

    if (targetRef && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const targetRect = targetRef.getBoundingClientRect();
        setBarStyle({
            width: targetRect.width,
            left: targetRect.left - containerRect.left,
        });
    }
  }, [currentView]);

  const baseClasses = "relative flex-1 sm:flex-initial sm:px-6 py-3 text-sm font-bold transition-colors duration-300 ease-in-out flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-0 rounded-lg";
  const activeClasses = "text-[var(--color-primary)]";
  const inactiveClasses = "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]";

  const handleClick = (view: AppView) => {
    playClickSound();
    setView(view);
  };

  return (
    <div ref={containerRef} className="relative flex justify-center items-stretch my-8 p-1 bg-black/40 rounded-xl border border-[var(--color-border)]">
      <div 
        className="absolute top-1 bottom-1 bg-[var(--color-primary)]/10 rounded-lg border border-[var(--color-primary)]/20 transition-all duration-300 ease-in-out" 
        style={barStyle}
      />
      <button
        ref={starcrazeRef}
        onClick={() => handleClick('starcraze')}
        className={`${baseClasses} ${currentView === 'starcraze' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'starcraze'}
      >
        <BrushIcon />
        <span className="hidden sm:inline">Prompt Starcraze</span>
      </button>
      <button
        ref={storyRef}
        onClick={() => handleClick('story')}
        className={`${baseClasses} ${currentView === 'story' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'story'}
      >
        <StoryIcon />
        <span className="hidden sm:inline">Story Maker</span>
      </button>
      <button
        ref={studioRef}
        onClick={() => handleClick('studio')}
        className={`${baseClasses} ${currentView === 'studio' ? activeClasses : inactiveClasses}`}
        aria-pressed={currentView === 'studio'}
      >
        <CameraIcon />
        <span className="hidden sm:inline">Image Studio</span>
      </button>
    </div>
  );
};


const App: React.FC = () => {
  const [userInput, setUserInput] = useState<string>('A hyper-detailed portrait of a cyborg samurai in a neon-lit Tokyo street, cinematic lighting.');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<AiModel>(AiModel.MidJourney);
  const [promptLength, setPromptLength] = useState<PromptLength>(PromptLength.Medium);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStyling, setIsStyling] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [showNegativePrompt, setShowNegativePrompt] = useState<boolean>(false);
  const [view, setView] = useState<AppView>('starcraze');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(AspectRatio.SixteenNine);
  const [promptMode, setPromptMode] = useState<PromptMode>(PromptMode.Enhanced);

  useEffect(() => {
    document.body.dataset.theme = view;
  }, [view]);

  const clearImage = useCallback(() => {
    setImageFile(null);
    setImagePreview(null);
  }, []);

  const handleUserInput = (value: string) => {
    setUserInput(value);
    if (imageFile) {
      clearImage();
    }
  };

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
      setUserInput(''); // Clear text input
      setGeneratedPrompt(''); // Clear previous prompt
    }
  };

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      let result: string;
      const negPrompt = showNegativePrompt ? negativePrompt : '';
      if (imageFile && imagePreview) {
        result = await generatePromptFromImage(imageFile, selectedModel, negPrompt, aspectRatio);
        setUserInput(`Prompt generated from uploaded image: ${imageFile.name}`);
      } else if (userInput.trim()) {
        result = await generateEnhancedPrompt(userInput, selectedModel, promptLength, negPrompt, aspectRatio, promptMode);
      } else {
        throw new Error("Please enter a prompt idea or upload an image.");
      }
      setGeneratedPrompt(result);
      playSuccessSound();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
        console.error("Caught a non-Error object in handleSubmit:", err);
      }
    } finally {
      setIsLoading(false);
    }
  }, [userInput, imageFile, imagePreview, selectedModel, promptLength, negativePrompt, showNegativePrompt, aspectRatio, promptMode]);

  const handleStyleSelect = async (style: PromptStyle) => {
    if (!generatedPrompt) return;

    setIsStyling(true);
    setError(null);
    try {
      const negPrompt = showNegativePrompt ? negativePrompt : '';
      const result = await generateStyledPrompt(generatedPrompt, style, selectedModel, negPrompt);
      setGeneratedPrompt(result);
      playSuccessSound();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unexpected error occurred.');
        console.error("Caught a non-Error object in handleStyleSelect:", err);
      }
    } finally {
      setIsStyling(false);
    }
  };


  return (
    <div className="min-h-screen text-[var(--color-text-primary)] flex flex-col items-center justify-start p-4 selection:bg-[var(--color-primary)]/30">
      <div className="w-full max-w-3xl mx-auto py-8 sm:py-12">
        <Header />
        <ViewSwitcher currentView={view} setView={setView} />
        
        {view === 'starcraze' && (
          <main className="p-6 content-pane rounded-2xl">
            
            <ModelSelector selectedModel={selectedModel} setSelectedModel={setSelectedModel} />
            
            <div className="relative mt-6">
              <PromptInput userInput={userInput} setUserInput={handleUserInput} disabled={isLoading || isStyling} />
              <ImageUploader handleImageChange={handleImageChange} onClear={clearImage} disabled={isLoading || isStyling} imagePreview={imagePreview} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <LengthSelector promptLength={promptLength} setPromptLength={setPromptLength} disabled={isLoading || isStyling} />
              <AspectRatioSelector aspectRatio={aspectRatio} setAspectRatio={setAspectRatio} disabled={isLoading || isStyling} />
            </div>

            <NegativePrompt
              value={negativePrompt}
              onChange={setNegativePrompt}
              show={showNegativePrompt}
              onToggle={() => setShowNegativePrompt(!showNegativePrompt)}
              disabled={isLoading || isStyling}
            />

            <div className="mt-8 text-center">
               <PromptModeSelector promptMode={promptMode} setPromptMode={setPromptMode} disabled={isLoading || isStyling} />
              <ActionButton onClick={handleSubmit} disabled={isLoading || isStyling || (!imageFile && !userInput.trim())}>
                <ZapIcon />
                {imageFile ? 'Generate from Image' : promptMode === PromptMode.Enhanced ? 'Enhance Prompt' : 'Generate Prompt'}
              </ActionButton>
            </div>
            
            {(isLoading || isStyling) && <Loader message={isStyling ? "Applying Artistic Style..." : "Crafting Your Prompt..."} />}

            {error && <div className="mt-6 p-4 bg-red-900/40 border border-red-500/50 text-red-300 rounded-lg text-center">{error}</div>}

            {generatedPrompt && !isLoading && (
              <div className="mt-8">
                 <h2 className="text-lg font-bold text-[var(--color-primary)] flex items-center gap-2 mb-3">
                  <SparklesIcon />
                  Starcraze Prompt
                </h2>
                <GeneratedPrompt prompt={generatedPrompt} />
                <StyleSelector onSelectStyle={handleStyleSelect} disabled={isStyling} />
              </div>
            )}
          </main>
        )}

        {view === 'story' && <StoryMaker />}
        {view === 'studio' && <ImageStudio />}
        
        <footer className="text-center mt-12 text-sm text-[var(--color-text-secondary)] tracking-wider opacity-60 flex flex-col items-center gap-2">
           <LogoIcon />
          <p>Powered by Starcraze</p>
        </footer>
      </div>
    </div>
  );
};

export default App;