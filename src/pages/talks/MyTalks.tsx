// src/pages/talks/MyTalks.tsx - COMPLETE CODE
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { 
  Calendar, 
  Clock, 
  Users, 
  BookOpen, 
  GraduationCap,
  ExternalLink,
  ChevronRight,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc, 
  getDoc,
  deleteDoc,
  updateDoc,
  increment
} from "firebase/firestore";

interface Talk {
  id: string;
  title: string;
  description: string;
  instructorName: string;
  category: string;
  difficulty: string;
  duration: string;
  talkDate: string;
  startTime: string;
  maxEnrollments: number;
  currentEnrollments: number;
  meetingLink?: string;
  prerequisites?: string;
  tags?: string[];
}

const MyTalks = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [enrolledTalks, setEnrolledTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!authLoading && user) {
      fetchEnrolledTalks();
    }
  }, [authLoading, user]);
  
  const fetchEnrolledTalks = async () => {
    try {
      setLoading(true);
      
      if (!user) {
        setEnrolledTalks([]);
        return;
      }
      
      // Query enrollments for current user
      const enrollmentsRef = collection(db, "enrollments");
      const q = query(enrollmentsRef, where("userId", "==", user.uid));
      const snapshot = await getDocs(q);
      
      // Get talk details for each enrollment
      const talks: Talk[] = [];
      for (const enrollmentDoc of snapshot.docs) {
        const enrollmentData = enrollmentDoc.data();
        const talkId = enrollmentData.talkId;
        
        if (talkId) {
          const talkRef = doc(db, "talks", talkId);
          const talkDoc = await getDoc(talkRef);
          
          if (talkDoc.exists()) {
            talks.push({
              id: talkDoc.id,
              ...talkDoc.data()
            } as Talk);
          }
        }
      }
      
      setEnrolledTalks(talks);
      
    } catch (error) {
      console.error("Error fetching enrolled talks:", error);
      toast.error("Failed to load your enrolled talks");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUnenroll = async (talkId: string) => {
    if (!user) return;
    
    try {
      const enrollmentId = `${user.uid}_${talkId}`;
      const enrollmentRef = doc(db, "enrollments", enrollmentId);
      
      // Remove enrollment
      await deleteDoc(enrollmentRef);
      
      // Update talk enrollment count
      const talkRef = doc(db, "talks", talkId);
      await updateDoc(talkRef, {
        currentEnrollments: increment(-1)
      });
      
      // Update local state
      setEnrolledTalks(prev => prev.filter(talk => talk.id !== talkId));
      
      toast.success("Successfully unenrolled from talk");
      
    } catch (error) {
      console.error("Error unenrolling:", error);
      toast.error("Failed to unenroll");
    }
  };
  
  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Login Required
              </CardTitle>
              <CardDescription>
                Please login to view your enrolled talks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You need to be logged in to see the talks you've enrolled in.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/login">Login Now</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary to-blue-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            My Enrolled Talks
          </h1>
          <p className="text-white/80">
            Manage and access all talks you're enrolled in
          </p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Your Talks</h2>
              <p className="text-muted-foreground">
                {enrolledTalks.length} {enrolledTalks.length === 1 ? 'talk' : 'talks'} enrolled
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/talks">
                Browse More Talks <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>
          
          {enrolledTalks.length === 0 ? (
            <Card className="max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>No Enrolled Talks</CardTitle>
                <CardDescription>
                  You haven't enrolled in any talks yet
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Explore available talks and enroll to start learning!
                </p>
                <Button asChild>
                  <Link to="/talks">Browse Talks</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6">
              {enrolledTalks.map((talk) => (
                <Card key={talk.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <CardTitle className="text-xl">{talk.title}</CardTitle>
                        <CardDescription className="mt-1">
                          by {talk.instructorName}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{talk.category}</Badge>
                        <Badge variant={
                          talk.difficulty === "Beginner" ? "default" :
                          talk.difficulty === "Intermediate" ? "secondary" : "destructive"
                        }>
                          {talk.difficulty}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-muted-foreground line-clamp-2">
                        {talk.description}
                      </p>
                      
                      {/* Talk Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Date</p>
                            <p className="text-muted-foreground">{talk.talkDate}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Time</p>
                            <p className="text-muted-foreground">{talk.startTime}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Duration</p>
                            <p className="text-muted-foreground">{talk.duration}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Enrolled</p>
                            <p className="text-muted-foreground">
                              {talk.currentEnrollments}/{talk.maxEnrollments}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Tags */}
                      {talk.tags && talk.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {talk.tags.slice(0, 3).map((tag, index) => (
                            <Badge key={index} variant="secondary">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t">
                        <Button variant="outline" asChild>
                          <Link to={`/talks/${talk.id}`}>
                            <BookOpen className="w-4 h-4 mr-2" />
                            View Details
                          </Link>
                        </Button>
                        
                        {talk.meetingLink && (
                          <Button variant="default" asChild>
                            <a href={talk.meetingLink} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Join Meeting
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleUnenroll(talk.id)}
                        >
                          Unenroll
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default MyTalks;