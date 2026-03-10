// src/pages/Materials.tsx
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { Download, Upload, FileText, Loader2 } from "lucide-react";

// GitHub configuration - using environment variables
const GITHUB_USERNAME = import.meta.env.VITE_GITHUB_USERNAME || "evans0909";
const GITHUB_REPO = import.meta.env.VITE_GITHUB_REPO || "evdex-materials";
const GITHUB_BRANCH = "main";
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

interface Material {
  name: string;
  path: string;
  size: number;
  downloadUrl: string;
  sha?: string;
}

const Materials = () => {
  const { user } = useAuth();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  const isAdmin = user?.email === "bwalyaevans09@gmail.com";

  // Fetch materials from GitHub via jsDelivr
  useEffect(() => {
    fetchMaterials();
  }, []);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      
      // Using GitHub API to list files in the materials folder
      const response = await fetch(
        `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/materials`,
        {
          headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          // Materials folder doesn't exist yet
          setMaterials([]);
          return;
        }
        throw new Error('Failed to fetch materials');
      }

      const files = await response.json();
      
      // Transform GitHub data to our Material format
      const materialsList = files.map((file: any) => ({
        name: file.name,
        path: file.path,
        size: file.size,
        sha: file.sha,
        downloadUrl: `https://cdn.jsdelivr.net/gh/${GITHUB_USERNAME}/${GITHUB_REPO}@${GITHUB_BRANCH}/${file.path}`
      }));

      setMaterials(materialsList);
    } catch (error) {
      console.error("Error fetching materials:", error);
      toast.error("Failed to load materials");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error("Please select a file");
      return;
    }
    
    if (!isAdmin) {
      toast.error("Only admins can upload");
      return;
    }

    setUploading(true);
    
    try {
      const reader = new FileReader();
      reader.readAsDataURL(selectedFile);
      
      reader.onload = async () => {
        try {
          const base64Content = reader.result?.toString().split(',')[1];
          const path = `materials/${selectedFile.name}`;
          
          // First, check if file already exists to get SHA
          let sha = null;
          const checkResponse = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${path}`,
            {
              headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
              }
            }
          );
          
          if (checkResponse.ok) {
            const existingFile = await checkResponse.json();
            sha = existingFile.sha;
          }
          
          // Prepare upload payload
          const uploadPayload: any = {
            message: sha ? `Update ${selectedFile.name}` : `Upload ${selectedFile.name}`,
            content: base64Content,
            branch: GITHUB_BRANCH
          };
          
          // Add SHA if updating existing file
          if (sha) {
            uploadPayload.sha = sha;
          }
          
          const response = await fetch(
            `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${path}`,
            {
              method: 'PUT',
              headers: {
                'Authorization': `token ${GITHUB_TOKEN}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(uploadPayload)
            }
          );

          if (response.ok) {
            toast.success(sha ? "File updated successfully!" : "File uploaded successfully!");
            setSelectedFile(null);
            
            // Reset file input
            const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
            if (fileInput) fileInput.value = '';
            
            // Wait 2 seconds for GitHub to process, then refresh
            setTimeout(() => {
              fetchMaterials();
            }, 2000);
          } else {
            const error = await response.json();
            throw new Error(error.message || `Upload failed with status ${response.status}`);
          }
        } catch (error: any) {
          console.error("Upload error details:", error);
          toast.error(error.message || "Failed to upload file");
        } finally {
          setUploading(false);
        }
      };

      reader.onerror = () => {
        console.error("FileReader error");
        toast.error("Failed to read file");
        setUploading(false);
      };
      
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload file");
      setUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  // Don't show content to non-logged-in users
  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Login Required</h1>
          <p className="text-muted-foreground mb-8">Please login to access IT Society materials</p>
          <Button asChild>
            <a href="/login">Login Now</a>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">IT Society Materials</h1>
            <p className="text-muted-foreground mt-2">
              {materials.length} resources available • 
            </p>
          </div>
        </div>

        {/* Admin Upload Section */}
        {isAdmin && (
          <Card className="mb-8 border-2 border-dashed border-blue-300 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Upload className="w-5 h-5" />
                Admin Upload
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <Input
                  type="file"
                  onChange={handleFileSelect}
                  className="flex-1 bg-white"
                  disabled={uploading}
                />
                <Button 
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="min-w-[120px]"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload
                    </>
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Files are uploaded to storage. They'll appear within 2 seconds.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Materials Grid */}
        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
            <p>Loading materials...</p>
          </div>
        ) : materials.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No materials yet</h3>
              <p className="text-muted-foreground">
                {isAdmin ? "Upload the first material using the form above!" : "Check back later for materials."}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {materials.map((material) => (
              <Card key={material.path} className="hover:shadow-lg transition-shadow group">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <FileText className="w-8 h-8 text-blue-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate" title={material.name}>
                        {material.name}
                      </p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {formatFileSize(material.size)}
                      </p>
                      <Button 
                        className="w-full gap-2"
                        onClick={() => {
                          window.open(material.downloadUrl, '_blank');
                          toast.success(`Opening ${material.name}`);
                        }}
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Info Card */}
        <Card className="mt-8 bg-muted/50">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>📥 How it works:</strong> {isAdmin ? "You can upload files using the admin panel above." : ""}
            </p>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Materials;