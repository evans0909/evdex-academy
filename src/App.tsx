import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Talks from "./pages/talks/Talks";
import Universities from "./pages/Universities";
import Repairs from "./pages/Repairs";
import Donate from "./pages/Donate";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import TestFirebase from "./pages/TestFirebase";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminProtectedRoute from "./components/AdminProtectedRoute"; // Add this import
import ResetPassword from "./pages/ResetPassword";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import AdminDashboard from "./pages/AdminDashboard";
import TalkDetail from "./pages/talks/TalkDetail"; // If named TalkDetail.tsx
import CreateTalk from "./pages/talks/CreateTalk"; // If named CreateTalk.tsx  
import MyTalks from "./pages/talks/MyTalks"; // If named MyTalks.tsx
import Materials from "./pages/Materials";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/materials" element={<Materials />} />
          <Route path="/" element={<Index />} />
          <Route path="/talks" element={<Talks />} />
          <Route path="/universities" element={<Universities />} />
          <Route path="/repairs" element={<Repairs />} />
          <Route path="/donate" element={<Donate />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/talks/:id" element={<TalkDetail />} />
          <Route path="/talks/new" element={<CreateTalk />} />
          <Route path="/talks/enrolled" element={<MyTalks />} />
          <Route 
            path="/admin" 
            element={
              <AdminProtectedRoute> {/* Changed from ProtectedRoute to AdminProtectedRoute */}
                <AdminDashboard />
              </AdminProtectedRoute>
            } 
          />
          <Route path="/test-firebase" element={<TestFirebase />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;