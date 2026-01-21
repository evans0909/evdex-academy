
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export const initializeFirestore = async () => {
  try {
    // Create initial admin user document (for testing)
    const adminUserId = "initial-admin"; // Or use your actual user ID
    
    const adminUserRef = doc(db, "users", adminUserId);
    await setDoc(adminUserRef, {
      uid: adminUserId,
      email: "bwalyaevans09@gmail.com",
      displayName: "Admin User",
      role: "admin",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: true,
      lastLogin: new Date()
    });
    
    console.log("Firestore initialized with admin user");
    return true;
  } catch (error) {
    console.error("Error initializing Firestore:", error);
    return false;
  }
};

// Run this in browser console to initialize
// import('./utils/initFirestore').then(mod => mod.initializeFirestore())
