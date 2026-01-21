import { useState, useEffect } from "react";
import { auth } from "../firebase";
import { updateProfile } from "firebase/auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Mail, Calendar, Shield, Save } from "lucide-react";
import { toast } from "sonner";
import ProtectedRoute from "../components/ProtectedRoute";

const Profile = () => {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await updateProfile(user, { displayName });
      toast.success("Profile updated successfully!");
      setEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    if (!user?.email) return "U";
    const name = displayName || user.email.split("@")[0];
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">Your Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your account information</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Avatar & Actions */}
          <div className="space-y-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-32 h-32 mb-4">
                    <AvatarFallback className="text-2xl bg-gradient-to-br from-secondary to-accent">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                  <h2 className="text-xl font-semibold">
                    {displayName || user?.email?.split("@")[0]}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {user?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/dashboard"}>
                  Dashboard
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/settings"}>
                  Settings
                </Button>
                <Button variant="outline" className="w-full" onClick={() => window.location.href = "/reset-password"}>
                  Change Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="displayName">Display Name</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="displayName"
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="Enter your display name"
                        disabled={!editing}
                      />
                      {editing ? (
                        <Button onClick={handleSaveProfile} disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </Button>
                      ) : (
                        <Button variant="outline" onClick={() => setEditing(true)}>
                          Edit
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </Label>
                      <Input value={user?.email || ""} disabled />
                      <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> Member Since
                      </Label>
                      <Input 
                        value={user?.metadata.creationTime 
                          ? new Date(user.metadata.creationTime).toLocaleDateString()
                          : "N/A"
                        } 
                        disabled 
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account Security</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Email Verification</p>
                      <p className="text-sm text-muted-foreground">
                        {user?.emailVerified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  <Button size="sm" variant={user?.emailVerified ? "outline" : "default"}>
                    {user?.emailVerified ? "Verified" : "Verify"}
                  </Button>
                </div>

                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    <strong>User ID:</strong> {user?.uid}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// Wrap with ProtectedRoute


export default Profile;

