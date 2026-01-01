import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: "cyan" | "purple" | "pink";
  showLabel?: boolean;
  label?: string;
}

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 8,
  color = "cyan",
  showLabel = true,
  label,
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  const colors = {
    cyan: { stroke: "#00f2ea", glow: "rgba(0, 242, 234, 0.4)" },
    purple: { stroke: "#a855f7", glow: "rgba(168, 85, 247, 0.4)" },
    pink: { stroke: "#ec4899", glow: "rgba(236, 72, 153, 0.4)" },
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-slate-700/50"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={colors[color].stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          style={{
            filter: `drop-shadow(0 0 10px ${colors[color].glow})`,
          }}
        />
      </svg>
      
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
          >
            {Math.round(progress)}%
          </motion.span>
          {label && (
            <span className="text-xs text-gray-400 mt-1">{label}</span>
          )}
        </div>
      )}
    </div>
  );
};

export default ProgressRing;