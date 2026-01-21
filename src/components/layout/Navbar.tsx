import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Code2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { auth } from "../../firebase";
import { onAuthStateChanged } from "firebase/auth";
import UserMenu from "../UserMenu";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Talks", path: "/talks" },
  { name: "Universities", path: "/universities" },
  { name: "Repairs", path: "/repairs" },
  { name: "Donate", path: "/donate" },
  { name: "Contact", path: "/contact" },
];

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const currentUser = auth.currentUser; // Added this line

  // Check auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user);
      setLoading(false);
      console.log("Navbar auth state:", user?.email);
    });

    return () => unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-glow transition-transform group-hover:scale-105">
              <Code2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              EvDeX<span className="text-secondary"> Academy</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "text-secondary bg-secondary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {/* Dashboard link for logged in users */}
            {isLoggedIn && (
              <Link
                to="/dashboard"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/dashboard"
                    ? "text-secondary bg-secondary/10"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Dashboard
              </Link>
            )}
            {/* Admin link for admin users */}
            {isLoggedIn && currentUser?.email === "bwalyaevans09@gmail.com" && (
              <Link
                to="/admin"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === "/admin"
                    ? "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons / User Menu */}
          <div className="hidden lg:flex items-center gap-3">
            {loading ? (
              // Loading skeleton
              <div className="flex gap-2">
                <div className="h-9 w-20 bg-muted rounded-lg animate-pulse"></div>
                <div className="h-9 w-20 bg-muted rounded-lg animate-pulse"></div>
              </div>
            ) : isLoggedIn ? (
              // Show UserMenu when logged in
              <UserMenu />
            ) : (
              // Show auth buttons when logged out
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button variant="accent" asChild>
                  <Link to="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-background border-b border-border overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "text-secondary bg-secondary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              
              {/* Dashboard link for mobile */}
              {isLoggedIn && (
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/dashboard"
                      ? "text-secondary bg-secondary/10"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Dashboard
                </Link>
              )}
              
              {/* Admin link for mobile */}
              {isLoggedIn && currentUser?.email === "bwalyaevans09@gmail.com" && (
                <Link
                  to="/admin"
                  onClick={() => setIsOpen(false)}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === "/admin"
                      ? "text-purple-600 bg-purple-100 dark:bg-purple-900/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  Admin
                </Link>
              )}

              <div className="pt-4 flex flex-col gap-2">
                {loading ? (
                  // Loading skeleton for mobile
                  <>
                    <div className="h-10 w-full bg-muted rounded-lg animate-pulse"></div>
                    <div className="h-10 w-full bg-muted rounded-lg animate-pulse"></div>
                  </>
                ) : isLoggedIn ? (
                  // Mobile user menu
                  <>
                    <div className="px-4 py-3 rounded-lg bg-muted">
                      <p className="text-sm font-medium">Logged in as:</p>
                      <p className="text-sm text-muted-foreground truncate">
                        {auth.currentUser?.email}
                      </p>
                    </div>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                        Dashboard
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={async () => {
                        try {
                          const { signOut } = await import("firebase/auth");
                          await signOut(auth);
                          setIsOpen(false);
                        } catch (error) {
                          console.error("Logout error:", error);
                        }
                      }}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  // Mobile auth buttons
                  <>
                    <Button variant="outline" asChild className="w-full">
                      <Link to="/login" onClick={() => setIsOpen(false)}>
                        Sign In
                      </Link>
                    </Button>
                    <Button variant="accent" asChild className="w-full">
                      <Link to="/register" onClick={() => setIsOpen(false)}>
                        Get Started
                      </Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
