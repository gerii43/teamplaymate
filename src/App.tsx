import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { ChatbotProvider } from "@/components/ChatbotBackend";
import { FootballChatbot } from "@/components/FootballChatbot";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Training from "./pages/Training";
import ValorantAnalysis from "./pages/ValorantAnalysis";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/signin" />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <AuthProvider>
        <DatabaseProvider>
          <ChatbotProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/valorant" element={<ValorantAnalysis />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/training" 
                    element={
                      <ProtectedRoute>
                        <Training />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
                <FootballChatbot />
              </BrowserRouter>
            </TooltipProvider>
          </ChatbotProvider>
        </DatabaseProvider>
      </AuthProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;