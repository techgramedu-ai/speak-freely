import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: "cyan" | "purple" | "pink";
  hover?: boolean;
  onClick?: () => void;
}

const GlowCard = ({
  children,
  className,
  glowColor = "cyan",
  hover = true,
  onClick,
}: GlowCardProps) => {
  const glowColors = {
    cyan: "border-cyan-400/30 shadow-[0_0_30px_rgba(0,242,234,0.15)] hover:border-cyan-400/50 hover:shadow-[0_0_40px_rgba(0,242,234,0.25)]",
    purple: "border-purple-400/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:border-purple-400/50 hover:shadow-[0_0_40px_rgba(168,85,247,0.25)]",
    pink: "border-pink-400/30 shadow-[0_0_30px_rgba(236,72,153,0.15)] hover:border-pink-400/50 hover:shadow-[0_0_40px_rgba(236,72,153,0.25)]",
  };

  return (
    <motion.div
      onClick={onClick}
      className={cn(
        "relative rounded-2xl border-2 bg-gradient-to-br from-slate-900/90 via-slate-800/80 to-slate-900/90 backdrop-blur-xl p-6 transition-all duration-300",
        glowColors[glowColor],
        hover && "cursor-pointer",
        className
      )}
      whileHover={hover ? { scale: 1.02, y: -5 } : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Inner glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-500/5 to-purple-500/5 pointer-events-none" />
      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
};

export default GlowCard;