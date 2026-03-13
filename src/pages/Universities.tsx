// src/pages/Universities.tsx - Updated with Google Drive links for all programs
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
          logo: "/public/images/CBU.jpeg", // <-- ADD THIS LINE
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
              years: [
                {
                  year: 1,
                  description: "Foundation year for Data Science - programming, statistics, and mathematics",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1DS_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Data Science - machine learning, data visualization, and databases",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1DS_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Data Science - deep learning, big data analytics, and specialized topics",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1DS_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Data Science capstone projects and industry preparation",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1DS_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 18
            },
            {
              id: "ict",
              name: "Information Communication Technology with Education",
              description: "Focus on networking, hardware, software, and telecommunications systems.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for ICT - computer fundamentals, programming basics, and mathematics",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1ICT_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate ICT - networking, databases, web development, and operating systems",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1ICT_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced ICT - network security, system administration, and emerging technologies",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1ICT_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "ICT capstone projects and professional practice",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1ICT_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 22
            },
            {
              id: "isba",
              name: "Information Business Analytics",
              description: "Combine business intelligence with data analytics for decision making.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for ISBA - business fundamentals, programming, and statistics",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1oysw7juZwhJGnr4oJZ0lbOeCQcTs96C9?usp=sharing",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate ISBA - data analysis, business intelligence, and database management",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1oysw7juZwhJGnr4oJZ0lbOeCQcTs96C9?usp=sharing",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced ISBA - predictive analytics, data mining, and business strategy",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1ISBA_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "ISBA capstone projects and business analytics applications",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1ISBA_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 20
            },
            {
              id: "animal-science",
              name: "Animal Science",
              description: "Study animal biology, nutrition, breeding, and management.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Animal Science - biology, chemistry, and animal anatomy",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1AS_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Animal Science - nutrition, genetics, and animal physiology",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1AS_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Animal Science - breeding, health management, and production systems",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1AS_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Animal Science capstone projects and industry practice",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1AS_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 15
            },
            {
              id: "fisheries",
              name: "Fisheries & Aquaculture",
              description: "Learn fish farming, aquatic resource management, and conservation.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Fisheries - aquatic biology, chemistry, and ecology",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1FISH_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Fisheries - fish farming, water quality, and aquaculture systems",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1FISH_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Fisheries - fish health, breeding, and resource management",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1FISH_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Fisheries capstone projects and industry placement",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1FISH_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 12
            },
            {
              id: "sustainable-agriculture",
              name: "Sustainable Agriculture",
              description: "Focus on eco-friendly farming practices and food security.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Sustainable Agriculture - crop science, soil science, and ecology",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1SA_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Sustainable Agriculture - organic farming, pest management, and irrigation",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1SA_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Sustainable Agriculture - agroecology, conservation, and farming systems",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1SA_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Sustainable Agriculture capstone projects and community engagement",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1SA_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
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
          logo: "/public/images/UNZA.jpeg",
          established: 1965,
          programs: [
            {
              id: "computer-science",
              name: "Computer Science",
              description: "Comprehensive computer science program with programming, algorithms, and systems.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Computer Science - programming fundamentals, mathematics, and logic",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_CS_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Computer Science - data structures, algorithms, and software design",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_CS_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Computer Science - databases, networks, and operating systems",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_CS_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Computer Science capstone projects and specialization electives",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_CS_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 30
            },
            {
              id: "medicine",
              name: "Medicine",
              description: "Medical doctor training program with clinical rotations.",
              years: [
                {
                  year: 1,
                  description: "Pre-clinical year 1 - anatomy, physiology, and biochemistry",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_MED_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Pre-clinical year 2 - pathology, pharmacology, and microbiology",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_MED_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Clinical year 1 - internal medicine, pediatrics, and surgery fundamentals",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_MED_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Clinical year 2 - obstetrics, gynecology, and specialized rotations",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_MED_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 5,
                  description: "Clinical year 3 - advanced rotations, electives, and internship preparation",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1UNZA_MED_Y5_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
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
          logo: "/public/images/KMU.jpeg",
          established: 1987,
          programs: [
            {
              id: "mining-engineering",
              name: "Mining Engineering",
              description: "Specialized engineering for mineral extraction and processing.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Mining Engineering - engineering fundamentals, mathematics, and geology",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_MIN_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Mining Engineering - rock mechanics, mine ventilation, and surveying",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_MIN_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Mining Engineering - mineral processing, mine design, and safety",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_MIN_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Mining Engineering capstone projects and industry practice",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_MIN_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 28
            },
            {
              id: "business-administration",
              name: "Business Administration",
              description: "Management, finance, marketing, and entrepreneurship studies.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Business Administration - management principles, economics, and accounting",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_BA_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Business Administration - marketing, finance, and organizational behavior",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_BA_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Business Administration - strategic management, entrepreneurship, and international business",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_BA_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Business Administration capstone projects and business plan development",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1CBU_BA_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
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
          logo: "/public/images/MU.jpeg",
          established: 2008,
          programs: [
            {
              id: "education",
              name: "Education",
              description: "Teacher training and educational sciences program.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Education - educational psychology, philosophy, and teaching methods",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ED_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Education - curriculum development, assessment, and classroom management",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ED_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Education - special education, educational technology, and research methods",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ED_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Education teaching practice and capstone projects",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ED_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
              totalMaterials: 20
            },
            {
              id: "accountancy",
              name: "Accountancy",
              description: "Financial accounting, auditing, and taxation studies.",
              years: [
                {
                  year: 1,
                  description: "Foundation year for Accountancy - financial accounting, business math, and economics",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ACC_Y1_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 2,
                  description: "Intermediate Accountancy - management accounting, auditing, and corporate law",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ACC_Y2_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 3,
                  description: "Advanced Accountancy - taxation, financial reporting, and advanced auditing",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ACC_Y3_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                },
                {
                  year: 4,
                  description: "Accountancy capstone projects and professional practice",
                  googleDriveFolderLink: "https://drive.google.com/drive/folders/1MU_ACC_Y4_PLACEHOLDER",
                  courses: [],
                  studyMaterials: [],
                  pastPapers: []
                }
              ],
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
      
      {/* Hero Section - Zambian Flag Theme */}
<section className="relative py-20 overflow-hidden">
  {/* Zambian Flag Background Stripes */}
  <div className="absolute inset-0">
    {/* Green stripe (top) - representing agriculture */}
    <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-r from-green-700 to-green-500"></div>
    {/* Red stripe (middle) - representing the struggle for freedom */}
    <div className="absolute top-1/3 left-0 w-full h-1/3 bg-gradient-to-r from-red-600 to-red-400"></div>
    {/* Black stripe (bottom) - representing the people */}
    <div className="absolute top-2/3 left-0 w-full h-1/3 bg-gradient-to-r from-black to-gray-800"></div>
    
    {/* Orange Eagle (overlay) - representing freedom */}
    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 mix-blend-overlay"></div>
    
    {/* Eagle pattern overlay */}
    <div className="absolute inset-0 opacity-10">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path d="M50,10 L60,40 L90,40 L65,55 L75,85 L50,65 L25,85 L35,55 L10,40 L40,40 Z" 
              fill="orange" className="animate-pulse-slow"/>
      </svg>
    </div>
  </div>

  {/* Content */}
  <div className="container relative mx-auto px-4 py-16">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="max-w-3xl mx-auto text-center"
    >
      {/* Decorative Zambian Pattern */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="flex justify-center gap-1 mb-6"
      >
        {['bg-green-600', 'bg-red-600', 'bg-black', 'bg-orange-500'].map((color, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${color} shadow-lg`} />
        ))}
      </motion.div>

      {/* Main Title with Decorative Styling */}
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
        <span className="inline-block transform hover:scale-105 transition-transform">
          <span className="text-green-600 drop-shadow-lg">Z</span>
          <span className="text-red-600 drop-shadow-lg">a</span>
          <span className="text-black drop-shadow-lg">m</span>
          <span className="text-orange-500 drop-shadow-lg">b</span>
          <span className="text-green-600 drop-shadow-lg">i</span>
          <span className="text-red-600 drop-shadow-lg">a</span>
          <span className="text-black drop-shadow-lg">n</span>
        </span>{" "}
        <span className="relative">
          <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-green-600 via-red-600 to-black font-extrabold">
            Universities
          </span>
          {/* Decorative underline */}
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="absolute -bottom-2 left-0 h-1 bg-gradient-to-r from-green-600 via-red-600 to-orange-500 rounded-full"
          />
        </span>
      </h1>

      {/* Decorative Eagle Divider */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-24 h-1 mx-auto mb-6 bg-gradient-to-r from-green-600 via-red-600 to-black rounded-full"
      />

      <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-8 font-medium">
        Access comprehensive study materials, past papers, and course resources from top universities in Zambia.
      </p>

      {/* Stats with Zambian Flag Colors */}
      <div className="flex flex-wrap justify-center gap-3 mb-8">
        <Badge variant="secondary" className="bg-green-100 text-green-800 border-2 border-green-600 shadow-md">
          <Database className="w-3 h-3 mr-1" />
          {universities.reduce((acc, uni) => acc + uni.programs.length, 0)} Programs
        </Badge>
        <Badge variant="secondary" className="bg-red-100 text-red-800 border-2 border-red-600 shadow-md">
          <Users className="w-3 h-3 mr-1" />
          10,000+ Materials
        </Badge>
        <Badge variant="secondary" className="bg-black text-white border-2 border-orange-500 shadow-md">
          <Calendar className="w-3 h-3 mr-1" />
          Updated Weekly
        </Badge>
      </div>

      {/* Zambian Flag Mini Representation */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="flex justify-center items-center gap-1 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full inline-flex mx-auto shadow-lg"
      >
        <div className="w-6 h-6 rounded-full bg-green-600"></div>
        <div className="w-6 h-6 rounded-full bg-red-600"></div>
        <div className="w-6 h-6 rounded-full bg-black"></div>
        <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">
          🇿🇲
        </div>
      </motion.div>
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
                      {uni.logo ? (
                        <img 
                          src={uni.logo} 
                          alt={`${uni.name} logo`}
                          className="w-16 h-16 rounded-xl object-contain bg-white p-2 shadow-lg"
                          onError={(e) => {
                          // Fallback if image fails to load
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.parentElement?.classList.add('bg-gradient-to-br', uni.color);
                       }}
                     />
                  ) : (
                    <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${uni.color} flex items-center justify-center shadow-lg`}>
                     <Building className="w-8 h-8 text-white" />
                  </div>
                )}
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