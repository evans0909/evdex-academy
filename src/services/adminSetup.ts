// src/services/adminSetup.ts
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

export const setupInitialAdmin = async (adminEmail: string) => {
  try {
    // Create admin emails collection structure
    const adminEmailRef = doc(db, "_config", "adminEmails", adminEmail);
    await setDoc(adminEmailRef, {
      addedAt: new Date(),
      addedBy: "system",
      isInitialAdmin: true
    });
    
    console.log(`Initial admin ${adminEmail} added successfully`);
    return true;
  } catch (error) {
    console.error("Error setting up initial admin:", error);
    return false;
  }
};