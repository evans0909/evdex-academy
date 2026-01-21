import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { 
  Smartphone, 
  Laptop, 
  Monitor,
  HardDrive,
  Wrench,
  CheckCircle,
  ArrowRight
} from "lucide-react";

const services = [
  {
    icon: Smartphone,
    title: "Phone Repairs",
    description: "Screen replacement, battery issues, water damage, and software problems.",
    features: ["Screen Replacement", "Battery Replacement", "Charging Port Fix", "Software Issues"],
    price: "From K150",
    color: "from-pink-500 to-rose-600",
  },
  {
    icon: Laptop,
    title: "Laptop Repairs",
    description: "Hardware upgrades, virus removal, display issues, and performance optimization.",
    features: ["Hardware Repair", "Virus Removal", "OS Installation", "RAM/SSD Upgrades"],
    price: "From K200",
    color: "from-blue-500 to-indigo-600",
  },
  {
    icon: Monitor,
    title: "Desktop Repairs",
    description: "Build custom PCs, troubleshoot issues, and provide maintenance services.",
    features: ["Custom PC Building", "Hardware Diagnostics", "Component Replacement", "Maintenance"],
    price: "From K180",
    color: "from-purple-500 to-violet-600",
  },
  {
    icon: HardDrive,
    title: "Software Services",
    description: "Operating system installation, software setup, and data recovery.",
    features: ["Windows/Linux Install", "Software Setup", "Data Recovery", "Cloud Backup"],
    price: "From K100",
    color: "from-emerald-500 to-teal-600",
  },
];

const Repairs = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-hero-gradient py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 mb-6">
              <Wrench className="w-4 h-4 text-secondary" />
              <span className="text-secondary text-sm font-medium">Professional Repair Services</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
              Device Repair Services
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Expert repair and maintenance for phones, laptops, and computers. 
              Fast, reliable, and affordable.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-8 hover:border-secondary/50 hover:shadow-lg transition-all"
              >
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <service.icon className="w-8 h-8 text-white" />
                </div>

                <h3 className="text-2xl font-display font-bold text-foreground mb-2">
                  {service.title}
                </h3>
                <p className="text-muted-foreground mb-6">{service.description}</p>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-6 border-t border-border">
                  <span className="text-lg font-display font-semibold text-secondary">
                    {service.price}
                  </span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/contact">
                      Book Now
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Need a custom quote?
            </h2>
            <p className="text-muted-foreground mb-8">
              Contact us for complex repairs or bulk services. We offer competitive rates 
              and fast turnaround times.
            </p>
            <Button size="lg" variant="accent" asChild className="group">
              <Link to="/contact">
                Schedule a Consultation
                <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Repairs;
