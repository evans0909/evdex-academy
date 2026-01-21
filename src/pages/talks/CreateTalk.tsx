// src/pages/talks/CreateTalk.tsx - COMPLETE CODE
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  GraduationCap,
  Link as LinkIcon,
  BookOpen,
  AlertCircle
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { addDoc, collection } from "firebase/firestore";

const CreateTalk = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "Web Development",
    difficulty: "Beginner",
    maxEnrollments: 20,
    talkDate: "",
    startTime: "",
    duration: "2 hours",
    meetingLink: "",
    prerequisites: "",
    aboutAuthor: "",
    tags: [] as string[],
  });
  
  const [tagInput, setTagInput] = useState("");
  
  const categories = [
    "Web Development",
    "Mobile Development",
    "Data Science",
    "Cybersecurity",
    "Database",
    "DevOps",
    "Cloud Computing",
    "AI/ML",
    "Game Development",
    "Other"
  ];
  
  const difficulties = ["Beginner", "Intermediate", "Advanced"];
  const durations = ["30 min", "1 hour", "1.5 hours", "2 hours", "2.5 hours", "3 hours", "3+ hours"];
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim()) && formData.tags.length < 5) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput("");
    }
  };
  
  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please login to create a talk");
      return;
    }
    
    // Validation
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Please enter a description");
      return;
    }
    
    if (!formData.talkDate) {
      toast.error("Please select a date");
      return;
    }
    
    if (!formData.startTime) {
      toast.error("Please select a time");
      return;
    }
    
    if (formData.maxEnrollments < 1) {
      toast.error("Max attendants must be at least 1");
      return;
    }
    
    try {
      setLoading(true);
      
      const talkData = {
        ...formData,
        instructorId: user.uid,
        instructorName: user.displayName || user.email?.split('@')[0] || "Anonymous",
        currentEnrollments: 0,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const talksRef = collection(db, "talks");
      await addDoc(talksRef, talkData);
      
      toast.success("Talk created successfully!");
      navigate("/talks");
      
    } catch (error) {
      console.error("Error creating talk:", error);
      toast.error("Failed to create talk. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
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
                Please login to create a talk
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  You need to be logged in to create and share talks with the community.
                </p>
                <Button className="w-full" asChild>
                  <a href="/login">Login Now</a>
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
      <section className="bg-gradient-to-br from-primary to-green-600 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Create a New Talk
          </h1>
          <p className="text-white/80">
            Share your knowledge with the community
          </p>
        </div>
      </section>
      
      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle>Talk Information</CardTitle>
              <CardDescription>
                Fill in the details about your talk. All fields are required unless marked optional.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">Talk Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g., Introduction to React Hooks"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Describe what participants will learn..."
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    required
                  />
                </div>
                
                {/* Category & Difficulty */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleSelectChange("category", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="difficulty">Difficulty Level *</Label>
                    <Select value={formData.difficulty} onValueChange={(value) => handleSelectChange("difficulty", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {difficulties.map(diff => (
                          <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Date & Time */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="talkDate" className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Date *
                    </Label>
                    <Input
                      id="talkDate"
                      name="talkDate"
                      type="date"
                      value={formData.talkDate}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="startTime" className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Start Time *
                    </Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration *</Label>
                    <Select value={formData.duration} onValueChange={(value) => handleSelectChange("duration", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {durations.map(dur => (
                          <SelectItem key={dur} value={dur}>{dur}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Max Enrollments */}
                <div className="space-y-2">
                  <Label htmlFor="maxEnrollments" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Maximum Attendants *
                  </Label>
                  <Input
                    id="maxEnrollments"
                    name="maxEnrollments"
                    type="number"
                    min="1"
                    max="1000"
                    placeholder="20"
                    value={formData.maxEnrollments}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Maximum number of participants allowed to enroll
                  </p>
                </div>
                
                {/* Prerequisites */}
                <div className="space-y-2">
                  <Label htmlFor="prerequisites" className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Prerequisites (Optional)
                  </Label>
                  <Textarea
                    id="prerequisites"
                    name="prerequisites"
                    placeholder="What should participants know before attending?"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                {/* About Author */}
                <div className="space-y-2">
                  <Label htmlFor="aboutAuthor">About You (Optional)</Label>
                  <Textarea
                    id="aboutAuthor"
                    name="aboutAuthor"
                    placeholder="Tell participants about your background and experience..."
                    value={formData.aboutAuthor}
                    onChange={handleInputChange}
                    rows={3}
                  />
                </div>
                
                {/* Meeting Link */}
                <div className="space-y-2">
                  <Label htmlFor="meetingLink" className="flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Meeting Link *
                  </Label>
                  <Input
                    id="meetingLink"
                    name="meetingLink"
                    type="url"
                    placeholder="https://meet.google.com/xyz-abcd-efg"
                    value={formData.meetingLink}
                    onChange={handleInputChange}
                    required
                  />
                  <p className="text-sm text-muted-foreground">
                    Zoom, Google Meet, or other video conference link
                  </p>
                </div>
                
                {/* Tags */}
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Tags (Optional)
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="tags"
                      placeholder="e.g., React, JavaScript"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                    />
                    <Button type="button" onClick={handleAddTag} variant="outline">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Add up to 5 tags to help users find your talk. Press Enter or click + to add.
                  </p>
                  
                  {/* Display tags */}
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="gap-1">
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="ml-1 hover:text-destructive"
                          >
                            ×
                          </button>
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Submit Buttons */}
                <div className="flex gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/talks")}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? "Creating..." : "Create Talk"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          
          {/* Tips Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Tips for a Great Talk</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>• Be clear about prerequisites so participants know what to expect</p>
              <p>• Choose a specific, descriptive title</p>
              <p>• Add relevant tags to help users find your talk</p>
              <p>• Test your meeting link before the talk</p>
              <p>• Be available 10 minutes early to help participants join</p>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default CreateTalk;
