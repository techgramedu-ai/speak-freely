import { useState, useRef, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

interface UseTTSOptions {
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

export const useTTS = (options: UseTTSOptions = {}) => {
  const { voiceId = "EXAVITQu4vr4xnSDxMaL", onStart, onEnd, onError } = options;
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const { toast } = useToast();

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(async (text: string) => {
    if (!text || text.trim().length === 0) return;
    
    // Stop any current audio
    stop();
    
    setIsLoading(true);
    
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
        const error = await response.json();
        throw new Error(error.error || "TTS request failed");
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
      console.error("TTS error:", err);
      setError(errorMessage);
      setIsSpeaking(false);
      onError?.(errorMessage);
      
      // Show toast for quota/credit errors
      if (errorMessage.includes("quota") || errorMessage.includes("401") || errorMessage.includes("402")) {
        toast({
          variant: "destructive",
          title: "Voice credits exhausted",
          description: "Text responses will continue without voice. Add ElevenLabs credits to restore voice.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [voiceId, stop, onStart, onEnd, onError, toast]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
  };
};
