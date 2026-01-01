import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Sparkles, BookOpen, Users, Brain, Rocket } from "lucide-react";
import CosmicBackground from "@/components/ui/CosmicBackground";
import NeonButton from "@/components/ui/NeonButton";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-hidden">
      <CosmicBackground />

      {/* Navigation */}
      <nav className="relative z-20 py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-900">T</span>
            </div>
            <span className="text-xl font-poppins font-bold text-white">Techgram</span>
          </motion.div>
          <NeonButton onClick={() => navigate("/onboarding")} size="sm">Enter Universe</NeonButton>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> India's First Educational Metaverse
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="text-4xl md:text-6xl lg:text-7xl font-poppins font-bold text-white mb-6 leading-tight">
            Your Personal{" "}<span className="text-gradient-cyan">AI Tutor</span>{" "}Awaits
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Experience personalized 40-minute power sessions with an AI tutor that adapts to your learning style. Master any subject, ace your exams.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <NeonButton onClick={() => navigate("/onboarding")} size="lg">
              <Rocket className="w-5 h-5 mr-2" /> Enter the Universe
            </NeonButton>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="grid md:grid-cols-3 gap-6 mt-24">
          {[
            { icon: Brain, title: "AI Super Teacher", desc: "Personalized 40-min sessions with adaptive teaching", color: "cyan" },
            { icon: Users, title: "Connect & Learn", desc: "Study groups, peer mentors, and community", color: "purple" },
            { icon: BookOpen, title: "Smart Curriculum", desc: "Aligned with CBSE, ICSE, and competitive exams", color: "teal" },
          ].map((f, i) => (
            <motion.div key={i} whileHover={{ scale: 1.05, y: -10 }}
              className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/90 to-slate-800/50 border-2 border-cyan-400/20 backdrop-blur-xl">
              <div className={`w-14 h-14 rounded-xl bg-${f.color}-400/10 border border-${f.color}-400/30 flex items-center justify-center mb-4`}>
                <f.icon className={`w-7 h-7 text-${f.color}-400`} />
              </div>
              <h3 className="text-xl font-poppins font-bold text-white mb-2">{f.title}</h3>
              <p className="text-gray-400">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  );
};

export default Landing;