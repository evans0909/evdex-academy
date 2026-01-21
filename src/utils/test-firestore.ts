// src/utils/test-firestore.ts
import { db } from "../firebase";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { toast } from "sonner";

export const testFirestoreConnection = async () => {
  try {
    console.log("Testing Firestore connection...");
    
    // Test read operation
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    console.log(`Found ${snapshot.size} user(s) in Firestore`);
    
    snapshot.forEach((doc) => {
      console.log("User:", doc.id, "=>", doc.data());
    });
    
    // Test write operation (optional)
    if (snapshot.size === 0) {
      console.log("No users found, attempting to create test user...");
      await addDoc(usersRef, {
        email: "test@example.com",
        displayName: "Test User",
        role: "user",
        emailVerified: false,
        createdAt: new Date(),
        isActive: false,
        test: true // Mark as test document
      });
      console.log("Test user created");
    }
    
    toast.success(`Firestore connected! Found ${snapshot.size} user(s)`);
    return snapshot.size;
  } catch (error) {
    console.error("Firestore test failed:", error);
    toast.error("Firestore test failed. Check configuration and billing.");
    return 0;
  }
};

// For browser console testing
if (typeof window !== 'undefined') {
  (window as any).testFirestore = testFirestoreConnection;
}
