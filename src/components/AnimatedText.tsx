// src/components/AnimatedText.tsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
}

const AnimatedText = ({ text, className = "", delay = 0.5 }: AnimatedTextProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay * 1000);
    return () => clearTimeout(timer);
  }, [delay]);

  const characters = text.split("");

  // Floating animation (continuous)
  const floatingAnimation = {
    y: [0, -6, 0, 6, 0],
    rotate: [0, 1, 0, -1, 0],
    transition: {
      duration: 3,
      ease: "easeInOut" as const,
      repeat: Infinity,
      repeatType: "loop" as const,
      delay: 0.5 // Start floating after drop animation
    }
  };

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : {}}
      className={className}
      style={{ 
        display: 'inline-block',
        width: '100%',
        textAlign: 'center'
      }}
    >
      {characters.map((char, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 50, rotate: -5, scale: 0.5 }}
          animate={isVisible ? {
            opacity: 1,
            y: 0,
            rotate: 0,
            scale: 1,
            ...floatingAnimation
          } : {}}
          transition={{
            duration: 0.4,
            delay: index * 0.03,
            type: "spring",
            damping: 10,
            stiffness: 100
          }}
          style={{ 
            display: 'inline-block',
            whiteSpace: 'pre',
            marginRight: char === ' ' ? '0.3em' : '0.02em',
            transformOrigin: 'center center'
          }}
        >
          {char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default AnimatedText;