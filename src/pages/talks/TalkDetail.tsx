// src/pages/talks/TalkDetail.tsx - COMPLETE CODE
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap, 
  Link as LinkIcon,
  BookOpen,
  User
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { 
  doc, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  increment 
} from "firebase/firestore";

const TalkDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [talk, setTalk] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchTalk();
    }
  }, [id, user]);
  
  const fetchTalk = async () => {
    try {
      setLoading(true);
      
      // Fetch talk details
      const talkRef = doc(db, "talks", id!);
      const talkSnapshot = await getDoc(talkRef);
      
      if (!talkSnapshot.exists()) {
        toast.error("Talk not found");
        return;
      }
      
      setTalk({ id: talkSnapshot.id, ...talkSnapshot.data() });
      
      // Check if user is enrolled
      if (user) {
        const enrollmentId = `${user.uid}_${id}`;
        const enrollmentRef = doc(db, "enrollments", enrollmentId);
        const enrollmentSnapshot = await getDoc(enrollmentRef);
        setIsEnrolled(enrollmentSnapshot.exists());
      }
      
    } catch (error) {
      console.error("Error fetching talk:", error);
      toast.error("Failed to load talk details");
    } finally {
      setLoading(false);
    }
  };
  
  const handleEnroll = async () => {
    if (!user) {
      toast.error("Please login to enroll");
      return;
    }
    
    try {
      const enrollmentId = `${user.uid}_${id}`;
      const enrollmentRef = doc(db, "enrollments", enrollmentId);
      
      // Add enrollment
      await setDoc(enrollmentRef, {
        talkId: id,
        userId: user.uid,
        userName: user.displayName || user.email,
        enrolledAt: new Date(),
        status: "enrolled"
      });
      
      // Update talk enrollment count
      const talkRef = doc(db, "talks", id!);
      await updateDoc(talkRef, {
        currentEnrollments: increment(1)
      });
      
      setIsEnrolled(true);
      toast.success("Successfully enrolled in talk!");
      
      // Refresh talk data
      fetchTalk();
      
    } catch (error) {
      console.error("Error enrolling:", error);
      toast.error("Failed to enroll");
    }
  };
  
  const handleUnenroll = async () => {
    try {
      const enrollmentId = `${user!.uid}_${id}`;
      const enrollmentRef = doc(db, "enrollments", enrollmentId);
      
      // Remove enrollment
      await deleteDoc(enrollmentRef);
      
      // Update talk enrollment count
      const talkRef = doc(db, "talks", id!);
      await updateDoc(talkRef, {
        currentEnrollments: increment(-1)
      });
      
      setIsEnrolled(false);
      toast.success("Successfully unenrolled");
      
      // Refresh talk data
      fetchTalk();
      
    } catch (error) {
      console.error("Error unenrolling:", error);
      toast.error("Failed to unenroll");
    }
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading talk details...</div>
        </div>
      </Layout>
    );
  }
  
  if (!talk) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Talk not found</h2>
            <p className="text-muted-foreground mt-2">
              The talk you're looking for doesn't exist.
            </p>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                {talk.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                by {talk.instructorName}
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant={talk.difficulty === "Beginner" ? "default" : 
                           talk.difficulty === "Intermediate" ? "secondary" : "destructive"}>
                {talk.difficulty}
              </Badge>
              <Badge variant="outline">{talk.category}</Badge>
            </div>
          </div>
          
          <p className="text-lg text-muted-foreground">{talk.description}</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Talk Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Prerequisites */}
            {talk.prerequisites && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-5 h-5" />
                    Prerequisites
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{talk.prerequisites}</p>
                </CardContent>
              </Card>
            )}
            
            {/* About Instructor */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  About the Instructor
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  {talk.aboutAuthor || "No information provided about the instructor."}
                </p>
              </CardContent>
            </Card>
            
            {/* Tags */}
            {talk.tags && talk.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Topics Covered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {talk.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
          
          {/* Right Column - Enrollment & Details */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Talk Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {talk.talkDate} at {talk.startTime}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Duration</p>
                    <p className="text-sm text-muted-foreground">{talk.duration}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Enrollments</p>
                    <p className="text-sm text-muted-foreground">
                      {talk.currentEnrollments || 0} / {talk.maxEnrollments} students
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Enrollment Card */}
            <Card>
              <CardHeader>
                <CardTitle>Enrollment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!user ? (
                  <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                      Please login to enroll in this talk
                    </p>
                    <Button className="w-full" asChild>
                      <a href="/login">Login to Enroll</a>
                    </Button>
                  </div>
                ) : isEnrolled ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <p className="text-sm text-green-700 dark:text-green-300">
                        ✅ You are enrolled in this talk
                      </p>
                    </div>
                    
                    {/* Meeting Link for enrolled users */}
                    {talk.meetingLink && (
                      <div className="space-y-2">
                        <h4 className="font-medium flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          How to Attend
                        </h4>
                        <p className="text-sm text-muted-foreground break-all">
                          {talk.meetingLink}
                        </p>
                        <Button variant="outline" className="w-full" asChild>
                          <a href={talk.meetingLink} target="_blank" rel="noopener noreferrer">
                            Join Meeting
                          </a>
                        </Button>
                      </div>
                    )}
                    
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={handleUnenroll}
                    >
                      Unenroll from Talk
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        {talk.maxEnrollments - (talk.currentEnrollments || 0)} spots available
                      </p>
                      <Button 
                        className="w-full" 
                        onClick={handleEnroll}
                        disabled={talk.currentEnrollments >= talk.maxEnrollments}
                      >
                        {talk.currentEnrollments >= talk.maxEnrollments 
                          ? "Talk is Full" 
                          : "Enroll Now"}
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TalkDetail;
