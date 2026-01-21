// src/pages/talks/Talks.tsx - WITH FIRESTORE
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { Search, Plus, Clock, Users, Star } from "lucide-react";
import { db } from "@/firebase"; // Make sure this exists
import { collection, getDocs } from "firebase/firestore";

const Talks = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [talks, setTalks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTalks();
  }, []);

  const fetchTalks = async () => {
    try {
      setLoading(true);
      const talksRef = collection(db, "talks");
      const snapshot = await getDocs(talksRef);
      
      const talksList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setTalks(talksList);
    } catch (error) {
      console.error("Error fetching talks:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero - same as before */}
      
      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {loading ? "Loading..." : `Showing ${talks.length} talks`}
            </div>
            <Button asChild>
              <Link to="/talks/new">
                <Plus className="w-4 h-4 mr-2" />
                Create Talk
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12">Loading talks...</div>
          ) : talks.length === 0 ? (
            <div className="text-center py-12">
              <p>No talks yet. Be the first to create one!</p>
              <Button className="mt-4" asChild>
                <Link to="/talks/new">Create First Talk</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-6">
              {talks.map((talk) => (
                <div key={talk.id} className="border rounded-lg p-4">
                  <h3 className="font-bold text-lg">{talk.title}</h3>
                  <p className="text-gray-600">{talk.description}</p>
                  <div className="mt-2 flex items-center gap-4 text-sm">
                    <span>👤 {talk.instructorName}</span>
                    <span>📅 {talk.talkDate}</span>
                    <span>⏰ {talk.duration}</span>
                  </div>
                  <Button className="mt-4" asChild>
                    <Link to={`/talks/${talk.id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Talks;