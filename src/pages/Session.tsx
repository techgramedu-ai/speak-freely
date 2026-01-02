import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Pause, Play, Send, Volume2, VolumeX, 
  CheckCircle, XCircle, Award, RotateCcw,
  RefreshCw, Languages, Gauge, HelpCircle, Sparkles, MessageSquare
} from "lucide-react";
import CosmicBackground from "@/components/ui/CosmicBackground";
import GlowCard from "@/components/ui/GlowCard";
import NeonButton from "@/components/ui/NeonButton";
import VideoAvatar from "@/components/VideoAvatar";
import { useToast } from "@/hooks/use-toast";
import { usePriyaAI } from "@/hooks/usePriyaAI";
import { useTTS } from "@/hooks/useTTS";

type SessionPhase = "pre" | "teaching" | "post" | "quiz" | "complete";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correct: number;
}

const Session = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [phase, setPhase] = useState<SessionPhase>("pre");
  const [timeLeft, setTimeLeft] = useState(40 * 60);
  const [isPaused, setIsPaused] = useState(true);
  const [message, setMessage] = useState("");
  const [isMuted, setIsMuted] = useState(false);
  const [preAnswers, setPreAnswers] = useState<string[]>([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confidenceLevel, setConfidenceLevel] = useState<number | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // TTS hook for voice output
  const tts = useTTS({
    voiceId: "EXAVITQu4vr4xnSDxMaL",
  });

  // Priya AI text chat hook (Lovable AI) with TTS on message complete
  const priyaAI = usePriyaAI({
    studentName: "Student",
    topic: "Quadratic Equations",
    confidenceLevel: confidenceLevel || undefined,
    onMessageComplete: (content) => {
      if (!isMuted && content) {
        tts.speak(content);
      }
    },
  });

  const isSpeaking = tts.isSpeaking;

  const preSessionQuestions = [
    "What do you already know about Quadratic Equations?",
    "Have you faced any specific difficulties with this topic before?",
    "What's your learning goal for today's session?",
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: 1,
      question: "The standard form of a quadratic equation is:",
      options: ["ax + b = 0", "ax² + bx + c = 0", "ax³ + bx² + cx = 0", "a/x + b = 0"],
      correct: 1,
    },
    {
      id: 2,
      question: "If the discriminant (b² - 4ac) is negative, the equation has:",
      options: ["Two real roots", "One real root", "No real roots", "Infinite roots"],
      correct: 2,
    },
    {
      id: 3,
      question: "The sum of roots of ax² + bx + c = 0 is:",
      options: ["b/a", "-b/a", "c/a", "-c/a"],
      correct: 1,
    },
    {
      id: 4,
      question: "Which method involves making one side a perfect square?",
      options: ["Factorization", "Formula method", "Completing the square", "Graphical method"],
      correct: 2,
    },
    {
      id: 5,
      question: "The product of roots of ax² + bx + c = 0 is:",
      options: ["b/a", "-b/a", "c/a", "-c/a"],
      correct: 2,
    },
    {
      id: 6,
      question: "For a quadratic equation to have equal roots, discriminant must be:",
      options: ["Positive", "Negative", "Zero", "Any value"],
      correct: 2,
    },
    {
      id: 7,
      question: "The graph of a quadratic equation is called:",
      options: ["Circle", "Parabola", "Hyperbola", "Ellipse"],
      correct: 1,
    },
    {
      id: 8,
      question: "If α and β are roots, then α + β equals:",
      options: ["b/a", "-b/a", "c/a", "-c/a"],
      correct: 1,
    },
    {
      id: 9,
      question: "The quadratic formula gives roots as:",
      options: ["(-b ± √(b²-4ac))/2a", "(b ± √(b²-4ac))/2a", "(-b ± √(b²+4ac))/2a", "(b ± √(b²+4ac))/2a"],
      correct: 0,
    },
    {
      id: 10,
      question: "If one root is 3, and product of roots is 6, the other root is:",
      options: ["2", "3", "6", "9"],
      correct: 0,
    },
  ];

  useEffect(() => {
    if (!isPaused && phase === "teaching" && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isPaused, phase, timeLeft]);

  useEffect(() => {
    if (timeLeft === 0 && phase === "teaching") {
      setPhase("post");
      tts.stop();
    }
  }, [timeLeft, phase, tts]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMessage = message.trim();
    setMessage("");
    await priyaAI.sendMessage(userMessage);
  };

  const handlePreAnswerSubmit = (answer: string) => {
    setPreAnswers([...preAnswers, answer]);
    if (preAnswers.length >= preSessionQuestions.length - 1) {
      setTimeout(() => {
        setPhase("teaching");
        setIsPaused(false);
        toast({
          title: "Session Starting! 🚀",
          description: "Start learning with Priya AI",
        });
        priyaAI.startSession();
      }, 1000);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [priyaAI.messages]);

  const handleQuizAnswer = (answerIndex: number) => {
    setQuizAnswers([...quizAnswers, answerIndex]);
    if (currentQuizQuestion < quizQuestions.length - 1) {
      setCurrentQuizQuestion(currentQuizQuestion + 1);
    } else {
      setPhase("complete");
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const calculateScore = () => {
    let correct = 0;
    quizAnswers.forEach((answer, idx) => {
      if (answer === quizQuestions[idx].correct) correct++;
    });
    return correct;
  };

  const handleQuickAction = (prompt: string) => {
    priyaAI.sendMessage(prompt);
  };

  const quickActions = [
    { icon: RefreshCw, label: "Explain again", action: () => handleQuickAction("Can you explain that again more clearly?") },
    { icon: HelpCircle, label: "Give example", action: () => handleQuickAction("Can you give me a real-life Indian example?") },
    { icon: Gauge, label: "Slow down", action: () => handleQuickAction("Please slow down a bit and explain step by step.") },
    { icon: Languages, label: "Switch to Hindi", action: () => handleQuickAction("Please explain in Hindi now.") },
  ];

  const displayMessages = priyaAI.messages.map(m => ({ 
    role: m.role === "assistant" ? "ai" as const : "user" as const, 
    content: m.content 
  }));

  const renderPhaseContent = () => {
    switch (phase) {
      case "pre":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <GlowCard>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-poppins font-bold text-foreground mb-2">Before We Begin... 🎯</h2>
                <p className="text-muted-foreground">Priya AI wants to understand your current knowledge</p>
              </div>

              {confidenceLevel === null && (
                <motion.div className="mb-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <p className="text-foreground mb-3">How confident do you feel about this topic? (1-5)</p>
                  <div className="flex gap-2 justify-center">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <motion.button
                        key={level}
                        onClick={() => setConfidenceLevel(level)}
                        className="w-12 h-12 rounded-xl bg-cosmic-card border-2 border-cyan-400/30 text-foreground font-bold hover:border-cyan-400 hover:bg-cyan-400/10 transition-all"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {level}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}

              {confidenceLevel !== null && (
                <div className="space-y-6">
                  {preSessionQuestions.map((q, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: idx <= preAnswers.length ? 1 : 0.5, x: 0 }}
                      transition={{ delay: idx * 0.2 }}
                    >
                      <p className="text-foreground mb-3">{idx + 1}. {q}</p>
                      {idx === preAnswers.length ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Type your answer..."
                            className="flex-1 px-4 py-3 rounded-xl bg-cosmic-card border-2 border-cyan-400/20 text-foreground placeholder-muted-foreground focus:border-cyan-400/60 focus:outline-none"
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                handlePreAnswerSubmit((e.target as HTMLInputElement).value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                          <NeonButton
                            onClick={() => {
                              const input = document.querySelector('input[placeholder="Type your answer..."]') as HTMLInputElement;
                              if (input?.value) {
                                handlePreAnswerSubmit(input.value);
                                input.value = "";
                              }
                            }}
                            size="sm"
                          >
                            <Send className="w-4 h-4" />
                          </NeonButton>
                        </div>
                      ) : idx < preAnswers.length ? (
                        <p className="text-cyan-400 text-sm pl-4 border-l-2 border-cyan-400/40">
                          {preAnswers[idx]}
                        </p>
                      ) : null}
                    </motion.div>
                  ))}
                </div>
              )}
            </GlowCard>
          </motion.div>
        );

      case "teaching":
        return (
          <div className="grid lg:grid-cols-12 gap-4 h-full">
            {/* Left Panel - AI Tutor Video Avatar */}
            <div className="lg:col-span-3">
              <GlowCard className="h-full flex flex-col p-4">
                <VideoAvatar isSpeaking={isSpeaking || priyaAI.isStreaming} className="w-full aspect-[3/4] mb-4" />
                
                {/* Status indicator */}
                <div className="flex items-center justify-center gap-2 mb-3">
                  <motion.div 
                    className={`w-2 h-2 rounded-full ${priyaAI.isStreaming || isSpeaking ? 'bg-cyan-400' : 'bg-green-400'}`}
                    animate={priyaAI.isStreaming || isSpeaking ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {priyaAI.isStreaming ? "Priya is thinking..." : isSpeaking ? "Priya is speaking..." : "Ready to help"}
                  </span>
                </div>

                {/* Speaking/Streaming indicator */}
                <AnimatePresence>
                  {(isSpeaking || priyaAI.isStreaming) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-3 flex items-center justify-center gap-2"
                    >
                      <div className="flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <motion.div
                            key={i}
                            className="w-1 bg-cyan-400 rounded-full"
                            animate={{ height: [8, 20, 8] }}
                            transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-cyan-400">
                        {isSpeaking ? "Speaking..." : "Typing..."}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Mode Badge */}
                <div className="mt-auto pt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>Powered by Lovable AI</span>
                </div>
              </GlowCard>
            </div>

            {/* Center Panel - Teaching Area + Chat */}
            <div className="lg:col-span-6 flex flex-col gap-4">
              {/* Visual Teaching Area */}
              <GlowCard className="flex-1 min-h-[300px]">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Award className="w-5 h-5 text-cyan-400" />
                      Quadratic Equations
                    </h3>
                    <span className="text-xs text-muted-foreground bg-cosmic-card px-3 py-1 rounded-full border border-border/50">
                      Class 10 CBSE/ICSE
                    </span>
                  </div>
                  
                  <div className="flex-1 relative rounded-xl bg-gradient-to-br from-purple-900/20 to-cyan-900/20 border border-border/30 overflow-hidden flex items-center justify-center">
                    <motion.div
                      className="text-center"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="text-6xl mb-4">📐</div>
                      <p className="text-lg text-foreground font-medium">ax² + bx + c = 0</p>
                      <p className="text-sm text-muted-foreground mt-2">Standard Form of Quadratic Equation</p>
                    </motion.div>
                    
                    <motion.div
                      className="absolute top-4 left-4 text-sm text-muted-foreground bg-cosmic-card/80 px-3 py-1.5 rounded-full border border-cyan-400/20"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Discriminant: Δ = b² - 4ac
                    </motion.div>
                    <motion.div
                      className="absolute bottom-4 right-4 text-sm text-muted-foreground bg-cosmic-card/80 px-3 py-1.5 rounded-full border border-purple-400/20"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                    >
                      Roots: x = (-b ± √Δ) / 2a
                    </motion.div>
                  </div>
                </div>
              </GlowCard>

              {/* Chat Interface */}
              <GlowCard className="h-64">
                <div className="h-full flex flex-col">
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                    {displayMessages.length === 0 ? (
                      <div className="text-center text-muted-foreground py-8">
                        <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>Type your question to start learning!</p>
                      </div>
                    ) : (
                      <>
                        {displayMessages.map((msg, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                                msg.role === "user"
                                  ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/30"
                                  : "bg-purple-400/20 text-purple-100 border border-purple-400/30"
                              }`}
                            >
                              {msg.content || (
                                <motion.span
                                  animate={{ opacity: [0.5, 1, 0.5] }}
                                  transition={{ duration: 1, repeat: Infinity }}
                                >
                                  Priya is thinking...
                                </motion.span>
                              )}
                            </div>
                          </motion.div>
                        ))}
                        <div ref={chatEndRef} />
                      </>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && !priyaAI.isLoading && handleSendMessage()}
                      placeholder="Ask Priya anything..."
                      className="flex-1 px-4 py-2.5 rounded-xl bg-cosmic-card border border-border text-foreground placeholder-muted-foreground focus:border-cyan-400/60 focus:outline-none text-sm"
                      disabled={priyaAI.isLoading}
                    />
                    <NeonButton 
                      onClick={handleSendMessage} 
                      disabled={priyaAI.isLoading || !message.trim()} 
                      size="sm"
                    >
                      {priyaAI.isLoading ? (
                        <motion.div 
                          className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </NeonButton>
                  </div>
                </div>
              </GlowCard>
            </div>

            {/* Right Panel - Quick Actions */}
            <div className="lg:col-span-3">
              <GlowCard className="h-full flex flex-col p-4">
                <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400" />
                  Quick Actions
                </h4>

                <div className="space-y-2 flex-1">
                  {quickActions.map((action, idx) => (
                    <motion.button
                      key={idx}
                      onClick={action.action}
                      disabled={priyaAI.isLoading}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-cosmic-card border border-border/50 text-foreground hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      whileHover={{ scale: 1.02, x: 5 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <action.icon className="w-4 h-4 text-cyan-400" />
                      {action.label}
                    </motion.button>
                  ))}
                </div>

                {/* Volume control */}
                <div className="mt-4 pt-4 border-t border-border/30">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Audio</span>
                    <motion.button
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (!isMuted) tts.stop();
                      }}
                      className={`p-2 rounded-lg ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-cosmic-card text-foreground'} border border-border/50`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </motion.button>
                  </div>
                </div>

                <NeonButton 
                  onClick={() => {
                    tts.stop();
                    setPhase("post");
                  }} 
                  className="w-full mt-4"
                  variant="secondary"
                  size="sm"
                >
                  Complete Session →
                </NeonButton>
              </GlowCard>
            </div>
          </div>
        );

      case "post":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto"
          >
            <GlowCard>
              <div className="text-center mb-6">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-2xl font-poppins font-bold text-foreground mb-2">Session Complete!</h2>
                <p className="text-muted-foreground">How was your learning experience with Priya AI?</p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex gap-4 justify-center">
                  {["😟", "😐", "🙂", "😊", "🤩"].map((emoji, idx) => (
                    <motion.button
                      key={idx}
                      className="text-3xl p-2 rounded-xl hover:bg-cosmic-card transition-all"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => {
                        toast({
                          title: "Thank you for your feedback!",
                          description: "Your rating helps Priya AI improve.",
                        });
                      }}
                    >
                      {emoji}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <NeonButton 
                  onClick={() => setPhase("quiz")} 
                  className="w-full"
                >
                  Take Assessment Quiz 📝
                </NeonButton>
                <motion.button
                  onClick={() => navigate("/dashboard")}
                  className="w-full py-3 rounded-xl border border-border text-foreground hover:bg-cosmic-card transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Skip & Return to Dashboard
                </motion.button>
              </div>
            </GlowCard>
          </motion.div>
        );

      case "quiz":
        const currentQ = quizQuestions[currentQuizQuestion];
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-2xl mx-auto"
          >
            <GlowCard>
              <div className="flex items-center justify-between mb-6">
                <span className="text-sm text-muted-foreground">
                  Question {currentQuizQuestion + 1} of {quizQuestions.length}
                </span>
                <span className="text-cyan-400 font-medium">
                  {Math.round(((currentQuizQuestion) / quizQuestions.length) * 100)}% Complete
                </span>
              </div>

              <h3 className="text-xl font-medium text-foreground mb-6">{currentQ.question}</h3>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className="w-full text-left px-4 py-3 rounded-xl bg-cosmic-card border border-border/50 text-foreground hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all"
                    whileHover={{ scale: 1.02, x: 10 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 text-sm mr-3">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </motion.button>
                ))}
              </div>

              <div className="mt-6 h-1 bg-cosmic-card rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-cyan-400 to-teal-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuizQuestion + 1) / quizQuestions.length) * 100}%` }}
                />
              </div>
            </GlowCard>
          </motion.div>
        );

      case "complete":
        const score = calculateScore();
        const percentage = (score / quizQuestions.length) * 100;
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <GlowCard className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="mb-6"
              >
                {percentage >= 70 ? (
                  <div className="text-6xl">🏆</div>
                ) : percentage >= 50 ? (
                  <div className="text-6xl">⭐</div>
                ) : (
                  <div className="text-6xl">📚</div>
                )}
              </motion.div>

              <h2 className="text-2xl font-poppins font-bold text-foreground mb-2">
                {percentage >= 70 ? "Excellent Work!" : percentage >= 50 ? "Good Effort!" : "Keep Practicing!"}
              </h2>

              <div className="my-8">
                <div className="text-5xl font-bold text-cyan-400 mb-2">{score}/{quizQuestions.length}</div>
                <p className="text-muted-foreground">Questions Correct</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-cosmic-card rounded-xl p-4 border border-border/50">
                  <div className="text-2xl font-bold text-green-400">{score}</div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="bg-cosmic-card rounded-xl p-4 border border-border/50">
                  <div className="text-2xl font-bold text-red-400">{quizQuestions.length - score}</div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </div>

              <div className="flex gap-3">
                <NeonButton onClick={() => navigate("/dashboard")} className="flex-1">
                  Back to Dashboard
                </NeonButton>
                <motion.button
                  onClick={() => {
                    setPhase("pre");
                    setPreAnswers([]);
                    setQuizAnswers([]);
                    setCurrentQuizQuestion(0);
                    setTimeLeft(40 * 60);
                    setConfidenceLevel(null);
                    priyaAI.clearMessages();
                  }}
                  className="px-4 py-3 rounded-xl border border-border text-foreground hover:bg-cosmic-card transition-all"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RotateCcw className="w-5 h-5" />
                </motion.button>
              </div>
            </GlowCard>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-dark text-foreground relative overflow-hidden">
      <CosmicBackground />

      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: ["#00f2ea", "#22d3ee", "#a855f7", "#f97316", "#22c55e"][i % 5],
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ top: -20, opacity: 1 }}
                animate={{ top: "100vh", opacity: 0, rotate: Math.random() * 720 }}
                transition={{ duration: 2 + Math.random() * 2, delay: Math.random() * 0.5 }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <header className="relative z-10 p-4 flex items-center justify-between">
        <motion.button
          onClick={() => navigate("/dashboard")}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          whileHover={{ x: -5 }}
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Exit Session</span>
        </motion.button>

        {phase === "teaching" && (
          <div className="flex items-center gap-4">
            <motion.div
              className="flex items-center gap-3 bg-cosmic-card/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-400/30"
              animate={{
                borderColor: timeLeft < 300 ? ["rgba(239,68,68,0.5)", "rgba(239,68,68,0.8)", "rgba(239,68,68,0.5)"] : "rgba(0,242,234,0.3)",
              }}
              transition={{ duration: 1, repeat: timeLeft < 300 ? Infinity : 0 }}
            >
              <div className="relative w-10 h-10">
                <svg className="w-10 h-10 -rotate-90">
                  <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                  <motion.circle
                    cx="20"
                    cy="20"
                    r="16"
                    fill="none"
                    stroke="url(#timerGradient)"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeDasharray={100}
                    strokeDashoffset={100 - (timeLeft / (40 * 60)) * 100}
                  />
                  <defs>
                    <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00f2ea" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <span className={`font-mono text-lg ${timeLeft < 300 ? "text-red-400" : "text-cyan-400"}`}>
                {formatTime(timeLeft)}
              </span>
            </motion.div>

            <motion.button
              onClick={() => setIsPaused(!isPaused)}
              className="p-2 rounded-full bg-cosmic-card border border-border/50 text-foreground"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
            </motion.button>
          </div>
        )}

        <div className="w-24" />
      </header>

      <main className="relative z-10 container mx-auto px-4 py-4 h-[calc(100vh-80px)]">
        <AnimatePresence mode="wait">
          {renderPhaseContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Session;
