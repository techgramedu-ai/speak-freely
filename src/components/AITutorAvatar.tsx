import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Mic, MicOff, Volume2 } from "lucide-react";

interface AITutorAvatarProps {
  userName?: string;
  isSessionMode?: boolean;
  onStartSession?: () => void;
}

const AITutorAvatar = ({ userName = "Student", isSessionMode = false, onStartSession }: AITutorAvatarProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const greetings = [
    `Namaste ${userName}! 🙏 Ready to conquer today's goals?`,
    `Welcome back, ${userName}! Let's make today amazing!`,
    `Hey ${userName}! Your learning universe awaits!`,
    `Great to see you, ${userName}! What shall we explore today?`,
  ];

  const tips = [
    "💡 Tip: Break complex topics into smaller chunks for better understanding!",
    "🎯 Remember: Consistency beats intensity. Just 40 minutes daily works wonders!",
    "🧠 Fun fact: Teaching others helps you retain 90% of what you learn!",
    "⭐ You're doing great! Every session brings you closer to mastery.",
  ];

  useEffect(() => {
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    typeMessage(greeting);
  }, [userName]);

  const typeMessage = (message: string) => {
    setIsTyping(true);
    setCurrentMessage("");
    let i = 0;
    const interval = setInterval(() => {
      if (i < message.length) {
        setCurrentMessage(prev => prev + message[i]);
        i++;
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 30);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(currentMessage.replace(/[🙏💡🎯🧠⭐]/g, ''));
      utterance.lang = 'en-IN';
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // Voice recognition would be implemented here
  };

  if (isSessionMode) {
    return (
      <motion.div
        className="relative w-full max-w-md mx-auto"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Large Session Avatar */}
        <div className="relative">
          {/* Glowing ring */}
          <motion.div
            className="absolute -inset-4 rounded-full bg-gradient-to-r from-cyan-500/30 via-purple-500/30 to-cyan-500/30 blur-xl"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          
          {/* Avatar container */}
          <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(0,242,234,0.3)]">
            <div className="aspect-[4/5] bg-gradient-to-br from-slate-800 via-slate-900 to-purple-900/50 flex items-center justify-center">
              {/* Animated avatar placeholder */}
              <motion.div
                className="relative"
                animate={{ y: [0, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center">
                  <motion.div
                    className="w-40 h-40 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center overflow-hidden"
                    animate={{ scale: isSpeaking ? [1, 1.02, 1] : 1 }}
                    transition={{ duration: 0.3, repeat: isSpeaking ? Infinity : 0 }}
                  >
                    {/* AI Avatar Face */}
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="text-6xl">👩‍🏫</div>
                      {/* Speaking indicator */}
                      {isSpeaking && (
                        <motion.div
                          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-2 h-2 bg-cyan-400 rounded-full"
                              animate={{ scaleY: [1, 2, 1] }}
                              transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                            />
                          ))}
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                </div>
                
                {/* Holographic effect */}
                <motion.div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background: "linear-gradient(45deg, transparent, rgba(0, 242, 234, 0.1), transparent)",
                  }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            </div>
            
            {/* Name plate */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 via-slate-900/90 to-transparent p-4 text-center">
              <h3 className="text-xl font-poppins font-bold text-cyan-400">Priya</h3>
              <p className="text-sm text-gray-400">Your AI Tutor</p>
            </div>
          </div>
          
          {/* Voice controls */}
          <div className="flex justify-center gap-4 mt-4">
            <motion.button
              onClick={handleSpeak}
              className="p-3 rounded-full bg-slate-800 border border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Volume2 className={`w-5 h-5 ${isSpeaking ? "animate-pulse" : ""}`} />
            </motion.button>
            <motion.button
              onClick={toggleListening}
              className={`p-3 rounded-full border ${isListening ? "bg-cyan-400/20 border-cyan-400 text-cyan-400" : "bg-slate-800 border-gray-600 text-gray-400"}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  // Floating bubble mode
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 w-80 rounded-2xl border-2 border-cyan-400/40 bg-gradient-to-br from-slate-900/95 via-slate-800/95 to-slate-900/95 backdrop-blur-xl shadow-[0_0_40px_rgba(0,242,234,0.2)] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-purple-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border border-cyan-400/40 flex items-center justify-center text-xl">
                  👩‍🏫
                </div>
                <div>
                  <h4 className="font-semibold text-white">Priya</h4>
                  <p className="text-xs text-cyan-400">Your AI Tutor</p>
                </div>
              </div>
              <button onClick={() => setIsExpanded(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Message */}
            <div className="p-4">
              <p className="text-gray-200 text-sm leading-relaxed">
                {currentMessage}
                {isTyping && <span className="animate-pulse">|</span>}
              </p>
            </div>
            
            {/* Actions */}
            <div className="p-4 pt-0 flex gap-2">
              <motion.button
                onClick={handleSpeak}
                className="flex-1 py-2 px-4 rounded-lg bg-slate-800 border border-cyan-400/30 text-cyan-400 text-sm font-medium hover:bg-cyan-400/10 transition-colors flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Volume2 className="w-4 h-4" />
                Listen
              </motion.button>
              {onStartSession && (
                <motion.button
                  onClick={onStartSession}
                  className="flex-1 py-2 px-4 rounded-lg bg-gradient-to-r from-cyan-400 to-teal-400 text-slate-900 text-sm font-semibold shadow-[0_0_20px_rgba(0,242,234,0.3)]"
                  whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(0,242,234,0.5)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Session
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating avatar bubble */}
      <motion.button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative w-16 h-16 rounded-full border-2 border-cyan-400/60 bg-gradient-to-br from-slate-800 to-slate-900 shadow-[0_0_30px_rgba(0,242,234,0.4)] flex items-center justify-center overflow-hidden"
        whileHover={{ scale: 1.1, boxShadow: "0 0 50px rgba(0,242,234,0.6)" }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isExpanded
            ? "0 0 30px rgba(0,242,234,0.4)"
            : ["0 0 20px rgba(0,242,234,0.3)", "0 0 40px rgba(0,242,234,0.5)", "0 0 20px rgba(0,242,234,0.3)"],
        }}
        transition={{ duration: 2, repeat: isExpanded ? 0 : Infinity }}
      >
        <span className="text-3xl">👩‍🏫</span>
        
        {/* Notification dot */}
        {!isExpanded && (
          <motion.div
            className="absolute -top-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border-2 border-slate-900"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default AITutorAvatar;