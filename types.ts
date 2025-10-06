export enum AiModel {
  MidJourney = 'MidJourney',
  Dalle3 = 'DALL-E 3',
  StableDiffusion = 'Stable Diffusion',
}

export enum PromptLength {
  Short = 'Short (1-2 sentences)',
  Medium = 'Medium (3-4 sentences)',
  Long = 'Long (5+ sentences)',
}

export const PromptStyles = [
  'Cinematic',
  'Photorealistic',
  'Fantasy Art',
  'Cyberpunk',
  'Anime',
  'Watercolor',
  'Oil Painting',
  'Steampunk',
  'Minimalist',
  'Art Deco',
  'Gothic',
  'Synthwave',
  'Impressionism',
  'Surrealism',
  'Concept Art',
  'Low Poly',
  'Pixel Art',
  'Graffiti',
  'Cartoon',
  'Infographic',
  'Vintage Photo',
] as const;

export type PromptStyle = typeof PromptStyles[number];

export enum AspectRatio {
    SixteenNine = '16:9 (Widescreen)',
    OneOne = '1:1 (Square)',
    NineSixteen = '9:16 (Portrait)',
    FourThree = '4:3 (Standard)',
    ThreeTwo = '3:2 (Photo)',
}

export enum PromptMode {
    Normal = 'Normal',
    Enhanced = 'Enhanced',
}

export const ImageStyles = [
  'Cinematic',
  'Photorealistic',
  'Anime / Manga',
  'Fantasy Art',
  'Cyberpunk',
  'Steampunk',
  'Watercolor',
  'Oil Painting',
  'Krita',
  'Minimalist',
  'Art Deco',
  'Gothic',
  'Synthwave',
  'Impressionism',
  'Surrealism',
  'Concept Art',
  'Low Poly',
  'Pixel Art',
  'Graffiti',
  'Vintage Photo',
  'Abstract',
  '3D Render',
  'Logo Design',
] as const;

export type ImageStyle = typeof ImageStyles[number];

export enum DetailLevel {
    Standard = 'Standard',
    High = 'High',
    Ultra = '4K / Ultra',
}
