// src/components/home/AboutSection.tsx
import { motion } from "framer-motion";
import { Users, Sparkles, Code, Heart } from "lucide-react";
import { AboutCarousel } from "./AboutCarousel";

export const AboutSection = () => {
  const features = [
    {
      icon: Users,
      title: "Peer-Led Learning",
      description: "Learn from fellow developers who understand the challenges you face."
    },
    {
      icon: Sparkles,
      title: "Community-Driven",
      description: "Anyone can create talks and share their expertise with others."
    },
    {
      icon: Code,
      title: "Practical Skills",
      description: "Focus on real-world coding skills that matter in the industry."
    },
    {
      icon: Heart,
      title: "Non-Profit Mission",
      description: "Dedicated to making quality tech education accessible to all."
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            ABOUT US
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            What is EvDeX Academy?
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <p className="text-lg text-foreground leading-relaxed mb-8">
              EvDeX Academy is a platform where people can learn to code and help others do so. 
              It's a collaborative, non-profit app where you can attend or hold presentations 
              about different tech-related content as well as access free private tutoring.
            </p>

            {/* Features Grid */}
            <div className="grid sm:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                >
                  <feature.icon className="w-8 h-8 text-secondary mb-3" />
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Carousel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <AboutCarousel />
          </motion.div>
        </div>
      </div>
    </section>
  );
};