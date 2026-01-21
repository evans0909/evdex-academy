import { auth, db } from "../firebase";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  getDocs 
} from "firebase/firestore";

export interface UserData {
  id?: string; // Add this line - make it optional
  uid: string;
  email: string;
  displayName?: string;
  role: "admin" | "user" | "moderator";
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  isActive: boolean;
}

export const createUserDocument = async (user: any): Promise<void> => {
  if (!user) return;
  
  const userRef = doc(db, "users", user.uid);
  const userSnap = await getDoc(userRef);
  
  if (!userSnap.exists()) {
    const userData: UserData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || user.email?.split('@')[0],
      role: "user",
      emailVerified: user.emailVerified || false,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true
    };
    
    await setDoc(userRef, userData);
    console.log("User document created:", user.uid);
  }
};

export const getUserData = async (userId: string): Promise<UserData | null> => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const data = userSnap.data();
      return {
        id: userSnap.id,
        ...data
      } as UserData;
    }
    return null;
  } catch (error) {
    console.error("Error getting user data:", error);
    return null;
  }
};

export const updateUserRole = async (userId: string, role: "admin" | "user" | "moderator"): Promise<boolean> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { 
      role,
      updatedAt: new Date() 
    });
    return true;
  } catch (error) {
    console.error("Error updating user role:", error);
    return false;
  }
};

export const getAllUsers = async (): Promise<UserData[]> => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);
    
    const users: UserData[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      users.push({ 
        id: doc.id,
        ...data
      } as UserData);
    });
    
    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
};

export const updateLastLogin = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, { 
      lastLogin: new Date(),
      updatedAt: new Date()
    });
  } catch (error) {
    console.error("Error updating last login:", error);
  }
};

// Check if user has permission
export const hasPermission = async (userId: string, permission: string): Promise<boolean> => {
  try {
    const userData = await getUserData(userId);
    if (!userData) return false;
    
    if (userData.role === "admin") return true;
    if (userData.role === "moderator" && permission.startsWith("moderate:")) return true;
    
    return false;
  } catch (error) {
    console.error("Error checking permission:", error);
    return false;
  }
};
