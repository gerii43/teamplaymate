import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SportProvider, useSport } from "@/contexts/SportContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { ChatbotProvider } from "@/components/ChatbotBackend";
import { FootballChatbot } from "@/components/FootballChatbot";
import { TacticalAIChatbot } from "@/components/TacticalAIChatbot";
import { SportSelectionModal } from "@/components/SportSelectionModal";
import { DatabaseStatus } from "@/components/DatabaseStatus";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import Training from "./pages/Training";
import ValorantAnalysis from "./pages/ValorantAnalysis";
import Players from "./pages/Players";
import Matches from "./pages/Matches";
import GeneralStats from "./pages/GeneralStats";
import Attendance from "./pages/Attendance";
import ManualActions from "./pages/ManualActions";
import CommandTable from "./pages/CommandTable";
import TacticalChat from "./pages/TacticalChat";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import CommunityHub from "./pages/CommunityHub";
import DatabaseStatusPage from "./pages/DatabaseStatusPage";

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
  const [showSportSelection, setShowSportSelection] = useState(false);
  const { sport, isFirstTime } = useSport();
  const [showSportSelection, setShowSportSelection] = useState(false);
  
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

  // Show sport selection for first-time users
  if (isFirstTime && !sport) {
    return <SportSelectionModal isOpen={true} onClose={() => {}} />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <SportProvider>
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
                      <Route 
                        path="/players" 
                        element={
                          <ProtectedRoute>
                            <Players />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/matches" 
                        element={
                          <ProtectedRoute>
                            <Matches />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/general-stats" 
                        element={
                          <ProtectedRoute>
                            <GeneralStats />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/attendance" 
                        element={
                          <ProtectedRoute>
                            <Attendance />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/manual-actions" 
                        element={
                          <ProtectedRoute>
                            <ManualActions />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/command-table" 
                        element={
                          <ProtectedRoute>
                            <CommandTable />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/tactical-chat" 
                        element={
                          <ProtectedRoute>
                            <TacticalChat />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/advanced-analytics" 
                        element={
                          <ProtectedRoute>
                            <AdvancedAnalytics />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/community" 
                        element={
                          <ProtectedRoute>
                            <CommunityHub />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/database-status" 
                        element={
                          <ProtectedRoute>
                            <DatabaseStatusPage />
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                    <FootballChatbot />
                    <TacticalAIChatbot />
                  </BrowserRouter>
                </TooltipProvider>
              </ChatbotProvider>
            </DatabaseProvider>
          </SportProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;