// src/pages/VerifyEmail.tsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "../firebase";
import { sendEmailVerification, signOut } from "firebase/auth";
import { toast } from "sonner";
import { Mail, RefreshCw, LogOut, AlertCircle, CheckCircle, ArrowLeft } from "lucide-react";

const VerifyEmail = () => {
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from location state or from current user
  useEffect(() => {
    const emailFromState = (location.state as any)?.email;
    const currentUser = auth.currentUser;
    
    if (emailFromState) {
      setUserEmail(emailFromState);
    } else if (currentUser?.email) {
      setUserEmail(currentUser.email);
    }
    
    // Set up an interval to check verification status
    const checkInterval = setInterval(() => {
      checkVerificationStatus();
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(checkInterval);
  }, [location.state]);

  const checkVerificationStatus = async () => {
    if (!auth.currentUser) return;
    
    setCheckingStatus(true);
    try {
      // Reload user to get latest emailVerified status
      await auth.currentUser.reload();
      const user = auth.currentUser;
      
      if (user?.emailVerified) {
        toast.success("Email verified successfully! Redirecting...");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error checking verification status:", error);
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleResendVerification = async () => {
    if (!auth.currentUser) return;
    
    setVerificationLoading(true);
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success("Verification email sent! Check your inbox (and spam folder).");
    } catch (error: any) {
      toast.error(error.message || "Failed to send verification email");
    } finally {
      setVerificationLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleGoBack = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="border-2 border-amber-200 dark:border-amber-800">
          <CardHeader className="text-center">
            <div className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center mx-auto mb-4">
              <Mail className="w-10 h-10 text-amber-600 dark:text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
            <CardDescription className="text-base">
              Almost there! We've sent a verification email to:
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Email Display */}
            <div className="p-4 bg-muted rounded-lg text-center">
              <p className="font-mono text-lg font-semibold break-all">
                {userEmail || "your email address"}
              </p>
            </div>

            {/* Instructions */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">1</span>
                </div>
                <div>
                  <h4 className="font-medium">Check your inbox</h4>
                  <p className="text-sm text-muted-foreground">
                    Open the email we sent to <span className="font-medium">{userEmail}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">2</span>
                </div>
                <div>
                  <h4 className="font-medium">Click the verification link</h4>
                  <p className="text-sm text-muted-foreground">
                    This confirms your email address and activates your account
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary font-bold text-sm">3</span>
                </div>
                <div>
                  <h4 className="font-medium">Return to EvDeX Academy</h4>
                  <p className="text-sm text-muted-foreground">
                    We'll automatically redirect you once your email is verified
                  </p>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="bg-amber-50 dark:bg-amber-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                {checkingStatus ? (
                  <>
                    <RefreshCw className="w-5 h-5 text-amber-600 dark:text-amber-400 animate-spin" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Checking verification status...
                    </p>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                    <p className="text-sm text-amber-800 dark:text-amber-300">
                      Waiting for email verification
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleResendVerification}
                disabled={verificationLoading}
                className="w-full"
                variant="outline"
              >
                {verificationLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Resend Verification Email
                  </>
                )}
              </Button>

              <Button 
                onClick={checkVerificationStatus}
                disabled={checkingStatus}
                className="w-full"
                variant="default"
              >
                {checkingStatus ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    I've Verified My Email
                  </>
                )}
              </Button>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button 
                  onClick={handleGoBack}
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Login
                </Button>

                <Button 
                  onClick={handleSignOut}
                  variant="ghost"
                  className="text-muted-foreground"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            </div>

            {/* Help Text */}
            <div className="text-xs text-center text-muted-foreground pt-4 border-t">
              <p>Didn't receive the email? Check your spam folder or</p>
              <button 
                onClick={handleResendVerification}
                className="text-primary hover:underline font-medium"
                disabled={verificationLoading}
              >
                click here to resend
              </button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;