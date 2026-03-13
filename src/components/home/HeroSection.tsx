// src/components/home/HeroSection.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Play, Users, BookOpen, Code } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-students.jpg";
import AnimatedText from "@/components/AnimatedText";

export const HeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Animation for other elements
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 1.2
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Students learning to code together"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
      </div>

      {/* Decorative elements */}
      <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-secondary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse-slow" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Open for enrollment badge - Animated */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-secondary text-sm font-medium">Open for enrollment</span>
          </motion.div>

          {/* Animated Headline - Letter by letter with floating effect */}
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight">
              <span className="text-green-500"> {/* Green for "Learning to code" */}
                <AnimatedText 
                  text="Learning to code" 
                  className="block w-full text-center"
                  delay={0.3}
                />
              </span>
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mt-2">
              <span className="text-orange-500"> {/* Orange for "made easier" */}
                <AnimatedText text="made easier" delay={0.8} />
              </span>
            </h1>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mt-2">
              <span className="text-red-500"> {/* Red for "than ever" */}
                <AnimatedText text="than ever" delay={1.3} />
              </span>
            </h1>
          </div>

          {/* Description - Fade in after letters */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="text-lg sm:text-xl text-primary-foreground/80 leading-relaxed mb-8 max-w-2xl mx-auto"
          >
            Join a collaborative community where everyone can create and attend coding talks. 
            Learn from peers, share knowledge, and grow together in tech.
          </motion.p>

          {/* CTA Buttons - Staggered animation */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="flex flex-wrap gap-4 justify-center mb-12"
          >
            <motion.div variants={fadeInUp}>
              <Button size="lg" variant="accent" asChild className="group">
                <Link to="/talks">
                  Explore Talks
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
            </motion.div>
            <motion.div variants={fadeInUp}>
              <Button size="lg" variant="hero" asChild className="group">
                <Link to="/register">
                  <Play className="w-4 h-4 mr-2" />
                  Get Started Free
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isLoaded ? "visible" : "hidden"}
            className="flex flex-wrap gap-8 justify-center"
          >
            {[
              { icon: Users, value: "100+", label: "Active Learners" },
              { icon: BookOpen, value: "40+", label: "Coding Talks" },
              { icon: Code, value: "20+", label: "Tech Topics" },
            ].map((stat, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                  <stat.icon className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-display font-bold text-primary-foreground">
                    {stat.value}
                  </p>
                  <p className="text-sm text-primary-foreground/60">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};