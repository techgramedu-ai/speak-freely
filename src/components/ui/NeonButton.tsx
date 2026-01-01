import { motion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NeonButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit";
}

const NeonButton = ({
  children,
  onClick,
  className,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
}: NeonButtonProps) => {
  const baseStyles = "relative font-semibold rounded-xl transition-all duration-300 overflow-hidden";
  
  const variants = {
    primary: "bg-gradient-to-r from-cyan-400 via-teal-400 to-cyan-500 text-slate-900 shadow-[0_0_30px_rgba(0,242,234,0.4)] hover:shadow-[0_0_50px_rgba(0,242,234,0.6)]",
    secondary: "bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)]",
    outline: "bg-transparent border-2 border-cyan-400/60 text-cyan-400 hover:bg-cyan-400/10 shadow-[0_0_20px_rgba(0,242,234,0.2)] hover:shadow-[0_0_30px_rgba(0,242,234,0.4)]",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
};

export default NeonButton;