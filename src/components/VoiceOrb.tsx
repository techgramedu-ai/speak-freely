import { useEffect, useRef } from "react";

interface VoiceOrbProps {
  isConnected: boolean;
  isSpeaking: boolean;
  isConnecting: boolean;
}

const VoiceOrb = ({ isConnected, isSpeaking, isConnecting }: VoiceOrbProps) => {
  const orbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!orbRef.current) return;
    
    const orb = orbRef.current;
    
    if (isSpeaking) {
      orb.classList.add("animate-speaking");
      orb.classList.remove("animate-listening", "animate-float");
    } else if (isConnected) {
      orb.classList.add("animate-listening");
      orb.classList.remove("animate-speaking", "animate-float");
    } else {
      orb.classList.add("animate-float");
      orb.classList.remove("animate-speaking", "animate-listening");
    }
  }, [isConnected, isSpeaking]);

  const getOrbStyles = () => {
    if (isConnecting) {
      return "bg-gradient-to-br from-muted to-secondary opacity-60";
    }
    if (isSpeaking) {
      return "bg-gradient-to-br from-primary to-accent glow-intense";
    }
    if (isConnected) {
      return "bg-gradient-to-br from-accent to-primary glow";
    }
    return "bg-gradient-to-br from-secondary to-muted";
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer rings */}
      <div className="absolute w-80 h-80 rounded-full border border-primary/10 animate-pulse-ring" />
      <div className="absolute w-96 h-96 rounded-full border border-primary/5 animate-pulse-ring" style={{ animationDelay: "0.5s" }} />
      <div className="absolute w-[28rem] h-[28rem] rounded-full border border-accent/5 animate-pulse-ring" style={{ animationDelay: "1s" }} />
      
      {/* Glow backdrop */}
      {isConnected && (
        <div className="absolute w-64 h-64 rounded-full bg-primary/20 blur-3xl" />
      )}
      
      {/* Main orb */}
      <div
        ref={orbRef}
        className={`
          relative w-48 h-48 rounded-full transition-all duration-500
          flex items-center justify-center
          ${getOrbStyles()}
        `}
      >
        {/* Inner highlight */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-t from-transparent to-foreground/10" />
        
        {/* Center dot */}
        <div className={`
          w-3 h-3 rounded-full transition-all duration-300
          ${isConnected ? "bg-foreground" : "bg-muted-foreground"}
        `} />
      </div>
      
      {/* Status indicator */}
      {isConnected && (
        <div className="absolute -bottom-2 flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isSpeaking ? "bg-primary animate-pulse" : "bg-accent"}`} />
          <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
            {isSpeaking ? "Speaking" : "Listening"}
          </span>
        </div>
      )}
    </div>
  );
};

export default VoiceOrb;