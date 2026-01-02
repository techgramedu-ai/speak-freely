import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseTTSOptions {
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

// Browser Speech Synthesis fallback
const speakWithBrowser = (text: string, onStart?: () => void, onEnd?: () => void): boolean => {
  if (!('speechSynthesis' in window)) {
    return false;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'en-IN'; // Indian English
  utterance.rate = 0.9;
  utterance.pitch = 1.1;
  
  // Try to find an Indian English voice
  const voices = window.speechSynthesis.getVoices();
  const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi'));
  if (indianVoice) {
    utterance.voice = indianVoice;
  }
  
  utterance.onstart = () => onStart?.();
  utterance.onend = () => onEnd?.();
  utterance.onerror = () => onEnd?.();
  
  window.speechSynthesis.speak(utterance);
  return true;
};

export const useTTS = (options: UseTTSOptions = {}) => {
  const { voiceId = "EXAVITQu4vr4xnSDxMaL", onStart, onEnd, onError } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const { toast } = useToast();

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    // Also stop browser speech synthesis
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text || text.trim().length === 0) return;
    
    // Stop any current audio
    stop();
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/elevenlabs-tts`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ text, voiceId }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "TTS request failed");
      }

      const audioBlob = await response.blob();
      
      // Cleanup previous URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      
      const audioUrl = URL.createObjectURL(audioBlob);
      audioUrlRef.current = audioUrl;
      
      const audio = new Audio(audioUrl);
      audioRef.current = audio;
      
      audio.onplay = () => {
        setIsSpeaking(true);
        setUsingFallback(false);
        onStart?.();
      };
      
      audio.onended = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      
      audio.onerror = () => {
        setIsSpeaking(false);
        onEnd?.();
      };
      
      await audio.play();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "TTS failed";
      console.error("ElevenLabs TTS error, trying browser fallback:", err);
      
      // Try browser fallback
      const fallbackSuccess = speakWithBrowser(
        text,
        () => {
          setIsSpeaking(true);
          setUsingFallback(true);
          onStart?.();
        },
        () => {
          setIsSpeaking(false);
          onEnd?.();
        }
      );
      
      if (fallbackSuccess) {
        setIsLoading(false);
        // Show info toast only once about fallback
        if (!usingFallback) {
          toast({
            title: "Using browser voice",
            description: "ElevenLabs credits exhausted. Using browser speech synthesis.",
          });
        }
        return;
      }
      
      // Both failed
      setError(errorMessage);
      setIsSpeaking(false);
      onError?.(errorMessage);
      
      toast({
        variant: "destructive",
        title: "Voice unavailable",
        description: "Text responses will continue without voice.",
      });
    } finally {
      setIsLoading(false);
    }
  }, [voiceId, stop, onStart, onEnd, onError, toast, usingFallback]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
    usingFallback,
  };
};
