// src/components/ui/SectionDivider.tsx
import { motion } from "framer-motion";

interface SectionDividerProps {
  variant?: "wave" | "angle" | "dots" | "lines" | "gradient";
  className?: string;
}

export const SectionDivider = ({ variant = "wave", className = "" }: SectionDividerProps) => {
  const variants = {
    wave: (
      <svg className="w-full h-16" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path
          d="M0,50 C300,0 600,100 1440,50 L1440,100 L0,100 Z"
          fill="url(#gradient)"
          className="animate-wave"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4f46e5" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>
        </defs>
      </svg>
    ),
    dots: (
      <div className="flex justify-center gap-3 py-8">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="w-3 h-3 rounded-full bg-gradient-to-r from-primary to-secondary"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2
            }}
          />
        ))}
      </div>
    ),
    angle: (
      <div className="relative h-20">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" />
        <div 
          className="absolute inset-0 bg-background" 
          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
        />
      </div>
    ),
    lines: (
      <div className="flex justify-center gap-2 py-8">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="w-12 h-1 bg-gradient-to-r from-primary to-secondary rounded-full"
            animate={{
              width: ["3rem", "5rem", "3rem"],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}
      </div>
    ),
    gradient: (
      <div className="relative h-24 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent"
          animate={{
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear"
          }}
          style={{ width: "200%" }}
        />
      </div>
    )
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {variants[variant]}
    </div>
  );
};