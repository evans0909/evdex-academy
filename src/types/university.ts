export interface CourseMaterial {
  id: string;
  name: string;
  type: "notes" | "pastpaper" | "slides" | "assignment" | "project";
  googleDriveLink: string;
  downloadCount: number;
  fileSize?: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface YearContent {
  year: number;
  description: string;
  studyMaterials: CourseMaterial[];
  pastPapers: CourseMaterial[];
  googleDriveFolderLink?: string; // Main Google Drive folder for all courses
  courses: {
    name: string;
    materials: CourseMaterial[];
    googleDriveFolderLink?: string;
  }[];
}

export interface UniversityProgram {
  id: string;
  name: string;
  description: string;
  years: YearContent[];
  totalMaterials: number;
  coordinator?: string;
}

export interface University {
  id: string;
  name: string;
  shortName: string;
  location: string;
  website?: string;
  logo?: string;
  color: string;
  programs: UniversityProgram[];
  totalStudents?: number;
  established?: number;
}
