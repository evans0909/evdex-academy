import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, Mail, Lock, Eye, EyeOff, User, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from "firebase/auth";
import { createUserDocument } from "../services/userService";

const passwordRequirements = [
  { label: "At least 8 characters", check: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", check: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains lowercase letter", check: (p: string) => /[a-z]/.test(p) },
  { label: "Contains a number", check: (p: string) => /\d/.test(p) },
];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }
    
    // Check all password requirements
    const failedRequirements = passwordRequirements.filter(
      req => !req.check(formData.password)
    );
    
    if (failedRequirements.length > 0) {
      toast.error("Please meet all password requirements!");
      return;
    }

    setLoading(true);

    try {
      // Firebase registration
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email, 
        formData.password
      );
      
      // Create user document in Firestore
      await createUserDocument(userCredential.user);

      // Update user's display name in Firebase Auth
      await updateProfile(userCredential.user, {
        displayName: formData.name
      });

      // Send email verification
      await sendEmailVerification(userCredential.user);
      console.log("Verification email sent to:", userCredential.user.email);

      // Success message
      toast.success(
        <div>
          <p className="font-bold">Welcome {formData.name}! 🎉</p>
          <p className="text-sm mt-1">Please verify your email to continue.</p>
        </div>,
        { duration: 6000 }
      );
      
      console.log("Registered user:", userCredential.user);
      
      // Redirect to verification screen
      navigate("/verify-email", { 
        state: { email: formData.email } 
      });
      
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // User-friendly error messages
      let errorMessage = "Registration failed. Please try again.";
      
      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage = "Email already registered. Try logging in instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Email/password accounts are not enabled. Contact support.";
          break;
        case "auth/weak-password":
          errorMessage = "Password is too weak. Please meet all requirements.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        default:
          errorMessage = error.message || "Registration failed.";
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Check if all password requirements are met
  const allRequirementsMet = passwordRequirements.every(req => req.check(formData.password));

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
            Join Our Community
          </h2>
          <p className="text-primary-foreground/80 leading-relaxed">
            Create an account to start learning, create your own talks,
            and connect with fellow developers.
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
            Create an account
          </h1>
          <p className="text-muted-foreground mb-8">
            Start your coding journey today
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

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
                  disabled={loading}
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
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Password Requirements */}
              {formData.password && (
                <div className="mt-2 p-3 rounded-lg bg-background space-y-1">
                  {passwordRequirements.map((req) => (
                    <div
                      key={req.label}
                      className={`flex items-center gap-2 text-xs ${
                        req.check(formData.password) ? "text-green-600 dark:text-green-400" : "text-muted-foreground"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {req.label}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button 
              type="submit" 
              variant="accent" 
              className="w-full" 
              size="lg"
              disabled={loading || !allRequirementsMet}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </>
              ) : "Create Account"}
            </Button>
          </form>

          <p className="text-center text-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-secondary font-medium hover:underline">
              Sign in
            </Link>
          </p>
          
          {/* Email verification notice */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-300">
            <p className="font-medium flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email verification required
            </p>
            <p className="mt-1">
              After registration, you'll be redirected to verify your email before accessing your account.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;