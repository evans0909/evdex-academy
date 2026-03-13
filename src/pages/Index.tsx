// src/pages/Index.tsx
import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { AboutSection } from "@/components/home/AboutSection";
import { MissionSection } from "@/components/home/MissionSection";
import { WhySection } from "@/components/home/WhySection";
import { CTASection } from "@/components/home/CTASection";
import { SectionDivider } from "@/components/ui/SectionDivider";
import { motion } from "framer-motion";

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      
      {/* Divider between Hero and About */}
      <SectionDivider variant="wave" />
      
      <AboutSection />
      
      {/* Divider between About and Mission */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <SectionDivider variant="dots" />
      </motion.div>
      
      <MissionSection />
      
      {/* Divider between Mission and Why */}
      <SectionDivider variant="angle" />
      
      <WhySection />
      
      {/* Divider between Why and CTA */}
      <SectionDivider variant="lines" />
      
      <CTASection />
    </Layout>
  );
};

export default Index;