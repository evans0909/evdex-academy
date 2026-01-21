import { Link } from "react-router-dom";
import { Code2, Mail, Github, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Code2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold">
                EvDeX<span className="text-secondary"> Academy</span>
              </span>
            </Link>
            <p className="text-primary-foreground/70 text-sm leading-relaxed">
              A collaborative platform where everyone can learn to code and help others do the same.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "Explore Talks", path: "/talks" },
                { name: "Universities", path: "/universities" },
                { name: "Repair Services", path: "/repairs" },
                { name: "Make a Donation", path: "/donate" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              {[
                { name: "Create a Talk", path: "/talks/new" },
                { name: "My Enrolled Talks", path: "/my-talks" },
                { name: "Final Project", path: "/final-project" },
                { name: "Schedule Meeting", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact</h4>
            <div className="space-y-3">
              <a
                href="mailto:ev4nsbw4ly4@gmail.com"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                ev4nsbw4ly4@gmail.com
              </a>
              <div className="flex items-center gap-4 pt-2">
                <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  <Github className="w-5 h-5" />
                </a>
                <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
                <a href="#" className="text-primary-foreground/70 hover:text-secondary transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-primary-foreground/60 text-sm">
              Made by Evans Devancie Bwalya. EvDeX Academy © 2025. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link to="#" className="text-primary-foreground/60 hover:text-secondary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link to="#" className="text-primary-foreground/60 hover:text-secondary text-sm transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
