import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Code2, Mail, CheckCircle, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { auth } from "../firebase";
import { sendPasswordResetEmail } from "firebase/auth";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      await sendPasswordResetEmail(auth, email);
      
      // Success
      setEmailSent(true);
      toast.success("Password reset email sent!");
      
      // Log for debugging
      console.log("Password reset email sent to:", email);
      
    } catch (error: any) {
      console.error("Password reset error:", error);
      
      // User-friendly error messages
      let errorMessage = "Failed to send reset email. Please try again.";
      
      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Invalid email address format.";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email.";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later.";
          break;
        case "auth/operation-not-allowed":
          errorMessage = "Password reset is not enabled. Contact support.";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Check your connection.";
          break;
      }
      
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center">
            <Link to="/" className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                <Code2 className="w-5 h-5 text-accent-foreground" />
              </div>
              <span className="font-display text-xl font-bold text-foreground">
                EvDeX<span className="text-secondary"> Academy</span>
              </span>
            </Link>
            
            <CardTitle className="text-2xl">
              {emailSent ? "Check Your Email" : "Reset Your Password"}
            </CardTitle>
            <CardDescription>
              {emailSent 
                ? "We've sent password reset instructions to your email"
                : "Enter your email to receive a password reset link"
              }
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            {emailSent ? (
              // Success State
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="text-center space-y-6"
              >
                <div className="w-20 h-20 mx-auto rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Email Sent Successfully!</h3>
                  <p className="text-muted-foreground">
                    We've sent password reset instructions to:
                  </p>
                  <p className="font-medium text-foreground mt-1">{email}</p>
                </div>
                
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-1">
                    What to do next:
                  </h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-400 text-left space-y-1">
                    <li>1. Check your inbox (and spam folder)</li>
                    <li>2. Click the password reset link in the email</li>
                    <li>3. Follow instructions to set a new password</li>
                    <li>4. Login with your new password</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setEmailSent(false)}
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Send Again
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate("/login")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Form State
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="pl-10"
                      required
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enter the email address associated with your account
                  </p>
                </div>
                
                <Button 
                  type="submit" 
                  variant="accent" 
                  className="w-full" 
                  size="lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending Reset Link...
                    </>
                  ) : "Send Reset Link"}
                </Button>
              </form>
            )}
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              Remember your password?{" "}
              <Link to="/login" className="text-secondary font-medium hover:underline">
                Back to Login
              </Link>
            </div>
            
            {!emailSent && (
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-sm">
                <p className="text-amber-800 dark:text-amber-300">
                  <strong>Note:</strong> The reset link will expire in 1 hour. 
                  If you don't see the email, check your spam folder.
                </p>
              </div>
            )}
          </CardFooter>
        </Card>
        
        {/* Firebase Note */}
        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm text-center">
          <p className="text-muted-foreground">
            Password reset powered by Firebase Authentication
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

