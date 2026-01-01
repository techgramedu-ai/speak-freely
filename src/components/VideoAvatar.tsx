import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import aiTutorVideo from "@/assets/ai-tutor-avatar.mp4";

interface VideoAvatarProps {
  isSpeaking?: boolean;
  className?: string;
}

const VideoAvatar = ({ isSpeaking = false, className = "" }: VideoAvatarProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error);
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      {/* Glow effect behind avatar */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/30 via-teal-400/20 to-purple-500/30 blur-2xl"
        animate={{
          scale: isSpeaking ? [1, 1.15, 1] : [1, 1.05, 1],
          opacity: isSpeaking ? [0.6, 0.9, 0.6] : [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: isSpeaking ? 0.8 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Video container */}
      <motion.div
        className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_30px_rgba(0,242,234,0.3)]"
        animate={{
          boxShadow: isSpeaking
            ? [
                "0 0 30px rgba(0,242,234,0.3)",
                "0 0 60px rgba(0,242,234,0.5)",
                "0 0 30px rgba(0,242,234,0.3)",
              ]
            : "0 0 30px rgba(0,242,234,0.3)",
        }}
        transition={{
          duration: 0.5,
          repeat: isSpeaking ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        <video
          ref={videoRef}
          src={aiTutorVideo}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Holographic overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-cosmic-dark/30 via-transparent to-cyan-400/10 pointer-events-none" />

        {/* Speaking indicator */}
        {isSpeaking && (
          <motion.div
            className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-cosmic-dark/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-cyan-400/40"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-cyan-400"
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 0.5, repeat: Infinity }}
            />
            <span className="text-xs text-cyan-300 font-medium">Speaking</span>
          </motion.div>
        )}
      </motion.div>

      {/* Name badge */}
      <motion.div
        className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-cyan-500/90 to-teal-500/90 px-4 py-1 rounded-full border border-cyan-300/50 shadow-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-white text-sm font-semibold">Priya AI</span>
      </motion.div>
    </div>
  );
};

export default VideoAvatar;
