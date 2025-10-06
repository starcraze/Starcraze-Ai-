import { GoogleGenAI, Type } from "@google/genai";
import { AiModel, PromptLength, PromptStyle, AspectRatio, PromptMode, ImageStyle, DetailLevel } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
    reader.readAsDataURL(file);
  });
  return {
    inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
  };
};

const getRawAspectRatio = (ratio: AspectRatio): string => {
  return ratio.split(' ')[0];
};


export const generateEnhancedPrompt = async (
  userInput: string,
  model: AiModel,
  length: PromptLength,
  negativePrompt: string,
  aspectRatio: AspectRatio,
  promptMode: PromptMode
): Promise<string> => {

  const enhancedSystemInstruction = `You are a world-class AI prompt engineer specializing in creating vivid, detailed, and effective prompts for generative image models. Your task is to take a user's simple idea and transform it into a high-quality, detailed prompt tailored for the specified AI model.

RULES:
- Return ONLY the final prompt as a single block of text.
- Do NOT include any explanations, preambles, or markdown formatting like \`\`\`.
- For MidJourney, incorporate parameters like "--ar [aspect ratio]", "--style raw", or "--v 6.0" where appropriate. If a negative prompt is provided, use "--no [negative prompt]".
- For DALL-E 3, use descriptive, natural language sentences. Weave the aspect ratio and negative prompt concepts into the description naturally.
- For Stable Diffusion, use comma-separated keywords, emphasize important terms with parentheses, like (masterpiece, best quality). Describe the aspect ratio textually. If a negative prompt is provided, add a "Negative prompt: [negative prompt]" section after the main prompt.
- Ensure you incorporate the aspect ratio and negative prompt correctly based on the target model's syntax.`;

  const normalSystemInstruction = `You are an AI prompt assistant. Your task is to take a user's idea and formulate it into a clear and concise prompt for the specified AI model.

RULES:
- Return ONLY the final prompt.
- Do NOT add extra creative details unless they are in the original idea.
- Format the prompt correctly for the target model.
- If an aspect ratio is provided, add the correct parameter (e.g., --ar ${getRawAspectRatio(aspectRatio)} for MidJourney) or describe it textually for other models.
- If a negative prompt is provided, use the correct syntax (e.g., --no [negative prompt]).`;

  const systemInstruction = promptMode === PromptMode.Enhanced ? enhancedSystemInstruction : normalSystemInstruction;
  const rawAspectRatio = getRawAspectRatio(aspectRatio);

  const prompt = `
    Base Idea: "${userInput}"
    Target Model: "${model}"
    Desired Length: "${length}"
    Aspect Ratio: "${rawAspectRatio}"
    ${negativePrompt ? `Negative Prompt: "${negativePrompt}"` : ''}

    Generate the prompt based on the system instructions.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating enhanced prompt:", error);
    throw new Error("Failed to communicate with the AI. Please try again in a moment.");
  }
};

export const generatePromptFromImage = async (
  imageFile: File,
  model: AiModel,
  negativePrompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  const rawAspectRatio = getRawAspectRatio(aspectRatio);
  const systemInstruction = `You are an expert image analyst and AI prompt engineer. Your task is to analyze the provided image and generate a highly descriptive and artistic prompt that could be used to recreate or reimagine the image with a generative AI model.

RULES:
- Describe the main subject, setting, style, lighting, and color palette in detail.
- Tailor the final prompt's syntax for the specified target model (${model}).
- Incorporate the desired aspect ratio (${rawAspectRatio}). For MidJourney, use "--ar ${rawAspectRatio}". For others, describe it textually.
- If a negative prompt is provided, incorporate it using the correct syntax for the target model (e.g., "--no [negative prompt]" for MidJourney, or "Negative prompt: [negative prompt]" for Stable Diffusion).
- Return ONLY the final, complete prompt as a single block of text.
- Do NOT include any preamble like "Here is the prompt:" or markdown.
- Be creative and inspiring.`;

  const imagePart = await fileToGenerativePart(imageFile);
  
  const textPart = {
    text: `Analyze this image and generate a prompt for the ${model} model with an aspect ratio of ${rawAspectRatio}. ${negativePrompt ? `Incorporate this negative prompt: "${negativePrompt}"` : ''} Follow the system instructions.`,
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating prompt from image:", error);
    throw new Error("Failed to analyze the image. The file might be corrupted or in an unsupported format.");
  }
};

export const generateStyledPrompt = async (
  basePrompt: string,
  style: PromptStyle,
  model: AiModel,
  negativePrompt: string
): Promise<string> => {
  const systemInstruction = `You are an AI prompt stylist. Your task is to take a base prompt for a generative image model and rewrite it to perfectly match a specific artistic style.

RULES:
- Adhere strictly to the target model's preferred syntax (${model}).
- The rewritten prompt must retain the core subject of the base prompt.
- Infuse the prompt with keywords, artists, and techniques relevant to the requested style ('${style}').
- If a negative prompt is provided, ensure it is preserved and correctly formatted in the final output (e.g., as "--no [negative prompt]" for MidJourney).
- Preserve any aspect ratio parameters (like --ar) that exist in the base prompt.
- Return ONLY the final, rewritten prompt. No preambles, explanations, or markdown.`;

  const prompt = `
    Base Prompt: "${basePrompt}"
    Requested Style: "${style}"
    Target Model: "${model}"
    ${negativePrompt ? `Negative Prompt to preserve: "${negativePrompt}"` : ''}

    Rewrite the prompt based on the system instructions.
  `;
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
        topP: 0.95,
      },
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating styled prompt:", error);
    throw new Error("Failed to apply style. Please try again.");
  }
};


export const generateStoryPrompts = async (
  imageFile: File,
  description: string,
  frameCount: number,
  model: AiModel
): Promise<string[]> => {
  const systemInstruction = `You are a creative storyteller and AI prompt engineer. Your task is to generate a sequence of prompts for a generative image model that tells a story.
1. Analyze the provided image to understand its core subject, artistic style, color palette, and mood. This style MUST be maintained across all generated prompts.
2. Read the user's story description to understand the narrative theme.
3. Generate exactly ${frameCount} prompts that form a sequential story based on the description. Each prompt must represent a clear step in the narrative.
4. Each prompt should describe a different scene, action, or camera angle to create a sense of progression (e.g., "close-up shot", "wide angle", "from behind").
5. Tailor the prompt syntax for the specified AI model (${model}). For Midjourney, include relevant parameters like --ar 16:9.
6. Return the output as a valid JSON object with a single key "storyPrompts" which is an array of strings. Example: \`{"storyPrompts": ["prompt 1", "prompt 2"]}\`.
7. Do NOT include any other text, explanations, or markdown formatting.`;

  const imagePart = await fileToGenerativePart(imageFile);
  const textPart = { text: `Story Description: "${description}". Generate exactly ${frameCount} story prompts for the ${model} model. Follow the system instructions precisely.` };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        systemInstruction,
        temperature: 0.85,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            storyPrompts: {
              type: Type.ARRAY,
              description: `An array of exactly ${frameCount} prompt strings.`,
              items: { type: Type.STRING }
            }
          },
          required: ['storyPrompts']
        }
      }
    });

    const parsed = JSON.parse(response.text);
    if (
      !parsed.storyPrompts || 
      !Array.isArray(parsed.storyPrompts) ||
      parsed.storyPrompts.some((p: unknown) => typeof p !== 'string')
    ) {
      throw new Error("AI returned an invalid story format.");
    }
    return parsed.storyPrompts;
  } catch (error) {
    console.error("Error generating story prompts:", error);
    throw new Error("Failed to generate the story. The AI may be experiencing issues or the request was filtered.");
  }
};

export const generateImage = async (
  prompt: string,
  style: ImageStyle,
  aspectRatio: AspectRatio,
  imageFile: File | null,
  negativePrompt: string,
  detailLevel: DetailLevel,
  numberOfImages: number,
  promptMode: PromptMode
): Promise<string[]> => {
  let detailInstruction: string;
  switch (detailLevel) {
    case DetailLevel.Ultra:
      detailInstruction = "The user wants maximum quality and detail. Add hyper-realistic, photorealistic, and intricate details. Use phrases like '4k resolution', '8k', 'sharp focus', 'insanely detailed', 'masterpiece quality'.";
      break;
    case DetailLevel.High:
      detailInstruction = "The user wants high detail. Add realistic and intricate details. Use phrases like 'sharp focus', 'highly detailed'.";
      break;
    default:
      detailInstruction = "The user wants a standard level of detail. Focus on a clean, artistic composition without necessarily adding excessive micro-details.";
  }

  const enhancedSystemInstruction = `You are a world-class AI prompt engineer for a powerful text-to-image model called 'Imagen'. Your task is to take a user's idea, an artistic style, and other parameters, and creatively expand it into a single, cohesive, and hyper-detailed master prompt. Add your own creative details to make the image more interesting and visually stunning.`;
  const normalSystemInstruction = `You are an AI prompt engineer for 'Imagen'. Your task is to take a user's idea and style, and format it into a clear and effective prompt. Stick closely to the user's original idea.`;

  const systemInstruction = `
    ${promptMode === PromptMode.Enhanced ? enhancedSystemInstruction : normalSystemInstruction}

    RULES:
    - The prompt must be a single, rich paragraph.
    - Describe the subject, environment, lighting, colors, and composition in vivid detail.
    - Incorporate keywords and artistic nuances relevant to the selected style: "${style}".
    - ${detailInstruction}
    - If a reference image is provided, analyze its key elements (subject, mood, style) and weave them into the prompt to ensure accuracy and consistency.
    - The final prompt should be directly usable by an advanced text-to-image model. It must NOT contain any negative prompt instructions, as those are handled separately.
    - Return ONLY the final prompt text. Do NOT include any explanations, preambles, or markdown formatting.`;

  const textPart = { text: `User's Idea: "${prompt}". Style: "${style}". Detail Level: ${detailLevel}. Create the master prompt based on these inputs and the system instructions.` };
  
  let masterPromptContent: any;
  if (imageFile) {
    const imagePart = await fileToGenerativePart(imageFile);
    masterPromptContent = { parts: [imagePart, textPart] };
  } else {
    masterPromptContent = textPart.text;
  }

  let masterPrompt: string;
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: masterPromptContent,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      },
    });
    masterPrompt = response.text.trim();
  } catch (error) {
    console.error("Error generating master prompt:", error);
    throw new Error("Failed to prepare the image prompt. The AI may be experiencing issues.");
  }
  
  const finalPrompt = `${masterPrompt}${negativePrompt ? ` | Negative prompt: ${negativePrompt}`: ''}`;

  try {
    const rawAspectRatio = getRawAspectRatio(aspectRatio);
    const supportedRatios: ("1:1" | "3:4" | "4:3" | "9:16" | "16:9")[] = ["1:1", "4:3", "3:4", "16:9", "9:16"];
    const apiAspectRatio = supportedRatios.find(r => r === rawAspectRatio) || "1:1";

    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: finalPrompt,
      config: {
        numberOfImages: numberOfImages,
        outputMimeType: 'image/jpeg',
        aspectRatio: apiAspectRatio,
      },
    });

    if (!imageResponse.generatedImages || imageResponse.generatedImages.length === 0) {
        throw new Error("The AI did not return an image. This could be due to a safety policy violation.");
    }

    return imageResponse.generatedImages.map(img => img.image.imageBytes);
  } catch (error) {
    console.error("Error generating image with Imagen:", error);
    throw new Error("Failed to generate the final image. The request may have been filtered for safety reasons.");
  }
};


export const generateRandomImagePrompt = async (): Promise<string> => {
    const systemInstruction = `You are a creative muse. Your task is to generate a single, compelling, and visually interesting idea for an AI image. The idea should be a short phrase or sentence.

RULES:
- Return ONLY the prompt idea as a single line of text.
- Do NOT include any explanations, preambles, or markdown formatting.
- Be creative and varied. Suggest concepts that are fantastical, futuristic, abstract, or surreal.
- Example outputs: "A glass apple in the center of a swirling galaxy.", "A city built on the back of a giant turtle.", "The library of lost memories."`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: "Generate a creative image prompt.",
            config: {
                systemInstruction,
                temperature: 1.0,
                topP: 1.0,
            },
        });
        return response.text.trim().replace(/"/g, ''); // Remove quotes if AI adds them
    } catch (error) {
        console.error("Error generating random prompt:", error);
        return "A majestic lion wearing a crown, oil painting style."; // Return a fallback
    }
};

export const generateNegativePrompt = async (prompt: string, imageFile: File | null): Promise<string> => {
    const systemInstruction = `You are an expert prompt engineer for text-to-image models. Your task is to generate a concise, comma-separated list of negative prompt keywords based on a user's idea or a reference image. This list should help the AI avoid common visual artifacts and unwanted elements.

RULES:
- Analyze the user's prompt idea (and image if provided).
- Generate a list of common negative keywords that are generally useful, such as 'blurry, low quality, text, watermark, signature, ugly, deformed, extra limbs'.
- If the prompt suggests a specific subject (e.g., a person), add relevant negative keywords like 'disfigured, missing fingers, extra fingers, bad anatomy'.
- If the prompt is for a landscape, you might add fewer anatomy-related keywords.
- Return ONLY the comma-separated keywords as a single line of text.
- Do NOT include any explanations, preambles, or markdown formatting.`;
    
    const textPart = { text: `User's Idea: "${prompt}". Generate a suitable negative prompt.` };

    let content: any;
    if (imageFile) {
        const imagePart = await fileToGenerativePart(imageFile);
        content = { parts: [imagePart, textPart] };
    } else {
        content = textPart.text;
    }
    
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: content,
            config: {
                systemInstruction,
                temperature: 0.5,
            },
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error generating negative prompt:", error);
        return "blurry, low quality, text, watermark, bad anatomy, deformed"; // Return a fallback
    }
};
