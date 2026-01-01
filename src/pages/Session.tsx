import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Pause, Play, Send, Mic, MicOff, Volume2, VolumeX, CheckCircle, XCircle, Award, RotateCcw } from "lucide-react";
import CosmicBackground from "@/components/ui/CosmicBackground";
import GlowCard from "@/components/ui/GlowCard";
import NeonButton from "@/components/ui/NeonButton";
import VideoAvatar from "@/components/VideoAvatar";
import { useToast } from "@/hooks/use-toast";

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
  const [timeLeft, setTimeLeft] = useState(40 * 60); // 40 minutes
  const [isPaused, setIsPaused] = useState(true);
  const [message, setMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [chatHistory, setChatHistory] = useState<Array<{ role: "user" | "ai"; content: string }>>([]);
  const [preAnswers, setPreAnswers] = useState<string[]>([]);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

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

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;

    setChatHistory((prev) => [...prev, { role: "user", content: message }]);
    
    // Simulate AI response
    setTimeout(() => {
      const responses = [
        "Great question! Let me explain this with a visual diagram...",
        "Excellent! That shows you're understanding the concept well. Now let's dive deeper...",
        "I see what you mean. Let me break this down step by step...",
        "Perfect! You're making great progress. Here's another way to think about it...",
      ];
      setChatHistory((prev) => [
        ...prev,
        { role: "ai", content: responses[Math.floor(Math.random() * responses.length)] },
      ]);
    }, 1000);

    setMessage("");
  };

  const handlePreAnswerSubmit = (answer: string) => {
    setPreAnswers([...preAnswers, answer]);
    if (preAnswers.length >= preSessionQuestions.length - 1) {
      setTimeout(() => {
        setPhase("teaching");
        setIsPaused(false);
        toast({
          title: "Session Started! 🚀",
          description: "Your 40-minute learning session has begun.",
        });
      }, 1000);
    }
  };

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
                <h2 className="text-2xl font-poppins font-bold text-white mb-2">Before We Begin... 🎯</h2>
                <p className="text-gray-400">Let's understand your current knowledge</p>
              </div>

              <div className="space-y-6">
                {preSessionQuestions.map((q, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: idx <= preAnswers.length ? 1 : 0.5, x: 0 }}
                    transition={{ delay: idx * 0.2 }}
                  >
                    <p className="text-gray-200 mb-3">{idx + 1}. {q}</p>
                    {idx === preAnswers.length ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Type your answer..."
                          className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none"
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
            </GlowCard>
          </motion.div>
        );

      case "teaching":
        return (
          <div className="grid lg:grid-cols-3 gap-6 h-full">
            {/* AI Tutor Video Avatar */}
            <div className="lg:col-span-1">
              <GlowCard className="h-full flex flex-col items-center justify-center p-6">
                <VideoAvatar isSpeaking={!isPaused} className="w-full aspect-[3/4]" />
              </GlowCard>
            </div>

            {/* Teaching Content */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {/* Visual Teaching Area */}
              <GlowCard className="flex-1 min-h-[300px]">
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-poppins font-bold text-white">Quadratic Equations</h3>
                    <span className="text-xs text-cyan-400 bg-cyan-400/10 px-3 py-1 rounded-full">
                      Live Teaching
                    </span>
                  </div>

                  {/* Animated Diagram Placeholder */}
                  <div className="flex-1 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-gray-700/50 flex items-center justify-center relative overflow-hidden">
                    <motion.div
                      className="text-center"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <div className="text-4xl mb-4">📊</div>
                      <p className="text-xl font-mono text-cyan-400">ax² + bx + c = 0</p>
                      <p className="text-gray-400 mt-2">Interactive diagram showing here...</p>
                    </motion.div>

                    {/* Floating elements */}
                    <motion.div
                      className="absolute top-4 left-4 text-sm text-gray-400 bg-slate-800/80 px-3 py-1 rounded-full"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Discriminant: b² - 4ac
                    </motion.div>
                  </div>
                </div>
              </GlowCard>

              {/* Chat Interface */}
              <GlowCard className="h-80">
                <div className="h-full flex flex-col">
                  {/* Chat History */}
                  <div className="flex-1 overflow-y-auto space-y-3 mb-4">
                    {chatHistory.length === 0 ? (
                      <div className="text-center text-gray-500 py-8">
                        <p>Ask questions or discuss concepts with your AI Tutor</p>
                      </div>
                    ) : (
                      chatHistory.map((msg, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                              msg.role === "user"
                                ? "bg-cyan-400/20 text-cyan-100 border border-cyan-400/30"
                                : "bg-purple-400/20 text-purple-100 border border-purple-400/30"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>

                  {/* Input */}
                  <div className="flex gap-2">
                    <motion.button
                      onClick={() => setIsListening(!isListening)}
                      className={`p-3 rounded-xl ${
                        isListening ? "bg-cyan-400/20 text-cyan-400" : "bg-slate-800 text-gray-400"
                      } border border-gray-700`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {isListening ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                    </motion.button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type your question..."
                      className="flex-1 px-4 py-3 rounded-xl bg-slate-800/80 border border-gray-700 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none"
                    />
                    <NeonButton onClick={handleSendMessage}>
                      <Send className="w-5 h-5" />
                    </NeonButton>
                  </div>
                </div>
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
                <h2 className="text-2xl font-poppins font-bold text-white mb-2">Session Complete!</h2>
                <p className="text-gray-400">How was your learning experience?</p>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-300 mb-2">How confident do you feel now?</p>
                  <div className="flex gap-2">
                    {["😟", "😐", "🙂", "😊", "🤩"].map((emoji, idx) => (
                      <motion.button
                        key={idx}
                        className="flex-1 py-3 text-2xl rounded-xl bg-slate-800 hover:bg-slate-700 border border-gray-700"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {emoji}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>

              <NeonButton onClick={() => setPhase("quiz")} className="w-full">
                Start Quiz (10 Questions)
              </NeonButton>
            </GlowCard>
          </motion.div>
        );

      case "quiz":
        const currentQ = quizQuestions[currentQuizQuestion];
        return (
          <motion.div
            key={currentQuizQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="max-w-2xl mx-auto"
          >
            <GlowCard>
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-cyan-400">Question {currentQuizQuestion + 1} of {quizQuestions.length}</span>
                <span className="text-sm text-gray-400">
                  {quizAnswers.filter((a, i) => a === quizQuestions[i].correct).length} correct so far
                </span>
              </div>

              <h3 className="text-xl font-medium text-white mb-6">{currentQ.question}</h3>

              <div className="space-y-3">
                {currentQ.options.map((option, idx) => (
                  <motion.button
                    key={idx}
                    onClick={() => handleQuizAnswer(idx)}
                    className="w-full text-left px-4 py-4 rounded-xl bg-slate-800/80 border-2 border-gray-700 text-gray-200 hover:border-cyan-400/50 hover:bg-cyan-400/5 transition-all"
                    whileHover={{ scale: 1.01, x: 5 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <span className="inline-block w-8 h-8 rounded-full bg-slate-700 text-center leading-8 mr-3 text-sm">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    {option}
                  </motion.button>
                ))}
              </div>

              {/* Progress bar */}
              <div className="mt-6 h-2 bg-slate-800 rounded-full overflow-hidden">
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
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center"
              >
                <Award className="w-12 h-12 text-cyan-400" />
              </motion.div>

              <h2 className="text-3xl font-poppins font-bold text-white mb-2">Session Complete! 🎉</h2>
              <p className="text-gray-400 mb-6">You've mastered today's topic</p>

              <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="p-4 rounded-xl bg-slate-800/50 border border-gray-700">
                  <p className="text-3xl font-bold text-cyan-400">{score}/{quizQuestions.length}</p>
                  <p className="text-sm text-gray-400">Correct</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-gray-700">
                  <p className="text-3xl font-bold text-purple-400">{percentage.toFixed(0)}%</p>
                  <p className="text-sm text-gray-400">Accuracy</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-800/50 border border-gray-700">
                  <p className="text-3xl font-bold text-pink-400">+250</p>
                  <p className="text-sm text-gray-400">XP Earned</p>
                </div>
              </div>

              <div className="flex gap-4">
                <NeonButton variant="outline" onClick={() => navigate("/dashboard")} className="flex-1">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </NeonButton>
                <NeonButton onClick={() => window.location.reload()} className="flex-1">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  New Session
                </NeonButton>
              </div>
            </GlowCard>
          </motion.div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CosmicBackground />

      {/* Confetti */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3"
              style={{
                left: `${Math.random() * 100}%`,
                top: -20,
                backgroundColor: ["#00f2ea", "#a855f7", "#ec4899", "#22d3ee"][Math.floor(Math.random() * 4)],
                borderRadius: Math.random() > 0.5 ? "50%" : "0",
              }}
              animate={{
                y: window.innerHeight + 100,
                rotate: Math.random() * 720,
                x: (Math.random() - 0.5) * 200,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                ease: "easeIn",
                delay: Math.random() * 0.5,
              }}
            />
          ))}
        </div>
      )}

      {/* Header */}
      <header className="relative z-20 border-b border-cyan-400/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.button
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            whileHover={{ x: -5 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Exit Session</span>
          </motion.button>

          {/* Timer */}
          {phase === "teaching" && (
            <div className="flex items-center gap-4">
              <motion.div
                className="flex items-center gap-3 px-4 py-2 rounded-full bg-slate-800 border border-cyan-400/30"
                animate={!isPaused ? { boxShadow: ["0 0 20px rgba(0,242,234,0.3)", "0 0 30px rgba(0,242,234,0.5)", "0 0 20px rgba(0,242,234,0.3)"] } : {}}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <span className="text-2xl font-mono font-bold text-cyan-400">{formatTime(timeLeft)}</span>
                <button
                  onClick={() => setIsPaused(!isPaused)}
                  className="p-2 rounded-full bg-slate-700 hover:bg-slate-600 transition-colors"
                >
                  {isPaused ? <Play className="w-4 h-4 text-cyan-400" /> : <Pause className="w-4 h-4 text-cyan-400" />}
                </button>
              </motion.div>

              <button
                onClick={() => setPhase("post")}
                className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-400/30 text-sm font-medium hover:bg-purple-500/30 transition-colors"
              >
                End Session
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-slate-800 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        <AnimatePresence mode="wait">
          {renderPhaseContent()}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Session;