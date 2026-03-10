import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ChevronDown, 
  ChevronRight,
  GraduationCap,
  BookOpen,
  FileText,
  Download,
  ExternalLink,
  Lock,
  Folder,
  Users,
  Calendar,
  Building,
  Globe,
  Database
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/firebase";
import { collection, getDocs, doc, getDoc, updateDoc, increment } from "firebase/firestore";
import { toast } from "sonner";
import { University, UniversityProgram, YearContent } from "@/types/university";

const Universities = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUni, setExpandedUni] = useState<string | null>(null);
  const [expandedProgram, setExpandedProgram] = useState<string | null>(null);
  const [expandedYear, setExpandedYear] = useState<string | null>(null);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [authDialogOpen, setAuthDialogOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      fetchUniversities();
    }
  }, [authLoading]);

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      
      // For now, use mock data. In production, fetch from Firestore
      const mockData: University[] = [
        {
          id: "kmu",
          name: "Kapasa Makasa University",
          shortName: "KMU",
          location: "Chinsali",
          website: "https://kmu.ac.zm",
          color: "from-purple-500 to-pink-600",
          established: 2018,
          programs: [
            {
              id: "cyber-security",
              name: "Cyber Security",
              description: "Learn to protect digital systems from cyber threats, including network security, cryptography, and ethical hacking.",
              years: [
                {
                  year: 1,
                  description: "Foundation year covering computing basics and introductory security concepts",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MJ6TWZr3W4MLAoikPNsPiiXUiS3K9IVx",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate security concepts and practical implementation",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1SKXdWHMJCS3QnGjTKTfYRKZo1BcuVfon",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced security topics and specialization",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1RCPBZnX83RepYokxLvPwlrwGRs67sbAJ",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Capstone projects and professional preparation",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1p3uA6uK5qCSwep45eEu-NKqKHAWWHAlE?usp=sharing",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 25,
              coordinator: "Dr. John Banda"
            },
            {
              id: "data-science",
              name: "Data Science",
              description: "Learn data analysis, machine learning, and statistical modeling techniques.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Data Science curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 18
            },
            {
              id: "ict",
              name: "Information Communication Technology with Education",
              description: "Focus on networking, hardware, software, and telecommunications systems.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} ICT curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 22
            },
            {
              id: "isba",
              name: "Information Business Analytics",
              description: "Combine business intelligence with data analytics for decision making.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} ISBA curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 20
            },
            {
              id: "animal-science",
              name: "Animal Science",
              description: "Study animal biology, nutrition, breeding, and management.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Animal Science curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 15
            },
            {
              id: "fisheries",
              name: "Fisheries & Aquaculture",
              description: "Learn fish farming, aquatic resource management, and conservation.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Fisheries & Aquaculture curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 12
            },
            {
              id: "sustainable-agriculture",
              name: "Sustainable Agriculture",
              description: "Focus on eco-friendly farming practices and food security.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Sustainable Agriculture curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 14
            }
          ]
        },
        {
          id: "unza",
          name: "University of Zambia",
          shortName: "UNZA",
          location: "Lusaka",
          website: "https://www.unza.zm",
          color: "from-blue-500 to-cyan-600",
          established: 1965,
          programs: [
            {
              id: "computer-science",
              name: "Computer Science",
              description: "Comprehensive computer science program with programming, algorithms, and systems.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Computer Science curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 30
            },
            {
              id: "medicine",
              name: "Medicine",
              description: "Medical doctor training program with clinical rotations.",
              years: Array.from({ length: 5 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Medicine curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 35
            }
          ]
        },
        {
          id: "cbu",
          name: "Copperbelt University",
          shortName: "CBU",
          location: "Kitwe",
          website: "https://www.cbu.ac.zm",
          color: "from-green-500 to-emerald-600",
          established: 1987,
          programs: [
            {
              id: "mining-engineering",
              name: "Mining Engineering",
              description: "Specialized engineering for mineral extraction and processing.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Mining Engineering curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 28
            },
            {
              id: "business-administration",
              name: "Business Administration",
              description: "Management, finance, marketing, and entrepreneurship studies.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Business Administration curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 25
            }
          ]
        },
        {
          id: "mu",
          name: "Mulungushi University",
          shortName: "MU",
          location: "Kabwe",
          website: "https://www.mu.ac.zm",
          color: "from-orange-500 to-red-600",
          established: 2008,
          programs: [
            {
              id: "education",
              name: "Education",
              description: "Teacher training and educational sciences program.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Education curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 20
            },
            {
              id: "accountancy",
              name: "Accountancy",
              description: "Financial accounting, auditing, and taxation studies.",
              years: Array.from({ length: 4 }, (_, i) => ({
                year: i + 1,
                description: `Year ${i + 1} Accountancy curriculum`,
                courses: [],
                studyMaterials: [],
                pastPapers: []
              })),
              totalMaterials: 22
            }
          ]
        }
      ];

      setUniversities(mockData);
      
    } catch (error) {
      console.error("Error fetching universities:", error);
      toast.error("Failed to load university data");
    } finally {
      setLoading(false);
    }
  };

  const handleMaterialClick = async (material: any) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }

    setSelectedMaterial(material);
    
    try {
      toast.success("Opening Google Drive link...");
      window.open(material.googleDriveLink, '_blank');
    } catch (error) {
      console.error("Error:", error);
      window.open(material.googleDriveLink, '_blank');
    }
  };

  const handleFolderClick = (folderLink: string) => {
    if (!user) {
      setAuthDialogOpen(true);
      return;
    }
    
    window.open(folderLink, '_blank');
  };

  const AuthRequiredDialog = () => (
    <Dialog open={authDialogOpen} onOpenChange={setAuthDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Authentication Required
          </DialogTitle>
          <DialogDescription>
            You need to be logged in to access study materials and past papers.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Join our community to access materials from all Zambian universities.
          </p>
          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => window.location.href = "/login"}>
              Login
            </Button>
            <Button variant="outline" className="flex-1" onClick={() => window.location.href = "/register"}>
              Register
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader>
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-24 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <AuthRequiredDialog />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-purple-600 py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.02] bg-grid" />
        <div className="container relative mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
              Zambian Universities
            </h1>
            <p className="text-lg md:text-xl text-white/80 mb-8">
              Access comprehensive study materials, past papers, and course resources from top universities in Zambia.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Database className="w-3 h-3 mr-1" />
                {universities.reduce((acc, uni) => acc + uni.programs.length, 0)} Programs
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Users className="w-3 h-3 mr-1" />
                10,000+ Materials
              </Badge>
              <Badge variant="secondary" className="bg-white/20 text-white">
                <Calendar className="w-3 h-3 mr-1" />
                Updated Weekly
              </Badge>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Universities List */}
      <section className="py-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">Available Universities</h2>
            <p className="text-muted-foreground">
              Select a university to explore programs and access study materials
            </p>
          </div>

          <div className="grid gap-6">
            <AnimatePresence>
              {universities.map((uni) => (
                <motion.div
                  key={uni.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="rounded-2xl border border-border overflow-hidden bg-card shadow-lg"
                >
                  {/* University Header */}
                  <button
                    onClick={() => setExpandedUni(expandedUni === uni.id ? null : uni.id)}
                    className="w-full flex items-center justify-between p-6 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${uni.color} flex items-center justify-center shadow-lg`}>
                        <Building className="w-8 h-8 text-white" />
                      </div>
                      <div className="text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-xl font-bold text-foreground">
                            {uni.name}
                          </h3>
                          <Badge variant="outline" className="bg-primary/10 text-primary">
                            {uni.shortName}
                          </Badge>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="w-3 h-3" />
                            {uni.location}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {uni.programs.length} Programs
                          </span>
                          {uni.established && (
                            <>
                              <span>•</span>
                              <span>Est. {uni.established}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedUni === uni.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* University Details */}
                  <AnimatePresence>
                    {expandedUni === uni.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="border-t border-border"
                      >
                        <div className="p-6">
                          {/* University Info */}
                          <div className="mb-6 p-4 bg-muted/30 rounded-lg">
                            <div className="flex flex-wrap gap-4 mb-3">
                              {uni.website && (
                                <a
                                  href={uni.website}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                                >
                                  <Globe className="w-3 h-3" />
                                  Official Website
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Programs */}
                          <div className="space-y-4">
                            <h4 className="text-lg font-semibold">Available Programs</h4>
                            {uni.programs.map((program) => (
                              <div key={program.id} className="border border-border rounded-lg overflow-hidden">
                                <button
                                  onClick={() =>
                                    setExpandedProgram(
                                      expandedProgram === `${uni.id}-${program.id}`
                                        ? null
                                        : `${uni.id}-${program.id}`
                                    )
                                  }
                                  className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                                >
                                  <div className="text-left">
                                    <div className="flex items-center gap-2 mb-1">
                                      <h5 className="font-semibold text-foreground">{program.name}</h5>
                                      <Badge variant="outline">
                                        {program.totalMaterials} Materials
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">{program.description}</p>
                                  </div>
                                  <ChevronRight
                                    className={`w-5 h-5 text-muted-foreground transition-transform ${
                                      expandedProgram === `${uni.id}-${program.id}` ? "rotate-90" : ""
                                    }`}
                                  />
                                </button>

                                {/* Years */}
                                <AnimatePresence>
                                  {expandedProgram === `${uni.id}-${program.id}` && (
                                    <motion.div
                                      initial={{ opacity: 0, height: 0 }}
                                      animate={{ opacity: 1, height: "auto" }}
                                      exit={{ opacity: 0, height: 0 }}
                                      className="border-t border-border"
                                    >
                                      <div className="p-4 bg-background">
                                        <div className="grid gap-3">
                                          {program.years.map((yearData) => (
                                            <div key={yearData.year} className="border border-border rounded-lg">
                                              <button
                                                onClick={() =>
                                                  setExpandedYear(
                                                    expandedYear === `${uni.id}-${program.id}-${yearData.year}`
                                                      ? null
                                                      : `${uni.id}-${program.id}-${yearData.year}`
                                                  )
                                                }
                                                className="w-full flex items-center justify-between p-3 hover:bg-muted/30 transition-colors"
                                              >
                                                <div className="text-left">
                                                  <h6 className="font-medium text-foreground">
                                                    Year {yearData.year}
                                                  </h6>
                                                  <p className="text-xs text-muted-foreground">
                                                    {yearData.description}
                                                  </p>
                                                </div>
                                                <ChevronRight
                                                  className={`w-4 h-4 text-muted-foreground transition-transform ${
                                                    expandedYear === `${uni.id}-${program.id}-${yearData.year}`
                                                      ? "rotate-90"
                                                      : ""
                                                  }`}
                                                />
                                              </button>

                                              {/* Year Content */}
                                              <AnimatePresence>
                                                {expandedYear === `${uni.id}-${program.id}-${yearData.year}` && (
                                                  <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="border-t border-border p-4 space-y-4"
                                                  >
                                                    {/* Google Drive Folder Link */}
                                                    {yearData.googleDriveFolderLink && (
                                                      <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-lg">
                                                        <div className="flex items-center justify-between">
                                                          <div>
                                                            <h6 className="font-medium text-foreground flex items-center gap-2">
                                                              <Folder className="w-4 h-4 text-purple-600" />
                                                              Complete Year {yearData.year} Materials
                                                            </h6>
                                                            <p className="text-sm text-muted-foreground">
                                                              Access all courses and materials for Year {yearData.year}
                                                            </p>
                                                          </div>
                                                          <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleFolderClick(yearData.googleDriveFolderLink!)}
                                                            disabled={!user}
                                                            className="gap-2"
                                                          >
                                                            {user ? (
                                                              <>
                                                                <ExternalLink className="w-4 h-4" />
                                                                Open Drive Folder
                                                              </>
                                                            ) : (
                                                              <>
                                                                <Lock className="w-4 h-4" />
                                                                Login Required
                                                              </>
                                                            )}
                                                          </Button>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </motion.div>
                                                )}
                                              </AnimatePresence>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Stats Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5" />
                  Universities
                </CardTitle>
                <CardDescription>Partner institutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{universities.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Programs
                </CardTitle>
                <CardDescription>Available courses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {universities.reduce((acc, uni) => acc + uni.programs.length, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Materials
                </CardTitle>
                <CardDescription>Study resources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">10,000+</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Universities;