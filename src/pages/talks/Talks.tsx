// src/pages/talks/Talks.tsx - Updated with Grid Layout
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Calendar, Clock, User, Plus, Code2 } from "lucide-react";
import { db } from "@/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

interface Talk {
  id: string;
  title: string;
  description?: string;
  instructorName: string;
  category?: string;
  difficulty: string;
  language?: string;
  talkDate: string;
  startTime: string;
  tags?: string[];
}

const Talks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [talks, setTalks] = useState<Talk[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [difficulty, setDifficulty] = useState("");
  const [language, setLanguage] = useState("");
  const [area, setArea] = useState("");
  const [tool, setTool] = useState("");
  const [date, setDate] = useState("");
  const [maxPeople, setMaxPeople] = useState("");

  useEffect(() => {
    fetchTalks();
  }, []);

  const fetchTalks = async () => {
    try {
      setLoading(true);
      const talksRef = collection(db, "talks");
      const q = query(talksRef, orderBy("talkDate", "desc"));
      const snapshot = await getDocs(q);
      
      const talksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Talk[];
      
      setTalks(talksList);
    } catch (error) {
      console.error("Error fetching talks:", error);
      // Sample data for development
      setTalks([
        {
          id: "1",
          title: "Introduction to Flutter",
          instructorName: "Vancie",
          difficulty: "Beginner",
          language: "English",
          talkDate: "2026-03-11",
          startTime: "11:58"
        },
        {
          id: "2",
          title: "Testing",
          instructorName: "Vancie",
          difficulty: "Intermediate",
          language: "English",
          talkDate: "2026-02-06",
          startTime: "18:13"
        },
        {
          id: "3",
          title: "Introduction to Microsoft Access",
          instructorName: "Vancie",
          difficulty: "Beginner",
          language: "English",
          talkDate: "2026-01-20",
          startTime: "23:00"
        },
        {
          id: "4",
          title: "SQL Fundamentals",
          instructorName: "EvansDevancieBwalya",
          difficulty: "Beginner",
          language: "Bemba",
          talkDate: "2025-04-20",
          startTime: "17:00"
        },
        {
          id: "5",
          title: "Introduction to web design with python",
          instructorName: "EvansDevancieBwalya",
          difficulty: "Intermediate",
          language: "English",
          talkDate: "2025-06-10",
          startTime: "15:31"
        },
        {
          id: "6",
          title: "R Programming",
          instructorName: "MwapeGeorge",
          difficulty: "Advanced",
          language: "English",
          talkDate: "2025-07-02",
          startTime: "01:01"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Filter talks based on all criteria
  const filteredTalks = talks.filter(talk => {
    const matchesSearch = searchQuery === "" || 
      talk.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talk.instructorName?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDifficulty = !difficulty || difficulty === "all" || talk.difficulty === difficulty;
    const matchesLanguage = !language || language === "all" || talk.language === language;
    
    return matchesSearch && matchesDifficulty && matchesLanguage;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Beginner": return "bg-green-100 text-green-800";
      case "Intermediate": return "bg-yellow-100 text-yellow-800";
      case "Advanced": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">ALL TALKS</h1>
          <Button asChild>
            <Link to="/talks/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Talk
            </Link>
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            placeholder="What do you want to learn?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-12 text-lg"
          />
        </div>

        {/* Filters Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          <Select value={difficulty} onValueChange={setDifficulty}>
            <SelectTrigger>
              <SelectValue placeholder="Difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="Beginner">Beginner</SelectItem>
              <SelectItem value="Intermediate">Intermediate</SelectItem>
              <SelectItem value="Advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Bemba">Bemba</SelectItem>
              <SelectItem value="Nyanja">Nyanja</SelectItem>
            </SelectContent>
          </Select>

          <Select value={area} onValueChange={setArea}>
            <SelectTrigger>
              <SelectValue placeholder="Area" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Areas</SelectItem>
              <SelectItem value="Frontend">Frontend</SelectItem>
              <SelectItem value="Backend">Backend</SelectItem>
              <SelectItem value="Database">Database</SelectItem>
            </SelectContent>
          </Select>

          <Select value={tool} onValueChange={setTool}>
            <SelectTrigger>
              <SelectValue placeholder="Tool" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Tools</SelectItem>
              <SelectItem value="React">React</SelectItem>
              <SelectItem value="Python">Python</SelectItem>
              <SelectItem value="Flutter">Flutter</SelectItem>
            </SelectContent>
          </Select>

          <Select value={date} onValueChange={setDate}>
            <SelectTrigger>
              <SelectValue placeholder="Date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
            </SelectContent>
          </Select>

          <Select value={maxPeople} onValueChange={setMaxPeople}>
            <SelectTrigger>
              <SelectValue placeholder="Max people" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any</SelectItem>
              <SelectItem value="10">Up to 10</SelectItem>
              <SelectItem value="25">Up to 25</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Talks Grid */}
        {loading ? (
          <div className="text-center py-12">Loading talks...</div>
        ) : filteredTalks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No talks found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTalks.map((talk) => (
              <Link to={`/talks/${talk.id}`} key={talk.id}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-semibold mb-4 line-clamp-2">
                      {talk.title}
                    </h3>
                    
                    {/* Date, Time, Instructor */}
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{talk.talkDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>{talk.startTime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{talk.instructorName}</span>
                      </div>
                    </div>
                    
                    {/* Difficulty Badge */}
                    <div className="mb-3">
                      <Badge className={`${getDifficultyColor(talk.difficulty)} border-0`}>
                        {talk.difficulty}
                      </Badge>
                    </div>
                    
                    {/* Language (if available) */}
                    {talk.language && (
                      <p className="text-sm text-gray-500">
                        Language: {talk.language}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Talks;