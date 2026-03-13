// src/pages/Login.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Mail, Lock, Eye, EyeOff, LogIn, Github } from "lucide-react";
import { toast } from "sonner";
import { auth } from "../firebase";
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider 
} from "firebase/auth";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get message from location state (e.g., from registration)
  const message = location.state?.message;
  const emailFromState = location.state?.email;
  
  // If email was passed (from registration), pre-fill it
  if (emailFromState && !formData.email) {
    setFormData(prev => ({ ...prev, email: emailFromState }));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      toast.success("Logged in successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      
      let errorMessage = "Login failed. Please try again.";
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address.";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled.";
          break;
        case "auth/user-not-found":
        case "auth/wrong-password":
          errorMessage = "Invalid email or password.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Try again later.";
          break;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-In Handler
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // User is signed in
      const user = result.user;
      console.log("Google login successful:", user.email);
      
      toast.success(`Welcome ${user.displayName || user.email}!`);
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("Google login error:", error);
      
      let errorMessage = "Google login failed. Please try again.";
      
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in cancelled. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked by your browser. Please allow popups.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email address but different sign-in credentials.";
          break;
      }
      
      if (errorMessage) {
        toast.error(errorMessage);
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // GitHub Sign-In Handler
  const handleGithubLogin = async () => {
    setGithubLoading(true);
    
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // User is signed in
      const user = result.user;
      console.log("GitHub login successful:", user.email);
      
      toast.success(`Welcome ${user.displayName || user.email}!`);
      navigate("/dashboard");
      
    } catch (error: any) {
      console.error("GitHub login error:", error);
      
      let errorMessage = "GitHub login failed. Please try again.";
      
      switch (error.code) {
        case "auth/popup-closed-by-user":
          errorMessage = "Sign-in cancelled. Please try again.";
          break;
        case "auth/popup-blocked":
          errorMessage = "Popup was blocked by your browser. Please allow popups.";
          break;
        case "auth/account-exists-with-different-credential":
          errorMessage = "An account already exists with the same email address but different sign-in credentials.";
          break;
      }
      
      if (errorMessage) {
        toast.error(errorMessage);
      }
    } finally {
      setGithubLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-muted flex">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex flex-1 bg-hero-gradient items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="max-w-lg text-center"
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center mx-auto mb-8 shadow-glow">
            <Code2 className="w-12 h-12 text-accent-foreground" />
          </div>
          <h2 className="text-3xl font-display font-bold text-primary-foreground mb-4">
            Welcome Back!
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Continue your coding journey with EvDeX Academy. Access talks, materials, and connect with fellow developers.
          </p>
        </motion.div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Link to="/" className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <Code2 className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">
              EvDeX<span className="text-secondary"> Academy</span>
            </span>
          </Link>

          <h1 className="text-3xl font-display font-bold text-foreground mb-2">
            Sign in to your account
          </h1>
          <p className="text-muted-foreground mb-8">
            Welcome back! Please enter your details
          </p>

          {/* Success/Info Message */}
          {message && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg text-sm text-green-800 dark:text-green-300">
              {message}
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="pl-10"
                  required
                  disabled={loading || googleLoading || githubLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  required
                  disabled={loading || googleLoading || githubLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading || googleLoading || githubLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="accent" 
              className="w-full" 
              size="lg"
              disabled={loading || googleLoading || githubLoading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign in with Email
                </>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          {/* Social Login Buttons Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Google Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2 h-11"
              onClick={handleGoogleLogin}
              disabled={loading || googleLoading || githubLoading}
            >
              {googleLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </>
              )}
            </Button>

            {/* GitHub Sign-In Button */}
            <Button
              type="button"
              variant="outline"
              className="flex items-center justify-center gap-2 h-11"
              onClick={handleGithubLogin}
              disabled={loading || googleLoading || githubLoading}
            >
              {githubLoading ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <>
                  <Github className="w-5 h-5" />
                  GitHub
                </>
              )}
            </Button>
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-secondary font-medium hover:underline">
              Sign up
            </Link>
          </p>
          
          <p className="text-center mt-4">
            <Link to="/reset-password" className="text-sm text-muted-foreground hover:text-foreground">
              Forgot your password?
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;