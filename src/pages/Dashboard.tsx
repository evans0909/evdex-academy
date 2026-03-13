import { auth } from "../firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { signOut, sendEmailVerification } from "firebase/auth";
import { toast } from "sonner";
import { useState } from "react";
import { Layout } from "@/components/layout/Layout"; // Add this import

const Dashboard = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [verificationLoading, setVerificationLoading] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  const handleVerifyEmail = async () => {
    if (!user) return;
    
    setVerificationLoading(true);
    try {
      await sendEmailVerification(user);
      toast.success("Verification email sent! Check your inbox (and spam folder).");
    } catch (error: any) {
      console.error("Email verification error:", error);
      
      let errorMessage = "Failed to send verification email.";
      switch (error.code) {
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Try again later.";
          break;
        case "auth/user-not-found":
          errorMessage = "User not found.";
          break;
      }
      
      toast.error(errorMessage);
    } finally {
      setVerificationLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Layout> {/* Wrap everything with Layout */}
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-foreground">
                Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}! 👋
              </h1>
              <p className="text-muted-foreground mt-2">
                Here's your personalized dashboard at EvDeX Academy
              </p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Account Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Info</CardTitle>
                <CardDescription>Your profile details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email Verified</p>
                    <div className="flex items-center gap-2">
                      <span>{user?.emailVerified ? "✅ Yes" : "❌ No"}</span>
                      {!user?.emailVerified && (
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleVerifyEmail}
                          disabled={verificationLoading}
                          className="ml-2"
                        >
                          {verificationLoading ? "Sending..." : "Verify"}
                        </Button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">User ID</p>
                    <p className="font-mono text-xs truncate">{user?.uid}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Account Created</p>
                    <p>{formatDate(user?.metadata.creationTime || '')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Things you can do</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full" variant="outline" onClick={() => navigate("/talks")}>
                    Browse Talks
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/universities")}>
                    View Universities
                  </Button>
                  <Button className="w-full" variant="outline" onClick={() => navigate("/")}>
                    Go Home
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Authentication Status</CardTitle>
                <CardDescription>Firebase auth details</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={`p-4 rounded-lg border ${user?.emailVerified ? 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800' : 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800'}`}>
                  <div className={`flex items-center gap-2 ${user?.emailVerified ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
                    <div className={`w-3 h-3 rounded-full ${user?.emailVerified ? 'bg-green-500' : 'bg-yellow-500 animate-pulse'}`}></div>
                    <span className="font-medium">
                      {user?.emailVerified ? "✅ Verified & Authenticated" : "⚠️ Authenticated (Not Verified)"}
                    </span>
                  </div>
                  <p className={`text-sm mt-2 ${user?.emailVerified ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                    {user?.emailVerified 
                      ? "Your email is verified. Full account access granted."
                      : "Please verify your email for full account access."
                    }
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Email Verification Info */}
          {!user?.emailVerified && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Email Verification Required</CardTitle>
                  <CardDescription>Important for account security</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      Please verify your email address to unlock all features. This helps prevent spam and keeps your account secure.
                    </p>
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">What happens after verification?</h4>
                      <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc pl-5">
                        <li>Full account access</li>
                        <li>Password reset capability</li>
                        <li>Account recovery options</li>
                        <li>Enhanced security</li>
                      </ul>
                    </div>
                    <Button 
                      onClick={handleVerifyEmail} 
                      disabled={verificationLoading}
                      className="w-full md:w-auto"
                    >
                      {verificationLoading ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending Verification Email...
                        </>
                      ) : "Send Verification Email"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;