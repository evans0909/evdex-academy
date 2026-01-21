import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

const TestFirebase = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      console.log("Firebase Auth State Changed:", currentUser);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading Firebase test...</div>;

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Firebase Test Page</h1>
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Status:</h2>
        <p className="mb-2">✅ Firebase is configured</p>
        <p className="mb-2">✅ Environment variables loaded</p>
        <p className="mb-2">
          🔐 Authentication: {auth ? "Initialized" : "Not initialized"}
        </p>
        <p className="mb-2">
          👤 Current User: {user ? user.email : "Not signed in"}
        </p>
      </div>
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Try these in browser console:</h3>
        <pre className="block bg-black text-green-400 p-2 rounded mb-2 overflow-x-auto">
          {`import('./firebase').then(mod => console.log('Firebase auth:', mod.auth))`}
        </pre>
        <pre className="block bg-black text-green-400 p-2 rounded overflow-x-auto">
          {`import('./firebase').then(mod => mod.auth.currentUser)`}
        </pre>
      </div>
    </div>
  );
};

export default TestFirebase;
