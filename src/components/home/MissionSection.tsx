import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Globe, GraduationCap } from "lucide-react";

export const MissionSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Our Mission
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-foreground mt-4 mb-6">
              Making tech education <span className="text-gradient">accessible</span> to everyone
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Our goal is to provide access to high-quality education for everyone. 
              Unfortunately, most people will never try out programming as it's not included 
              in most education systems. EvDeX Academy tries to keep it easy for all who are 
              willing to give it a try.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We've created a collaborative environment to learn, teach, and have fun all 
              at the same time. By enabling learners to become both consumers and creators 
              of knowledge, we foster a sustainable ecosystem for coding education.
            </p>
          </motion.div>

          {/* Right Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            {[
              {
                icon: Target,
                title: "Decentralized Learning",
                description:
                  "No rigid curricula – learn what you need, when you need it, from people who understand your journey.",
              },
              {
                icon: Globe,
                title: "Community First",
                description:
                  "Tailored for emerging digital communities, especially in Zambia and across Africa.",
              },
              {
                icon: GraduationCap,
                title: "Grow Together",
                description:
                  "Help others while you learn. Teaching is the best way to solidify your own knowledge.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex gap-4 p-6 rounded-2xl bg-card border border-border hover:border-secondary/50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-1">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
