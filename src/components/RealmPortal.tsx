import { motion } from "framer-motion";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface RealmPortalProps {
  title: string;
  description: string;
  icon: ReactNode;
  color: "cyan" | "purple" | "pink" | "teal";
  path: string;
  delay?: number;
}

const RealmPortal = ({ title, description, icon, color, path, delay = 0 }: RealmPortalProps) => {
  const navigate = useNavigate();

  const colorStyles = {
    cyan: {
      border: "border-cyan-400/40",
      bg: "from-cyan-500/10 to-cyan-500/5",
      glow: "shadow-[0_0_40px_rgba(0,242,234,0.2)]",
      hoverGlow: "hover:shadow-[0_0_60px_rgba(0,242,234,0.4)]",
      iconBg: "from-cyan-400/20 to-cyan-500/10",
      text: "text-cyan-400",
    },
    purple: {
      border: "border-purple-400/40",
      bg: "from-purple-500/10 to-purple-500/5",
      glow: "shadow-[0_0_40px_rgba(168,85,247,0.2)]",
      hoverGlow: "hover:shadow-[0_0_60px_rgba(168,85,247,0.4)]",
      iconBg: "from-purple-400/20 to-purple-500/10",
      text: "text-purple-400",
    },
    pink: {
      border: "border-pink-400/40",
      bg: "from-pink-500/10 to-pink-500/5",
      glow: "shadow-[0_0_40px_rgba(236,72,153,0.2)]",
      hoverGlow: "hover:shadow-[0_0_60px_rgba(236,72,153,0.4)]",
      iconBg: "from-pink-400/20 to-pink-500/10",
      text: "text-pink-400",
    },
    teal: {
      border: "border-teal-400/40",
      bg: "from-teal-500/10 to-teal-500/5",
      glow: "shadow-[0_0_40px_rgba(20,184,166,0.2)]",
      hoverGlow: "hover:shadow-[0_0_60px_rgba(20,184,166,0.4)]",
      iconBg: "from-teal-400/20 to-teal-500/10",
      text: "text-teal-400",
    },
  };

  const styles = colorStyles[color];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ scale: 1.05, y: -10 }}
      onClick={() => navigate(path)}
      className={`relative cursor-pointer rounded-2xl border-2 ${styles.border} bg-gradient-to-br ${styles.bg} backdrop-blur-xl p-6 ${styles.glow} ${styles.hoverGlow} transition-all duration-300 group overflow-hidden`}
    >
      {/* Animated background */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at center, ${color === 'cyan' ? 'rgba(0,242,234,0.1)' : color === 'purple' ? 'rgba(168,85,247,0.1)' : color === 'pink' ? 'rgba(236,72,153,0.1)' : 'rgba(20,184,166,0.1)'} 0%, transparent 70%)`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center">
        {/* Icon container */}
        <motion.div
          className={`w-20 h-20 rounded-full bg-gradient-to-br ${styles.iconBg} border ${styles.border} flex items-center justify-center mb-4`}
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.8 }}
        >
          <div className={`${styles.text} w-10 h-10`}>{icon}</div>
        </motion.div>

        <h3 className={`font-poppins font-bold text-lg ${styles.text} mb-2`}>
          {title}
        </h3>
        <p className="text-gray-400 text-sm">{description}</p>

        {/* Enter text */}
        <motion.div
          className={`mt-4 text-sm font-medium ${styles.text} opacity-0 group-hover:opacity-100 transition-opacity`}
          initial={{ y: 10 }}
          whileHover={{ y: 0 }}
        >
          Enter Realm →
        </motion.div>
      </div>

      {/* Orbiting particles */}
      <motion.div
        className={`absolute w-2 h-2 rounded-full ${styles.text.replace('text-', 'bg-')}/50`}
        style={{ top: '50%', left: '50%' }}
        animate={{
          rotate: 360,
          x: [0, 60, 0, -60, 0],
          y: [0, -60, 0, 60, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
    </motion.div>
  );
};

export default RealmPortal;