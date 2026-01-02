import { useState, useCallback, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface UsePriyaAIOptions {
  studentName?: string;
  topic?: string;
  confidenceLevel?: number;
  onMessageUpdate?: (content: string) => void;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/priya-ai-chat`;

export const usePriyaAI = (options: UsePriyaAIOptions = {}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const { toast } = useToast();

  const streamChat = useCallback(
    async (userMessage: string) => {
      if (!userMessage.trim()) return;

      // Add user message immediately
      const userMsg: Message = { role: "user", content: userMessage };
      setMessages((prev) => [...prev, userMsg]);
      setIsLoading(true);
      setIsStreaming(true);

      // Create abort controller for cancellation
      abortControllerRef.current = new AbortController();

      let assistantContent = "";

      try {
        const response = await fetch(CHAT_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({
            messages: [...messages, userMsg],
            studentName: options.studentName,
            topic: options.topic,
            confidenceLevel: options.confidenceLevel,
          }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          
          if (response.status === 429) {
            toast({
              variant: "destructive",
              title: "Rate Limited",
              description: "Too many requests. Please wait a moment.",
            });
            throw new Error("Rate limited");
          }
          if (response.status === 402) {
            toast({
              variant: "destructive",
              title: "Credits Depleted",
              description: "AI credits have run out. Please add more credits.",
            });
            throw new Error("Credits depleted");
          }
          throw new Error(errorData.error || "Failed to connect to Priya AI");
        }

        if (!response.body) {
          throw new Error("No response body");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let textBuffer = "";

        // Add empty assistant message that we'll update
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          textBuffer += decoder.decode(value, { stream: true });

          // Process SSE lines
          let newlineIndex: number;
          while ((newlineIndex = textBuffer.indexOf("\n")) !== -1) {
            let line = textBuffer.slice(0, newlineIndex);
            textBuffer = textBuffer.slice(newlineIndex + 1);

            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;

            const jsonStr = line.slice(6).trim();
            if (jsonStr === "[DONE]") break;

            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                assistantContent += content;
                // Update the last assistant message
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 && m.role === "assistant"
                      ? { ...m, content: assistantContent }
                      : m
                  )
                );
                options.onMessageUpdate?.(assistantContent);
              }
            } catch {
              // Incomplete JSON, put it back
              textBuffer = line + "\n" + textBuffer;
              break;
            }
          }
        }

        // Final flush
        if (textBuffer.trim()) {
          for (let raw of textBuffer.split("\n")) {
            if (!raw) continue;
            if (raw.endsWith("\r")) raw = raw.slice(0, -1);
            if (raw.startsWith(":") || raw.trim() === "") continue;
            if (!raw.startsWith("data: ")) continue;
            const jsonStr = raw.slice(6).trim();
            if (jsonStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(jsonStr);
              const content = parsed.choices?.[0]?.delta?.content as string | undefined;
              if (content) {
                assistantContent += content;
                setMessages((prev) =>
                  prev.map((m, i) =>
                    i === prev.length - 1 && m.role === "assistant"
                      ? { ...m, content: assistantContent }
                      : m
                  )
                );
              }
            } catch {
              /* ignore */
            }
          }
        }
      } catch (error) {
        if ((error as Error).name === "AbortError") {
          console.log("Request cancelled");
        } else {
          console.error("Priya AI error:", error);
          toast({
            variant: "destructive",
            title: "Connection Error",
            description: "Failed to connect to Priya AI. Please try again.",
          });
          // Remove the empty assistant message on error
          setMessages((prev) => prev.filter((_, i) => i !== prev.length - 1 || prev[i].content !== ""));
        }
      } finally {
        setIsLoading(false);
        setIsStreaming(false);
        abortControllerRef.current = null;
      }
    },
    [messages, options, toast]
  );

  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const startSession = useCallback(async () => {
    // Send initial greeting prompt
    await streamChat("Namaste! I'm ready to start my learning session. Please introduce yourself and help me learn.");
  }, [streamChat]);

  return {
    messages,
    isLoading,
    isStreaming,
    sendMessage: streamChat,
    cancelRequest,
    clearMessages,
    startSession,
  };
};
