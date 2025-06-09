import { useState, useEffect, useCallback, useRef } from 'react';

interface Voice {
  name: string;
  language: string;
  gender: 'male' | 'female';
  region?: string;
  description?: string;
}

interface TTSState {
  isPlaying: boolean;
  isSupported: boolean;
  error: string | null;
  currentVoice: Voice | null;
  availableVoices: Voice[];
  playbackRate: number;
  volume: number;
}

interface UseTTSOptions {
  defaultVoice?: string;
  defaultPlaybackRate?: number;
  defaultVolume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Default German voices
const DEFAULT_GERMAN_VOICES: Voice[] = [
  {
    name: 'de-DE-Wavenet-A',
    language: 'de-DE',
    gender: 'female',
    region: 'Germany',
    description: 'Anna - Young female voice',
  },
  {
    name: 'de-DE-Wavenet-B',
    language: 'de-DE',
    gender: 'male',
    region: 'Germany',
    description: 'Hans - Young male voice',
  },
  {
    name: 'de-DE-Wavenet-C',
    language: 'de-DE',
    gender: 'female',
    region: 'Germany',
    description: 'Maria - Mature female voice',
  },
  {
    name: 'de-DE-Wavenet-D',
    language: 'de-DE',
    gender: 'male',
    region: 'Germany',
    description: 'Klaus - Mature male voice',
  },
  {
    name: 'de-AT-Wavenet-A',
    language: 'de-AT',
    gender: 'female',
    region: 'Austria',
    description: 'Sofia - Austrian female voice',
  },
  {
    name: 'de-CH-Wavenet-A',
    language: 'de-CH',
    gender: 'female',
    region: 'Switzerland',
    description: 'Lena - Swiss female voice',
  },
];

export const useTextToSpeech = (options: UseTTSOptions = {}) => {
  const {
    defaultVoice = 'de-DE-Wavenet-A',
    defaultPlaybackRate = 1.0,
    defaultVolume = 1.0,
    onStart,
    onEnd,
    onError,
  } = options;

  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isSupported: false,
    error: null,
    currentVoice: null,
    availableVoices: DEFAULT_GERMAN_VOICES,
    playbackRate: defaultPlaybackRate,
    volume: defaultVolume,
  });

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Check if speech synthesis is supported
  useEffect(() => {
    const isSupported = 'speechSynthesis' in window;
    setState(prev => ({ ...prev, isSupported }));

    if (isSupported) {
      // Set default voice
      const defaultVoiceObj = DEFAULT_GERMAN_VOICES.find(v => v.name === defaultVoice);
      setState(prev => ({ ...prev, currentVoice: defaultVoiceObj || DEFAULT_GERMAN_VOICES[0] }));
    }
  }, [defaultVoice]);

  const speak = useCallback((text: string, voiceName?: string) => {
    if (!state.isSupported) {
      const error = 'Text-to-speech not supported in this browser';
      setState(prev => ({ ...prev, error }));
      onError?.(error);
      return;
    }

    try {
      // Stop any current speech
      if (utteranceRef.current) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      utteranceRef.current = utterance;

      // Set voice
      const targetVoice = voiceName 
        ? state.availableVoices.find(v => v.name === voiceName)
        : state.currentVoice;
      
      if (targetVoice) {
        utterance.voice = window.speechSynthesis.getVoices().find(v => v.name === targetVoice.name) || null;
      }

      // Set properties
      utterance.rate = state.playbackRate;
      utterance.volume = state.volume;
      utterance.lang = targetVoice?.language || 'de-DE';

      // Event handlers
      utterance.onstart = () => {
        setState(prev => ({ ...prev, isPlaying: true, error: null }));
        onStart?.();
      };

      utterance.onend = () => {
        setState(prev => ({ ...prev, isPlaying: false }));
        onEnd?.();
      };

      utterance.onerror = (event) => {
        const error = `TTS Error: ${event.error}`;
        setState(prev => ({ ...prev, isPlaying: false, error }));
        onError?.(error);
      };

      // Start speaking
      window.speechSynthesis.speak(utterance);

    } catch (error) {
      const errorMessage = `Failed to start speech: ${error}`;
      setState(prev => ({ ...prev, error: errorMessage }));
      onError?.(errorMessage);
    }
  }, [state.isSupported, state.currentVoice, state.availableVoices, state.playbackRate, state.volume, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (state.isSupported) {
      window.speechSynthesis.cancel();
      setState(prev => ({ ...prev, isPlaying: false }));
    }
  }, [state.isSupported]);

  const pause = useCallback(() => {
    if (state.isSupported) {
      window.speechSynthesis.pause();
    }
  }, [state.isSupported]);

  const resume = useCallback(() => {
    if (state.isSupported) {
      window.speechSynthesis.resume();
    }
  }, [state.isSupported]);

  const setVoice = useCallback((voiceName: string) => {
    const voice = state.availableVoices.find(v => v.name === voiceName);
    if (voice) {
      setState(prev => ({ ...prev, currentVoice: voice }));
    }
  }, [state.availableVoices]);

  const setPlaybackRate = useCallback((rate: number) => {
    setState(prev => ({ ...prev, playbackRate: Math.max(0.1, Math.min(10, rate)) }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    setState(prev => ({ ...prev, volume: Math.max(0, Math.min(1, volume)) }));
  }, []);

  const reset = useCallback(() => {
    stop();
    setState(prev => ({
      ...prev,
      error: null,
      playbackRate: defaultPlaybackRate,
      volume: defaultVolume,
    }));
  }, [stop, defaultPlaybackRate, defaultVolume]);

  // Get available voices from browser
  const loadBrowserVoices = useCallback(() => {
    if (state.isSupported) {
      const voices = window.speechSynthesis.getVoices();
      const germanVoices = voices
        .filter(voice => voice.lang.startsWith('de'))
        .map(voice => ({
          name: voice.name,
          language: voice.lang,
          gender: voice.name.includes('female') ? 'female' as const : 'male' as const,
          region: voice.lang.includes('AT') ? 'Austria' : voice.lang.includes('CH') ? 'Switzerland' : 'Germany',
          description: `${voice.name} (${voice.lang})`,
        }));

      if (germanVoices.length > 0) {
        setState(prev => ({ 
          ...prev, 
          availableVoices: [...DEFAULT_GERMAN_VOICES, ...germanVoices]
        }));
      }
    }
  }, [state.isSupported]);

  // Load voices when they become available
  useEffect(() => {
    if (state.isSupported) {
      if (window.speechSynthesis.getVoices().length > 0) {
        loadBrowserVoices();
      } else {
        window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
      }
    }
  }, [state.isSupported, loadBrowserVoices]);

  return {
    ...state,
    speak,
    stop,
    pause,
    resume,
    setVoice,
    setPlaybackRate,
    setVolume,
    reset,
    loadBrowserVoices,
  };
}; 