import { Link } from "react-router-dom";
import { Code2, Mail } from "lucide-react";
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaWhatsapp } from "react-icons/fa";

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
                { name: "My Enrolled Talks", path: "/talks/enrolled" },
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

          {/* Contact & Social */}
          <div>
            <h4 className="font-display font-semibold mb-4">Connect With Us</h4>
            <div className="space-y-3">
              {/* Email */}
              <a
                href="mailto:ev4nsbw4ly4@gmail.com"
                className="flex items-center gap-2 text-primary-foreground/70 hover:text-secondary transition-colors text-sm group"
              >
                <Mail className="w-4 h-4 group-hover:scale-110 transition-transform" />
                ev4nsbw4ly4@gmail.com
              </a>

              {/* Social Media Icons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                {/* GitHub */}
                <a 
                  href="https://github.com/evans0909" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-secondary transition-all hover:scale-110"
                  aria-label="GitHub"
                >
                  <FaGithub className="w-6 h-6" />
                </a>

                {/* LinkedIn */}
                <a 
                  href="https://linkedin.com/in/evans-bwalya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-secondary transition-all hover:scale-110"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin className="w-6 h-6" />
                </a>

                {/* Twitter/X */}
                <a 
                  href="https://twitter.com/evans_bwalya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-secondary transition-all hover:scale-110"
                  aria-label="Twitter"
                >
                  <FaTwitter className="w-6 h-6" />
                </a>

                {/* Facebook */}
                <a 
                  href="https://facebook.com/evans.bwalya" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-secondary transition-all hover:scale-110"
                  aria-label="Facebook"
                >
                  <FaFacebook className="w-6 h-6" />
                </a>

                {/* WhatsApp */}
                <a 
                  href="https://wa.me/260973363119" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary-foreground/70 hover:text-secondary transition-all hover:scale-110"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp className="w-6 h-6" />
                </a>
              </div>

              <p className="text-xs text-primary-foreground/50 pt-2">
                Follow us on social media for updates
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
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