import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { collection, getDocs, doc, updateDoc, setDoc, getDoc, query, where, deleteDoc } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  Users, 
  Shield, 
  BarChart3, 
  Settings, 
  Search, 
  UserCog,
  AlertCircle,
  CheckCircle,
  XCircle,
  RefreshCw,
  Database,
  UserPlus,
  Mail,
  MessageSquare,
  Phone,
  Calendar,
  Trash2,
  Eye,
  Check,
  Clock,
  User,
  Tag,
  GraduationCap,
  UserMinus
} from "lucide-react";
import { Layout } from "@/components/layout/Layout"; // 👈 ONLY THIS LINE ADDED

interface User {
  id: string;
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "tutor" | "user";
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
  isActive?: boolean;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  serviceType?: string;
  source?: string;
  status: "new" | "read" | "replied" | "resolved";
  timestamp: any;
  readAt?: string;
  repliedAt?: string;
}

const AdminDashboard = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [filteredMessages, setFilteredMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [authLoading, setAuthLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [messageSearch, setMessageSearch] = useState("");
  const [activeTab, setActiveTab] = useState("users");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [replyText, setReplyText] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    admins: 0,
    tutors: 0,
    verified: 0,
    active: 0,
    totalMessages: 0,
    newMessages: 0
  });

  const [isAdmin, setIsAdmin] = useState(false);

  const currentUser = auth.currentUser;

  // Check if current user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      setAuthLoading(true);
      
      if (!currentUser) {
        setIsAdmin(false);
        setAuthLoading(false);
        return;
      }
      
      try {
        const userByUidRef = doc(db, "users", currentUser.uid);
        const userByUidDoc = await getDoc(userByUidRef);
        
        if (userByUidDoc.exists()) {
          const userData = userByUidDoc.data();
          setIsAdmin(userData.role === "admin");
        } else {
          const usersRef = collection(db, "users");
          const q = query(usersRef, where("email", "==", currentUser.email));
          const querySnapshot = await getDocs(q);
          
          if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const userData = userDoc.data();
            setIsAdmin(userData.role === "admin");
          } else {
            setIsAdmin(false);
          }
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        setIsAdmin(false);
      } finally {
        setAuthLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [currentUser]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchContactMessages();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      
      const usersList: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        let createdAt = new Date().toISOString();
        if (data.createdAt) {
          try {
            if (data.createdAt.toDate) {
              createdAt = data.createdAt.toDate().toISOString();
            } else if (data.createdAt.seconds) {
              createdAt = new Date(data.createdAt.seconds * 1000).toISOString();
            }
          } catch {
            createdAt = new Date().toISOString();
          }
        }
        
        let lastLogin = undefined;
        if (data.lastLogin) {
          try {
            if (data.lastLogin.toDate) {
              lastLogin = data.lastLogin.toDate().toISOString();
            } else if (data.lastLogin.seconds) {
              lastLogin = new Date(data.lastLogin.seconds * 1000).toISOString();
            }
          } catch {
            // Ignore date parsing errors
          }
        }
        
        let role: "admin" | "tutor" | "user" = "user";
        if (data.role === "admin") role = "admin";
        else if (data.role === "tutor") role = "tutor";
        
        usersList.push({
          id: doc.id,
          uid: data.uid || doc.id,
          email: data.email || "No email",
          displayName: data.displayName || data.email?.split('@')[0] || "User",
          role,
          emailVerified: data.emailVerified || false,
          createdAt,
          lastLogin,
          isActive: data.isActive !== false
        });
      });
      
      usersList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setUsers(usersList);
      setFilteredUsers(usersList);
      
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        toast.error("You don't have permission to view users");
      } else {
        toast.error("Failed to load users");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchContactMessages = async () => {
    setMessagesLoading(true);
    try {
      const messagesRef = collection(db, "contactMessages");
      const snapshot = await getDocs(messagesRef);
      
      const messagesList: ContactMessage[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        
        let timestamp = "";
        if (data.timestamp) {
          try {
            if (data.timestamp.toDate) {
              timestamp = data.timestamp.toDate().toISOString();
            } else if (data.timestamp.seconds) {
              timestamp = new Date(data.timestamp.seconds * 1000).toISOString();
            } else if (typeof data.timestamp === 'string') {
              timestamp = data.timestamp;
            }
          } catch {
            timestamp = new Date().toISOString();
          }
        } else {
          timestamp = new Date().toISOString();
        }
        
        messagesList.push({
          id: doc.id,
          name: data.name || "Unknown",
          email: data.email || "No email",
          phone: data.phone,
          subject: data.subject || "No subject",
          message: data.message || "No message",
          serviceType: data.serviceType,
          source: data.source || "contact_form",
          status: data.status || "new",
          timestamp: timestamp,
          readAt: data.readAt,
          repliedAt: data.repliedAt
        });
      });
      
      messagesList.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      setContactMessages(messagesList);
      setFilteredMessages(messagesList);
      
      setStats(prev => ({
        ...prev,
        totalMessages: messagesList.length,
        newMessages: messagesList.filter(m => m.status === "new").length
      }));
      
    } catch (error: any) {
      if (error.code === 'permission-denied') {
        toast.error("You don't have permission to view contact messages");
      } else {
        toast.error("Failed to load contact messages");
      }
    } finally {
      setMessagesLoading(false);
    }
  };

  useEffect(() => {
    const filtered = users.filter(user =>
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.displayName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.includes(searchQuery.toLowerCase())
    );
    
    setFilteredUsers(filtered);
    
    setStats(prev => ({
      ...prev,
      total: users.length,
      admins: users.filter(u => u.role === "admin").length,
      tutors: users.filter(u => u.role === "tutor").length,
      verified: users.filter(u => u.emailVerified).length,
      active: users.filter(u => u.isActive !== false && u.lastLogin).length
    }));
  }, [users, searchQuery]);

  useEffect(() => {
    const filtered = contactMessages.filter(message =>
      message.name.toLowerCase().includes(messageSearch.toLowerCase()) ||
      message.email.toLowerCase().includes(messageSearch.toLowerCase()) ||
      message.subject.toLowerCase().includes(messageSearch.toLowerCase()) ||
      message.message.toLowerCase().includes(messageSearch.toLowerCase())
    );
    
    setFilteredMessages(filtered);
  }, [contactMessages, messageSearch]);

  const handleMakeAdmin = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;
      
      const userRef = doc(db, "users", userId);
      
      const userDoc = await getDoc(userRef);
      const currentData = userDoc.exists() ? userDoc.data() : {};
      
      await updateDoc(userRef, { 
        role: "admin",
        updatedAt: new Date(),
        isActive: true,
        uid: currentData.uid || userId,
        email: currentData.email || userToUpdate.email,
        displayName: currentData.displayName || userToUpdate.displayName,
        emailVerified: currentData.emailVerified || false
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: "admin" as const } : user
      ));
      
      toast.success(`${userToUpdate.email || "User"} promoted to admin`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleRemoveAdmin = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;
      
      if (userId === currentUser?.uid) {
        toast.error("Cannot remove admin privileges from yourself");
        return;
      }
      
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { 
        role: "user",
        updatedAt: new Date() 
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: "user" as const } : user
      ));
      
      toast.success(`${userToUpdate.email || "User"} admin privileges removed`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleMakeTutor = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;
      
      const userRef = doc(db, "users", userId);
      
      const userDoc = await getDoc(userRef);
      const currentData = userDoc.exists() ? userDoc.data() : {};
      
      await updateDoc(userRef, { 
        role: "tutor",
        updatedAt: new Date(),
        isActive: true,
        uid: currentData.uid || userId,
        email: currentData.email || userToUpdate.email,
        displayName: currentData.displayName || userToUpdate.displayName,
        emailVerified: currentData.emailVerified || false
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: "tutor" as const } : user
      ));
      
      toast.success(`${userToUpdate.email || "User"} promoted to tutor`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleRemoveTutor = async (userId: string) => {
    try {
      const userToUpdate = users.find(u => u.id === userId);
      if (!userToUpdate) return;
      
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, { 
        role: "user",
        updatedAt: new Date() 
      });
      
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: "user" as const } : user
      ));
      
      toast.success(`${userToUpdate.email || "User"} tutor privileges removed`);
    } catch (error) {
      toast.error("Failed to update user role");
    }
  };

  const handleViewMessage = async (message: ContactMessage) => {
    setSelectedMessage(message);
    
    if (message.status === "new") {
      try {
        const messageRef = doc(db, "contactMessages", message.id);
        await updateDoc(messageRef, { 
          status: "read",
          readAt: new Date().toISOString()
        });
        
        setContactMessages(contactMessages.map(m => 
          m.id === message.id ? { ...m, status: "read", readAt: new Date().toISOString() } : m
        ));
        
        setFilteredMessages(filteredMessages.map(m => 
          m.id === message.id ? { ...m, status: "read", readAt: new Date().toISOString() } : m
        ));
        
      } catch (error) {
        console.error("Error marking message as read:", error);
      }
    }
  };

  const handleMarkAsReplied = async (messageId: string) => {
    try {
      const messageRef = doc(db, "contactMessages", messageId);
      await updateDoc(messageRef, { 
        status: "replied",
        repliedAt: new Date().toISOString()
      });
      
      setContactMessages(contactMessages.map(m => 
        m.id === messageId ? { ...m, status: "replied", repliedAt: new Date().toISOString() } : m
      ));
      
      setFilteredMessages(filteredMessages.map(m => 
        m.id === messageId ? { ...m, status: "replied", repliedAt: new Date().toISOString() } : m
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status: "replied", repliedAt: new Date().toISOString() } : null);
      }
      
      toast.success("Marked as replied");
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleMarkAsResolved = async (messageId: string) => {
    try {
      const messageRef = doc(db, "contactMessages", messageId);
      await updateDoc(messageRef, { 
        status: "resolved"
      });
      
      setContactMessages(contactMessages.map(m => 
        m.id === messageId ? { ...m, status: "resolved" } : m
      ));
      
      setFilteredMessages(filteredMessages.map(m => 
        m.id === messageId ? { ...m, status: "resolved" } : m
      ));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(prev => prev ? { ...prev, status: "resolved" } : null);
      }
      
      toast.success("Marked as resolved");
    } catch (error) {
      toast.error("Failed to update message status");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    
    try {
      const messageRef = doc(db, "contactMessages", messageId);
      await deleteDoc(messageRef);
      
      setContactMessages(contactMessages.filter(m => m.id !== messageId));
      setFilteredMessages(filteredMessages.filter(m => m.id !== messageId));
      
      if (selectedMessage?.id === messageId) {
        setSelectedMessage(null);
      }
      
      toast.success("Message deleted");
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText.trim()) return;
    
    try {
      await handleMarkAsReplied(selectedMessage.id);
      setReplyText("");
      toast.success("Reply sent and marked as replied");
    } catch (error) {
      toast.error("Failed to send reply");
    }
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "new":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">New</Badge>;
      case "read":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Read</Badge>;
      case "replied":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Replied</Badge>;
      case "resolved":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTimeAgo = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) {
      return `${diffMins}m ago`;
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      return `${diffDays}d ago`;
    }
  };

  const getRoleBadge = (role: string) => {
    switch(role) {
      case "admin":
        return <Badge className="bg-purple-600 text-white">Admin</Badge>;
      case "tutor":
        return <Badge className="bg-green-600 text-white">Tutor</Badge>;
      default:
        return <Badge variant="secondary">User</Badge>;
    }
  };

  const testFirestoreConnection = async () => {
    try {
      toast.loading("Testing Firestore connection...");
      
      const usersRef = collection(db, "users");
      const snapshot = await getDocs(usersRef);
      
      toast.dismiss();
      toast.success(`Connected! Found ${snapshot.size} user(s)`);
      
    } catch (error) {
      toast.dismiss();
      toast.error("Firestore connection failed");
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="w-5 h-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              Administrator privileges required
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-sm text-red-700 dark:text-red-300">
                Your account ({currentUser?.email}) is not an admin.
                <br />
                <span className="text-xs mt-1 block">
                  Your role in Firestore is not set to "admin"
                </span>
              </p>
            </div>
            <Button className="w-full" onClick={() => window.location.href = "/"}>
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Layout> {/* 👈 ONLY THIS LINE ADDED (opening tag) */}
      <div className="min-h-screen bg-gradient-to-b from-background to-muted p-4 md:p-8 pt-24">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <Shield className="w-8 h-8 text-purple-600" />
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground mt-2">
                Manage users, tutors, contact messages, and system configuration
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="default" className="bg-purple-600 px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Administrator
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={testFirestoreConnection}
                className="flex items-center gap-2"
              >
                <Database className="w-4 h-4" />
                Test Connection
              </Button>
            </div>
          </div>

          {/* Stats Cards - Updated with Tutors */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">Registered accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.admins}</div>
                <p className="text-xs text-muted-foreground">Admin accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Tutors</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.tutors || 0}</div>
                <p className="text-xs text-muted-foreground">Tutor accounts</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Verified</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.verified}</div>
                <p className="text-xs text-muted-foreground">Email verified</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.active}</div>
                <p className="text-xs text-muted-foreground">Recently active</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Messages</CardTitle>
                <Mail className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalMessages}</div>
                <p className="text-xs text-muted-foreground">{stats.newMessages} new</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Online</div>
                <p className="text-xs text-muted-foreground">All systems operational</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="users" className="flex items-center gap-2">
                <UserCog className="w-4 h-4" />
                User Management
              </TabsTrigger>
              <TabsTrigger value="messages" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Contact Messages
                {stats.newMessages > 0 && (
                  <Badge className="ml-2 bg-red-500 text-white px-2 py-0.5 text-xs">
                    {stats.newMessages}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserCog className="w-5 h-5" />
                        User Management
                      </CardTitle>
                      <CardDescription>
                        Manage user accounts and permissions (Admins, Tutors, and Users)
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      <div className="relative flex-1 md:flex-none">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search users..."
                          className="pl-9"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={fetchUsers} 
                        disabled={loading}
                        className="flex items-center gap-2"
                      >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="mt-2 text-muted-foreground">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-8">
                      <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No users found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery ? "Try a different search term" : "No users in database yet"}
                      </p>
                      <Button onClick={fetchUsers}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh Data
                      </Button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>User</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead className="text-center">Admin Actions</TableHead>
                            <TableHead className="text-center">Tutor Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>
                                <div>
                                  <p className="font-medium">{user.displayName || user.email.split('@')[0]}</p>
                                  <p className="text-sm text-muted-foreground">{user.email}</p>
                                  {user.id === currentUser?.uid && (
                                    <Badge variant="outline" className="mt-1 text-xs">
                                      Current User
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {getRoleBadge(user.role)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  {user.emailVerified ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <XCircle className="w-4 h-4 text-amber-500" />
                                  )}
                                  <span>{user.emailVerified ? "Verified" : "Not Verified"}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                {new Date(user.createdAt).toLocaleDateString()}
                                <br />
                                <span className="text-xs text-muted-foreground">
                                  {new Date(user.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </TableCell>
                              <TableCell>
                                {user.lastLogin ? (
                                  <>
                                    {new Date(user.lastLogin).toLocaleDateString()}
                                    <br />
                                    <span className="text-xs text-muted-foreground">
                                      {new Date(user.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </>
                                ) : (
                                  "Never"
                                )}
                              </TableCell>
                              
                              {/* Admin Actions Column */}
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-2">
                                  {user.role === "admin" ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRemoveAdmin(user.id)}
                                      disabled={user.id === currentUser?.uid}
                                      className="text-xs"
                                    >
                                      Remove Admin
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      onClick={() => handleMakeAdmin(user.id)}
                                      className="flex items-center gap-1 text-xs"
                                    >
                                      <UserPlus className="w-3 h-3" />
                                      Make Admin
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                              
                              {/* Tutor Actions Column */}
                              <TableCell className="text-center">
                                <div className="flex justify-center gap-2">
                                  {user.role === "admin" ? (
                                    <span className="text-xs text-muted-foreground">—</span>
                                  ) : user.role === "tutor" ? (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleRemoveTutor(user.id)}
                                      className="text-xs text-orange-600 border-orange-200 hover:bg-orange-50"
                                    >
                                      <UserMinus className="w-3 h-3 mr-1" />
                                      Remove Tutor
                                    </Button>
                                  ) : (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => handleMakeTutor(user.id)}
                                      className="text-xs text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                      <GraduationCap className="w-3 h-3 mr-1" />
                                      Make Tutor
                                    </Button>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Messages Tab */}
            <TabsContent value="messages">
              <div className="grid lg:grid-cols-3 gap-6">
                {/* Messages List */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Mail className="w-5 h-5" />
                          Contact Messages
                        </CardTitle>
                        <CardDescription>
                          View and manage contact form submissions
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2 w-full md:w-auto">
                        <div className="relative flex-1 md:flex-none">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            placeholder="Search messages..."
                            className="pl-9"
                            value={messageSearch}
                            onChange={(e) => setMessageSearch(e.target.value)}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          onClick={fetchContactMessages} 
                          disabled={messagesLoading}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className={`w-4 h-4 ${messagesLoading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {messagesLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-2 text-muted-foreground">Loading messages...</p>
                      </div>
                    ) : filteredMessages.length === 0 ? (
                      <div className="text-center py-8">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No messages found</h3>
                        <p className="text-muted-foreground mb-4">
                          {messageSearch ? "Try a different search term" : "No contact messages yet"}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                        {filteredMessages.map((message) => (
                          <div 
                            key={message.id}
                            className={`p-4 rounded-lg border cursor-pointer transition-all hover:border-primary/50 ${
                              selectedMessage?.id === message.id 
                                ? 'bg-primary/5 border-primary' 
                                : 'bg-card'
                            } ${message.status === 'new' ? 'border-l-4 border-l-red-500' : ''}`}
                            onClick={() => handleViewMessage(message)}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <h4 className="font-medium text-foreground">
                                  {message.subject}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  From: {message.name} • {message.email}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {getStatusBadge(message.status)}
                                <span className="text-xs text-muted-foreground">
                                  {getTimeAgo(message.timestamp)}
                                </span>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {message.message}
                            </p>
                            {message.serviceType && (
                              <div className="mt-2">
                                <Badge variant="outline" className="text-xs">
                                  <Tag className="w-3 h-3 mr-1" />
                                  {message.serviceType}
                                </Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Message Detail Panel */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Eye className="w-5 h-5" />
                      Message Details
                    </CardTitle>
                    <CardDescription>
                      {selectedMessage ? "View and respond to message" : "Select a message to view details"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {selectedMessage ? (
                      <div className="space-y-6">
                        {/* Message Info */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="font-bold text-lg">{selectedMessage.subject}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              {getStatusBadge(selectedMessage.status)}
                              <span className="text-sm text-muted-foreground">
                                {new Date(selectedMessage.timestamp).toLocaleString()}
                              </span>
                            </div>
                          </div>

                          {/* Sender Info */}
                          <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">From</p>
                              <p className="font-medium">{selectedMessage.name}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="font-medium">{selectedMessage.email}</p>
                            </div>
                            {selectedMessage.phone && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                                <p className="font-medium">{selectedMessage.phone}</p>
                              </div>
                            )}
                            {selectedMessage.serviceType && (
                              <div>
                                <p className="text-sm font-medium text-muted-foreground">Service</p>
                                <p className="font-medium">{selectedMessage.serviceType}</p>
                              </div>
                            )}
                          </div>

                          {/* Message Content */}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Message</p>
                            <div className="p-3 bg-muted rounded-lg whitespace-pre-wrap">
                              {selectedMessage.message}
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-4">
                          <div className="flex flex-wrap gap-2">
                            {selectedMessage.status !== "replied" && (
                              <Button
                                size="sm"
                                onClick={() => handleMarkAsReplied(selectedMessage.id)}
                                className="flex items-center gap-1"
                              >
                                <Check className="w-4 h-4" />
                                Mark as Replied
                              </Button>
                            )}
                            {selectedMessage.status !== "resolved" && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleMarkAsResolved(selectedMessage.id)}
                              >
                                Mark as Resolved
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteMessage(selectedMessage.id)}
                              className="flex items-center gap-1"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </Button>
                          </div>

                          {/* Reply Section */}
                          <div>
                            <p className="text-sm font-medium text-muted-foreground mb-2">Reply to Sender</p>
                            <Textarea
                              placeholder="Type your reply here..."
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              rows={4}
                              className="mb-2"
                            />
                            <Button 
                              onClick={handleSendReply} 
                              disabled={!replyText.trim()}
                              className="w-full"
                            >
                              <Mail className="w-4 h-4 mr-2" />
                              Send Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">
                          Select a message from the list to view details
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* System Info */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Current Admin</p>
                  <p className="font-medium">{currentUser?.email}</p>
                  <p className="text-sm text-muted-foreground">UID: {currentUser?.uid}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Firestore Status</p>
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${users.length > 0 ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                    <p className="font-medium">
                      {users.length > 0 ? "Connected" : "Initializing"}
                    </p>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {users.length} user(s) • {stats.admins} admin(s) • {stats.tutors} tutor(s) • {contactMessages.length} message(s)
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Permissions</p>
                  <p className="font-medium">Full Access</p>
                  <p className="text-sm text-muted-foreground">
                    Can manage users, tutors, messages, and system settings
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout> // 👈 ONLY THIS LINE ADDED (closing tag)
  );
};

export default AdminDashboard;