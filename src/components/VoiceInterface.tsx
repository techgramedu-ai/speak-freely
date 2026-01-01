import { useConversation } from "@elevenlabs/react";
import { useState, useCallback } from "react";
import { Mic, MicOff, Phone, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import VoiceOrb from "./VoiceOrb";

const AGENT_ID = "agent_8001kdx2vrjdf4tamc70zbtjmd4e";

const VoiceInterface = () => {
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  const conversation = useConversation({
    onConnect: () => {
      console.log("Connected to agent");
      toast({
        title: "Connected",
        description: "You're now connected. Start speaking!",
      });
    },
    onDisconnect: () => {
      console.log("Disconnected from agent");
    },
    onError: (error) => {
      console.error("Conversation error:", error);
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Failed to connect. Please try again.",
      });
      setIsConnecting(false);
    },
  });

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      
      await conversation.startSession({
        agentId: AGENT_ID,
        connectionType: "webrtc",
      });
    } catch (error) {
      console.error("Failed to start conversation:", error);
      toast({
        variant: "destructive",
        title: "Microphone Access Required",
        description: "Please enable microphone access to use voice features.",
      });
    } finally {
      setIsConnecting(false);
    }
  }, [conversation, toast]);

  const stopConversation = useCallback(async () => {
    await conversation.endSession();
    toast({
      title: "Disconnected",
      description: "Conversation ended.",
    });
  }, [conversation, toast]);

  const isConnected = conversation.status === "connected";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-12 px-4">
      {/* Background gradient */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08),transparent_70%)] pointer-events-none" />
      
      {/* Title */}
      <div className="relative text-center space-y-2">
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">
          <span className="text-gradient">Voice</span> Assistant
        </h1>
        <p className="text-muted-foreground text-lg">
          {isConnected 
            ? "I'm listening. Ask me anything." 
            : "Tap the button to start a conversation"
          }
        </p>
      </div>

      {/* Voice Orb */}
      <VoiceOrb 
        isConnected={isConnected} 
        isSpeaking={conversation.isSpeaking}
        isConnecting={isConnecting}
      />

      {/* Control Button */}
      <div className="relative flex flex-col items-center gap-6">
        {!isConnected ? (
          <Button
            onClick={startConversation}
            disabled={isConnecting}
            size="lg"
            className="h-16 px-8 rounded-full bg-gradient-to-r from-primary to-accent text-primary-foreground font-medium text-lg shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mr-3" />
                Connecting...
              </>
            ) : (
              <>
                <Mic className="w-5 h-5 mr-3" />
                Start Conversation
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={stopConversation}
            size="lg"
            variant="outline"
            className="h-16 px-8 rounded-full border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground font-medium text-lg transition-all duration-300 hover:scale-105"
          >
            <PhoneOff className="w-5 h-5 mr-3" />
            End Conversation
          </Button>
        )}

        {/* Status text */}
        <p className="text-sm font-mono text-muted-foreground/60 uppercase tracking-wider">
          {isConnected ? "Session Active" : "Ready to Connect"}
        </p>
      </div>

      {/* Footer hint */}
      <div className="fixed bottom-8 text-center">
        <p className="text-xs text-muted-foreground/40">
          Powered by ElevenLabs Conversational AI
        </p>
      </div>
    </div>
  );
};

export default VoiceInterface;