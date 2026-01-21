import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Lightbulb, Users, Rocket, Heart } from "lucide-react";

const features = [
  {
    icon: Lightbulb,
    title: "Peer-Led Learning",
    description: "Learn from fellow developers who understand the challenges you face.",
  },
  {
    icon: Users,
    title: "Community-Driven",
    description: "Anyone can create talks and share their expertise with others.",
  },
  {
    icon: Rocket,
    title: "Practical Skills",
    description: "Focus on real-world coding skills that matter in the industry.",
  },
  {
    icon: Heart,
    title: "Non-Profit Mission",
    description: "Dedicated to making quality tech education accessible to all.",
  },
];

export const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
            About Us
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
            What is EvDeX Academy?
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            EvDeX Academy is a platform where people can learn to code and help others do so. 
            It's a collaborative, non-profit app where you can attend or hold presentations 
            about different tech-related content as well as access free private tutoring.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-border hover:border-secondary/50 transition-all hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-7 h-7 text-secondary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
