import { motion } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  BookOpen, 
  Laptop,
  Users,
  CheckCircle,
  Sparkles
} from "lucide-react";

const impactItems = [
  {
    icon: BookOpen,
    title: "Educational Resources",
    description: "Fund the creation of free learning materials and course content.",
  },
  {
    icon: Laptop,
    title: "Equipment Access",
    description: "Provide laptops and devices to students who can't afford them.",
  },
  {
    icon: Users,
    title: "Community Events",
    description: "Support workshops, hackathons, and coding bootcamps.",
  },
];

const tiers = [
  {
    name: "Supporter",
    amount: "K50",
    description: "Help cover basic operational costs",
    features: ["Name on supporters page", "Monthly newsletter"],
  },
  {
    name: "Champion",
    amount: "K200",
    description: "Fund a student's learning materials",
    features: ["All Supporter benefits", "Quarterly impact report", "Recognition badge"],
    popular: true,
  },
  {
    name: "Partner",
    amount: "K500",
    description: "Sponsor equipment for a student",
    features: ["All Champion benefits", "Partner showcase", "Direct student connection"],
  },
];

const Donate = () => {
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
              <Heart className="w-4 h-4 text-secondary" />
              <span className="text-secondary text-sm font-medium">Support Our Mission</span>
            </div>
            <h1 className="text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-4">
              Help Us Educate the <span className="text-gradient">Next Generation</span>
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Your contribution helps us provide free coding education to students 
              across Zambia and beyond.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Your Impact
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Every donation directly supports our mission to make coding education 
              accessible to everyone.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {impactItems.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center p-8 rounded-2xl bg-muted"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Donation Tiers */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Choose Your Contribution
            </h2>
            <p className="text-muted-foreground">
              Select a donation tier that works for you
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`relative rounded-2xl p-8 ${
                  tier.popular
                    ? "bg-gradient-to-br from-secondary/10 to-accent/10 border-2 border-secondary"
                    : "bg-card border border-border"
                }`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-display font-semibold text-foreground mb-1">
                    {tier.name}
                  </h3>
                  <p className="text-3xl font-display font-bold text-secondary mb-2">
                    {tier.amount}
                  </p>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={tier.popular ? "accent" : "outline"}
                >
                  Donate {tier.amount}
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground mb-4">
              Want to contribute a custom amount?
            </p>
            <Button variant="outline">Make Custom Donation</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Donate;
