import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, User, GraduationCap, Target, Brain, Sparkles } from "lucide-react";
import CosmicBackground from "@/components/ui/CosmicBackground";
import NeonButton from "@/components/ui/NeonButton";
import GlowCard from "@/components/ui/GlowCard";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface OnboardingData {
  name: string;
  email: string;
  phone: string;
  grade: string;
  board: string;
  goals: string[];
  subjects: string[];
  studyTime: string;
  learningStyle: string;
  diagnosisAnswers: number[];
}

const diagnosisQuestions = [
  { q: "How confident are you with Mathematics?", options: ["Struggling", "Need Practice", "Good", "Excellent"] },
  { q: "How do you prefer to learn new concepts?", options: ["Videos", "Reading", "Practice", "Discussion"] },
  { q: "What's your daily study routine like?", options: ["< 1 hour", "1-2 hours", "2-4 hours", "4+ hours"] },
  { q: "How do you handle difficult topics?", options: ["Skip them", "Ask help", "Research online", "Practice more"] },
  { q: "What motivates you to study?", options: ["Parents", "Career goals", "Competition", "Curiosity"] },
  { q: "How do you prepare for exams?", options: ["Last minute", "Weekly revision", "Daily practice", "Mock tests"] },
  { q: "Rate your English proficiency", options: ["Basic", "Intermediate", "Good", "Fluent"] },
  { q: "How comfortable are you with Science?", options: ["Struggling", "Need Practice", "Good", "Excellent"] },
  { q: "What's your biggest study challenge?", options: ["Focus", "Understanding", "Time", "Memory"] },
  { q: "How do you track your progress?", options: ["I don't", "Mental notes", "Written notes", "Apps/Tools"] },
];

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "",
    email: "",
    phone: "",
    grade: "",
    board: "",
    goals: [],
    subjects: [],
    studyTime: "",
    learningStyle: "",
    diagnosisAnswers: [],
  });

  const totalSteps = 4;

  const handleNext = () => {
    if (step === 0 && (!data.name || !data.email)) {
      toast({ title: "Please fill in your details", variant: "destructive" });
      return;
    }
    if (step === 1 && (!data.grade || !data.board)) {
      toast({ title: "Please select your academic details", variant: "destructive" });
      return;
    }
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
    setTimeout(() => {
      localStorage.setItem("techgram_user", JSON.stringify(data));
      navigate("/dashboard");
    }, 3000);
  };

  const updateData = (key: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key: "goals" | "subjects", item: string) => {
    setData(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item],
    }));
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <User className="w-10 h-10 text-cyan-400" />
              </motion.div>
              <h2 className="text-2xl font-poppins font-bold text-white mb-2">Welcome, Future Star! ✨</h2>
              <p className="text-gray-400">Let's start by getting to know you</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => updateData("name", e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => updateData("email", e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={data.phone}
                  onChange={(e) => updateData("phone", e.target.value)}
                  placeholder="+91 98765 43210"
                  className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border-2 border-cyan-400/20 text-white placeholder-gray-500 focus:border-cyan-400/60 focus:outline-none focus:ring-2 focus:ring-cyan-400/20 transition-all"
                />
              </div>
            </div>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-500/20 border-2 border-purple-400/40 flex items-center justify-center"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <GraduationCap className="w-10 h-10 text-purple-400" />
              </motion.div>
              <h2 className="text-2xl font-poppins font-bold text-white mb-2">Academic Details 📚</h2>
              <p className="text-gray-400">Help us customize your learning path</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Select Your Grade</label>
                <div className="grid grid-cols-4 gap-3">
                  {["8", "9", "10", "11", "12", "IIT-JEE", "NEET", "Other"].map((grade) => (
                    <motion.button
                      key={grade}
                      onClick={() => updateData("grade", grade)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        data.grade === grade
                          ? "border-cyan-400 bg-cyan-400/20 text-cyan-400 shadow-[0_0_20px_rgba(0,242,234,0.3)]"
                          : "border-gray-600 bg-slate-800/50 text-gray-400 hover:border-gray-500"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {grade}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Education Board</label>
                <div className="grid grid-cols-3 gap-3">
                  {["CBSE", "ICSE", "State Board", "IB", "IGCSE", "Other"].map((board) => (
                    <motion.button
                      key={board}
                      onClick={() => updateData("board", board)}
                      className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all ${
                        data.board === board
                          ? "border-purple-400 bg-purple-400/20 text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                          : "border-gray-600 bg-slate-800/50 text-gray-400 hover:border-gray-500"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {board}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-teal-400/20 to-cyan-500/20 border-2 border-teal-400/40 flex items-center justify-center"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Target className="w-10 h-10 text-teal-400" />
              </motion.div>
              <h2 className="text-2xl font-poppins font-bold text-white mb-2">Your Goals & Interests 🎯</h2>
              <p className="text-gray-400">What do you want to achieve?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Learning Goals (Select multiple)</label>
                <div className="flex flex-wrap gap-2">
                  {["Top Board Exam Scores", "Competitive Exams", "Concept Clarity", "Better Grades", "Career Prep", "Skill Development"].map((goal) => (
                    <motion.button
                      key={goal}
                      onClick={() => toggleArrayItem("goals", goal)}
                      className={`py-2 px-4 rounded-full border-2 text-sm font-medium transition-all ${
                        data.goals.includes(goal)
                          ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                          : "border-gray-600 bg-slate-800/50 text-gray-400 hover:border-gray-500"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {goal}
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">Favorite Subjects</label>
                <div className="flex flex-wrap gap-2">
                  {["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer Science", "Economics"].map((subject) => (
                    <motion.button
                      key={subject}
                      onClick={() => toggleArrayItem("subjects", subject)}
                      className={`py-2 px-4 rounded-full border-2 text-sm font-medium transition-all ${
                        data.subjects.includes(subject)
                          ? "border-purple-400 bg-purple-400/20 text-purple-400"
                          : "border-gray-600 bg-slate-800/50 text-gray-400 hover:border-gray-500"
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {subject}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="space-y-6"
          >
            <div className="text-center mb-6">
              <motion.div
                className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-500/20 border-2 border-pink-400/40 flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <Brain className="w-10 h-10 text-pink-400" />
              </motion.div>
              <h2 className="text-2xl font-poppins font-bold text-white mb-2">Quick Diagnosis 🧠</h2>
              <p className="text-gray-400">Answer a few quick questions to personalize your experience</p>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
              {diagnosisQuestions.map((q, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="p-4 rounded-xl bg-slate-800/50 border border-gray-700"
                >
                  <p className="text-sm font-medium text-gray-200 mb-3">{idx + 1}. {q.q}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <motion.button
                        key={optIdx}
                        onClick={() => {
                          const newAnswers = [...data.diagnosisAnswers];
                          newAnswers[idx] = optIdx;
                          updateData("diagnosisAnswers", newAnswers);
                        }}
                        className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                          data.diagnosisAnswers[idx] === optIdx
                            ? "border-cyan-400 bg-cyan-400/20 text-cyan-400"
                            : "border-gray-600 bg-slate-900/50 text-gray-400 hover:border-gray-500"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {opt}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <CosmicBackground />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 text-center"
        >
          <motion.div
            className="w-32 h-32 mx-auto mb-8 rounded-full border-4 border-cyan-400/30 border-t-cyan-400 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="w-12 h-12 text-cyan-400" />
          </motion.div>
          <h2 className="text-2xl font-poppins font-bold text-white mb-4">
            Building Your Universe...
          </h2>
          <p className="text-gray-400">
            Your personal AI Tutor is preparing your learning journey
          </p>
          <motion.div
            className="mt-6 flex justify-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-3 h-3 rounded-full bg-cyan-400"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <CosmicBackground />
      
      <div className="relative z-10 max-w-2xl mx-auto">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            {[...Array(totalSteps)].map((_, i) => (
              <motion.div
                key={i}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  i <= step ? "bg-gradient-to-r from-cyan-400 to-teal-400" : "bg-slate-700"
                }`}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 }}
              />
            ))}
          </div>
          <p className="text-center text-sm text-gray-400">
            Step {step + 1} of {totalSteps}
          </p>
        </div>

        {/* Content */}
        <GlowCard className="min-h-[500px]">
          <AnimatePresence mode="wait">
            {renderStepContent()}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {step > 0 ? (
              <NeonButton variant="outline" onClick={() => setStep(step - 1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </NeonButton>
            ) : (
              <div />
            )}
            <NeonButton onClick={handleNext}>
              {step === totalSteps - 1 ? (
                <>
                  Create My Universe
                  <Sparkles className="w-4 h-4 ml-2" />
                </>
              ) : (
                <>
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </NeonButton>
          </div>
        </GlowCard>
      </div>
    </div>
  );
};

export default Onboarding;