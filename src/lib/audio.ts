import { usePreferencesStore } from '@/stores/preferences';

/**
 * Wrapper delgado sobre Web Speech Synthesis + un beep sintetizado
 * con WebAudio (sin assets). Todas las llamadas respetan la preferencia
 * `soundEnabled` — si el sonido está apagado, son no-ops silenciosos.
 */

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!audioCtx) audioCtx = new Ctor();
  return audioCtx;
}

/** Beep sintetizado. `kind`: éxito (subida), fallo (bajada), suave. */
export function playBeep(kind: 'good' | 'bad' | 'tick' = 'tick'): void {
  const enabled = usePreferencesStore.getState().soundEnabled;
  if (!enabled) return;
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;
    if (kind === 'good') {
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.linearRampToValueAtTime(990, now + 0.12);
    } else if (kind === 'bad') {
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.15);
    } else {
      osc.frequency.setValueAtTime(500, now);
    }
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.15, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.start(now);
    osc.stop(now + 0.28);
  } catch {
    // Silencioso — si WebAudio falla, no rompemos la UX.
  }
}

/**
 * Lectura por voz. Si el navegador no soporta o el sonido está apagado, no hace nada.
 * `lang` es un BCP-47 tag: 'en-GB', 'es-ES', 'ca-ES'.
 */
export function speak(text: string, lang: string): void {
  const enabled = usePreferencesStore.getState().soundEnabled;
  if (!enabled) return;
  if (typeof window === 'undefined') return;
  const synth = window.speechSynthesis;
  if (!synth) return;
  try {
    // Corta cualquier lectura previa para no encadenar audios superpuestos.
    synth.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.9;
    utter.pitch = 1;
    synth.speak(utter);
  } catch {
    // Silencioso.
  }
}

/**
 * Extrae el texto legible de una `Localized`, quitando emojis para que la voz
 * no lea "cuadrado rojo" ni "medalla". Devuelve `null` si no queda nada útil.
 */
export function stripForSpeech(input: string): string | null {
  // Quita emojis básicos y símbolos decorativos.
  const cleaned = input
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  return cleaned.length > 0 ? cleaned : null;
}
