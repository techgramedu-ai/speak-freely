import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Bell, Settings, BookOpen, Users, Heart, Briefcase, Flame, Clock, Target, Trophy, Calendar, Play, Zap } from "lucide-react";
import CosmicBackground from "@/components/ui/CosmicBackground";
import GlowCard from "@/components/ui/GlowCard";
import NeonButton from "@/components/ui/NeonButton";
import AITutorAvatar from "@/components/AITutorAvatar";
import ProgressRing from "@/components/ProgressRing";
import RealmPortal from "@/components/RealmPortal";

interface UserData {
  name: string;
  grade: string;
  subjects: string[];
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState<UserData>({ name: "Student", grade: "10", subjects: [] });

  useEffect(() => {
    const stored = localStorage.getItem("techgram_user");
    if (stored) {
      setUserData(JSON.parse(stored));
    }
  }, []);

  const firstName = userData.name.split(" ")[0] || "Student";

  const stats = [
    { label: "Day Streak", value: "12", icon: Flame, color: "text-orange-400" },
    { label: "Focus Time", value: "8.5h", icon: Clock, color: "text-cyan-400" },
    { label: "Accuracy", value: "87%", icon: Target, color: "text-green-400" },
    { label: "XP Earned", value: "2,450", icon: Trophy, color: "text-yellow-400" },
  ];

  const todayTopic = {
    subject: "Mathematics",
    chapter: "Quadratic Equations",
    progress: 65,
    duration: "40 min",
    questionsToday: 10,
  };

  const upcomingMilestones = [
    { date: "Jan 15", event: "Mid-Term Exams", type: "exam" },
    { date: "Jan 20", event: "Physics Chapter Test", type: "test" },
    { date: "Feb 1", event: "Board Exam Prep Starts", type: "milestone" },
  ];

  return (
    <div className="min-h-screen">
      <CosmicBackground />
      
      {/* Navigation */}
      <nav className="relative z-20 border-b border-cyan-400/10 bg-slate-900/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-teal-500 flex items-center justify-center">
              <span className="text-xl font-bold text-slate-900">T</span>
            </div>
            <span className="text-xl font-poppins font-bold text-white">Techgram</span>
          </motion.div>

          <div className="flex items-center gap-4">
            {/* Realm icons */}
            <div className="hidden md:flex items-center gap-2">
              {[
                { icon: BookOpen, color: "text-cyan-400", label: "Learn" },
                { icon: Users, color: "text-purple-400", label: "Connect" },
                { icon: Heart, color: "text-pink-400", label: "Lifestyle" },
                { icon: Briefcase, color: "text-teal-400", label: "Career" },
              ].map((item, i) => (
                <motion.button
                  key={i}
                  className={`p-2 rounded-lg ${item.color} hover:bg-slate-800/50 transition-colors`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title={item.label}
                >
                  <item.icon className="w-5 h-5" />
                </motion.button>
              ))}
            </div>

            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800/50 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-cyan-400 rounded-full" />
            </button>
            
            <button className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800/50 transition-colors">
              <Settings className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-500/20 border-2 border-cyan-400/40 flex items-center justify-center">
                <span className="text-lg font-bold text-cyan-400">{firstName[0]}</span>
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-white">{firstName}</p>
                <p className="text-xs text-gray-400">Class {userData.grade}</p>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-poppins font-bold text-white mb-2">
            Welcome to your <span className="text-gradient-cyan">Universe</span>, {firstName}! 🌟
          </h1>
          <p className="text-gray-400 text-lg">Your personalized learning journey continues...</p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <GlowCard key={i} className="p-4" hover={false}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-800 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-400">{stat.label}</p>
                </div>
              </div>
            </GlowCard>
          ))}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content - 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            {/* Today's Power Session */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <GlowCard className="relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full blur-3xl" />
                
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-5 h-5 text-cyan-400" />
                        <span className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Today's Power Session</span>
                      </div>
                      <h3 className="text-2xl font-poppins font-bold text-white mb-1">
                        {todayTopic.subject}: {todayTopic.chapter}
                      </h3>
                      <p className="text-gray-400">Master quadratic equations with your AI Tutor</p>
                    </div>
                    <ProgressRing progress={todayTopic.progress} size={100} label="Complete" />
                  </div>

                  <div className="flex flex-wrap gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{todayTopic.duration} session</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">{todayTopic.questionsToday} MCQs to solve</span>
                    </div>
                  </div>

                  <NeonButton onClick={() => navigate("/session")} className="w-full sm:w-auto">
                    <Play className="w-5 h-5 mr-2" />
                    Start Session with AI Tutor
                  </NeonButton>
                </div>
              </GlowCard>
            </motion.div>

            {/* Four Realm Portals */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-xl font-poppins font-bold text-white mb-4">Explore Your Realms</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <RealmPortal
                  title="AI Super Teacher"
                  description="Learn with AI"
                  icon={<BookOpen className="w-full h-full" />}
                  color="cyan"
                  path="/session"
                  delay={0}
                />
                <RealmPortal
                  title="Connect"
                  description="Peers & Mentors"
                  icon={<Users className="w-full h-full" />}
                  color="purple"
                  path="/connect"
                  delay={0.1}
                />
                <RealmPortal
                  title="Lifestyle Hub"
                  description="Balance & Wellness"
                  icon={<Heart className="w-full h-full" />}
                  color="pink"
                  path="/lifestyle"
                  delay={0.2}
                />
                <RealmPortal
                  title="Career Realm"
                  description="Future Planning"
                  icon={<Briefcase className="w-full h-full" />}
                  color="teal"
                  path="/career"
                  delay={0.3}
                />
              </div>
            </motion.div>
          </div>

          {/* Sidebar - 1 column */}
          <div className="space-y-6">
            {/* Study Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <GlowCard glowColor="purple">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  <h3 className="font-poppins font-bold text-white">Study Plan</h3>
                </div>
                
                <div className="space-y-3">
                  {upcomingMilestones.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-gray-700/50">
                      <div className="w-12 text-center">
                        <p className="text-xs text-gray-400">{item.date.split(" ")[0]}</p>
                        <p className="text-sm font-bold text-white">{item.date.split(" ")[1]}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-200">{item.event}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.type}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${
                        item.type === "exam" ? "bg-red-400" : item.type === "test" ? "bg-yellow-400" : "bg-green-400"
                      }`} />
                    </div>
                  ))}
                </div>
              </GlowCard>
            </motion.div>

            {/* Quick Quiz */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <GlowCard glowColor="pink">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-pink-400/20 to-purple-500/20 border-2 border-pink-400/40 flex items-center justify-center">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="font-poppins font-bold text-white mb-2">Quick Quiz</h3>
                  <p className="text-sm text-gray-400 mb-4">Test your knowledge in 5 minutes!</p>
                  <NeonButton variant="secondary" size="sm" className="w-full">
                    Start Quiz
                  </NeonButton>
                </div>
              </GlowCard>
            </motion.div>
          </div>
        </div>
      </main>

      {/* AI Tutor Avatar */}
      <AITutorAvatar 
        userName={firstName} 
        onStartSession={() => navigate("/session")}
      />
    </div>
  );
};

export default Dashboard;