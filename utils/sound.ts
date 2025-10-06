// A robust, modern audio utility using the Web Audio API to avoid common playback issues.
// Caches decoded audio buffers for high performance and reliability.

const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
const audioBufferCache: { [key: string]: AudioBuffer } = {};

// Helper to convert base64 to an ArrayBuffer, which is a more direct way than using fetch for data URLs.
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// Decodes audio data from a base64 string and caches it.
const getAudioBuffer = async (key: string, base64: string): Promise<AudioBuffer> => {
  if (audioBufferCache[key]) {
    return audioBufferCache[key];
  }
  const arrayBuffer = base64ToArrayBuffer(base64);
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  audioBufferCache[key] = audioBuffer;
  return audioBuffer;
};

const playSound = async (key: string, base64: string) => {
  // Resume AudioContext on user interaction, as required by modern browsers.
  if (audioContext.state === 'suspended') {
    await audioContext.resume().catch(err => console.error("AudioContext resume failed:", err));
  }

  try {
    const buffer = await getAudioBuffer(key, base64);
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start(0);
  } catch (error) {
    console.error(`Error playing sound "${key}":`, error);
    // Fail silently if audio playback is not supported or blocked.
  }
};

// Base64-encoded sound data
const CLICK_SOUND_BASE64 = 'UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAgAAAAYAZADgASABMAEwADgAOA=';
const SUCCESS_SOUND_BASE64 = 'UklGRlIAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YcQAAADMAAAB+v/7//8AAAAA//8CAPv/+wD8//0AAgAAAAAAAAAAAAAAAP/7//sA////AAD+APwA+AD+AP0A/gD9AP4A/AD6APgA9wD5APYA9AD2APIA8ADuAO0A6gDsAOIA5gDjAOMA3gDcANkA1gDTANIAzwDOAMsAywDJAI0AigCGAH0AegB4AHYAdQBwAGsAaABmAGMAZgBlAGgAaQBsAG8AcQBzAHUAdgB2AHYAdQBzAHEAbwBtAGsAagBpAGgAaABoAGgAaQBqAGsAawBrAGoAagBqAGkAiQCRAJYAmgCeAKIApgCoAKgAqgCoAKcApQClAKUAogCiAJsAmgCVAI8AjgCOAIwAigCGAIEAewB5AHcAcwBwAG0AawBpAGgAaQBoAGgAZwBnAGgAaABpAGgAaQBpAGkAagBqAGoAagBqAGoAagBqAGoAagBqAGkAaQBqAGkAaQBqAGkAaQBqAGkAaQBqAGkAaQBqAGkAaQBqAGoAawBsAG0AbwBxAHMAdgB5AHwAgQCEAIgAjgCWAJwApACpAKsArACsAKgApgCnAKUAoQCdAJsAlwCOAIwAiAB/AHsAeABzAHAAcQByAHUAdwB6AH4AhgCOAJkAoQCqAK4AsQCxAK8ApwCbAI4AhwB9AHUAcgBvAG0AagBoAGcAZgBlAGQAYwBiAGEAYABfAF8AXgBdAFwAWwBaAFkAWgBbAF0AXgBfAGAAYQBjAGUAZwBpAGwAbwByAHUAdwB5AH0AfgB/AH8AfgB9AHwAewB7AHsAeQB4AHgAeAB3AHYAdQB0AHMAdAB0AHUAdgB4AHoAfACA';
const TOGGLE_SOUND_BASE64 = 'UklGRkYAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YTwAAAC0ALQAtAC5ALwAugC/AL0AvQDAAMEAwQDCAMMAwwDEAMMAwwDCAMIAwQDAAL8AvQC8ALsAugC6ALkAuQC5ALgAuAC3ALcAtgC1ALQAtACzALIAAAAAswCyALEAswC0ALUAtgC2ALcAtwC5ALkAugC7ALwAvQC/AMAAwQDCAMMAxADF';
const COMPLETE_SOUND_BASE64 = 'UklGRlQDAABXQVZFZm10IBAAAAABAAIARKwAABCxAgAEABAAZGF0YSwDAABJ/0wA1f9hAEz/sQCtAIcBLQGGATEB2gDJAQsBzgEKAeoB6gHxAc8B6AHpAfEB7QHuAfcB7wH2AfYB9gH5AfwB/wH/AgYDCQIKAwsDDQMNAw8DDwQQBBMEFQQXBBgEGgQbBBwEHQQeBB8EIAQiBCMEJQQnBCgEKgQrBCwELgQvBDEEMwQ1BDcEOAQ6BDsEPAQ/BEAERARFBEcESgRMBE4EUQRVBFcEWQRaBFwEXgRgBGEEYwRlBGgEawRtBHEEcQRzBHUEegR8BH4EgASDBIYEjASQBJMEngSjBKgEqgStBK4EsASzBLQEuwS+BMAGwwTGBMgEyQTLBM0EzwTQBNME2ATdBN4E3wThBOIE5ATlBOgE6wTtBO8E8gT0BPgE+wT/BQAFCQUMBQ8FEgUWBRgFGwUdBSIFJAUoBSsFLgUxBTQFOgU/BUMFRgVLBVEFWQVcBWAFZQVnBWsFcQV1BXYFfQWCBYcFjgWRBZsFnwWhBaUFqwWzBbgFuwXDBccFywXPBdIF2AXgBeUF7wX8BgMGCAYNBhEGFQYZBh0GIwYnBikGLQYyBjUGNwY+BkIGRwZNBk8GUgZVBlkGXAZgBmMGaAZrBm8GcQZzBnoGfQZ/BoIGhQaLBo4GkgaWBpsGoAapBrAGswbIBs0G0gbgBucG8AcDBwkHDQcTBxgHHgchByYHKAcwBzcHQQdJB04HUAdYB1wHYgdnB3EHdwd+B4IHhweQB5cHogepB7EHtwfHB8sHzgfVB9wH5gfzBw4IEAgSCBgIJwguCDUIPAhDB0gHUAddB2AHawdwB3sHggeIB44HlAebB6MHowepB6sHrwe3B78HwwfJB8wHzwfVB9YH3wfnB/EH/ggMCBQIHAgsCDQIOghCCEsITYhWiFyIX4hkiGgIbwh1iHiIfYh/iICIhIiKiIuIjAiNSI4oj0iQGJCok8iUKJgYnCigKKQoqCisKLQouCjAKMQoyCjQKNwo/CkEKQwpECkYKSgpMCk4KUApVCloKXQphCmUKbApvCnMKdgp9CoEKgwpIClIKWwpjCm4KfAqJCpsKpAqxCr4KzgrYCuMK+gsMCxILFAscCyQLOgs/C0MLRwtNC1MLXQtfC2MLawtxC3gLgAuHC4sLjQuYC54LowurC7sLxQvKC84L0gvWC9sL3QvjC+sL8Qv3DAAMIAw0DEAMWBxkHIgcmBywHOAdCB0sHUwddB2YHaQdxB3oHgAeFB4kHjAeQB5cHnwegB6YHrAesB7cHvAfBB8UHxwfLB84H0gfVB9oH3gffB+IH5QfqB+sH8AfzB/UH/ggSCBgIIggpCC0INQhBCEMIRwhLCE4IUAhWCFkIXAhfCGQIaghsCHAIcwR0BHUEeQR7BH0EfgSCBIQEhgSKBJAEkwSaBKAEpQSpBKsErQSzBLcEvATBBcYGxwbLBs8G0QbXBtsG4gbjBuUG6QbrBu8G9Ab2BvgG+wb/BwQHCwcQBxgHIQclBysHNAdBB0gHUAddB2AHowexB7cHvAfBB8YHygfRB9YH3AfnB/EH/ggGCAwIEggYCBsIHwgjCSgJLQg0CDkIPghDCEgITghTCFoIXwhjCGkIcAhyCHUIegh+CIIJiAmLCY4JkQmWCaAJoQmmCasJsQm1CboJvQnBCcQJyAnNCdQJ2QndCeAJ4wnpCewJ8An2CgQKBgoMCg8KEwoWChwKHwomCioKMAo1CjwKQgpGClAKVQpZCmMKaQpzCnUKfAqECocKkAqZCp8KpgqsCrEKtgrfCuIK9AsHCwwLEgsXCyALJAswCzULPAtEC0gLTQtXC2QLaAtzC3kLhQuLC5ALnAusC7cLwQvHC88L1wvhC+sL+wwLDA4MEAwUDBoMHQwjDCcMLAw0DDkMPgxBDUYMUwxaDGM==';
const MAGIC_SOUND_BASE64 = 'UklGRqYDAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YVgDAAA9/3gAOf9zAD//bAA//2MAQf9jAEX/YwBF/2MAQv9jAEP/ZgBB/2kAQf9tAEH/cgA//3MAQf95AD//fgA//4UAQACLAEEAlwA//5wAQACpAD//rQA//7QAPP+6ADz/wQA7/8YAO//IADv/zwA7/9QAOv/ZADr/3wA6/wA/AA==';

export const playClickSound = () => playSound('click', CLICK_SOUND_BASE64);
export const playSuccessSound = () => playSound('success', SUCCESS_SOUND_BASE64);
export const playToggleSound = () => playSound('toggle', TOGGLE_SOUND_BASE64);
export const playCompleteSound = () => playSound('complete', COMPLETE_SOUND_BASE64);
export const playMagicSound = () => playSound('magic', MAGIC_SOUND_BASE64);