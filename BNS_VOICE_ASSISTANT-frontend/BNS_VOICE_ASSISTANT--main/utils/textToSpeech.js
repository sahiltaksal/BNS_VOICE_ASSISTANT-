// utils/textToSpeech.js
// Thin wrapper around the browser SpeechSynthesis API.

let preferredVoice = null;

function pickVoice() {
  if (typeof window === "undefined" || !window.speechSynthesis) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Prefer a natural-sounding English voice if available.
  const byName = voices.find((v) =>
    /Google UK English Female|Google US English|Samantha|Microsoft Aria/i.test(
      v.name
    )
  );
  return byName || voices.find((v) => v.lang?.startsWith("en")) || voices[0];
}

/**
 * Speak a line of text aloud.
 * @param {string} text
 * @param {{ onStart?: Function, onEnd?: Function, onError?: Function, rate?: number, pitch?: number }} opts
 * @returns {SpeechSynthesisUtterance|null}
 */
export function speak(text, opts = {}) {
  if (typeof window === "undefined" || !window.speechSynthesis || !text) {
    return null;
  }

  // Cancel anything currently queued/speaking so replies don't overlap.
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = opts.rate ?? 1;
  utterance.pitch = opts.pitch ?? 1;
  utterance.lang = "en-IN";

  if (!preferredVoice) preferredVoice = pickVoice();
  if (preferredVoice) utterance.voice = preferredVoice;

  utterance.onstart = () => opts.onStart?.();
  utterance.onend = () => opts.onEnd?.();
  utterance.onerror = (e) => opts.onError?.(e);

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if (typeof window !== "undefined" && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

export function isSpeechSynthesisSupported() {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

// Voice lists load asynchronously in some browsers — warm the cache once ready.
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    preferredVoice = pickVoice();
  };
}
