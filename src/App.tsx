import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React, { useState } from 'react';
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { SportProvider, useSport } from "@/contexts/SportContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";

import { DatabaseProvider } from "@/contexts/DatabaseContext";
import { ChatbotProvider } from "@/components/ChatbotBackend";
import { SportSelectionModal } from "@/components/SportSelectionModal";
import ResponsiveLayout from "@/components/ResponsiveLayout";
import Index from "./pages/Index";
import Pricing from "./pages/Pricing";
import SelectSport from "./pages/SelectSport";
import Blog from "./pages/Blog";
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
import GoogleCallback from "./pages/GoogleCallback";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentCancel from "./pages/PaymentCancel";
import TestPage from "./pages/TestPage";
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
  const { sport, isFirstTime } = useSport();
  
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
  if (isFirstTime && !sport && user) {
    return <SportSelectionModal isOpen={true} onClose={() => {}} />;
  }
  
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <LanguageProvider>
        <AuthProvider>
          <SportProvider>
            <DatabaseProvider>
              <ChatbotProvider>
                <TooltipProvider>
                  <Toaster />
                  <Sonner />
                  <ThemeProvider>
                    <Routes>
                      <Route path="/" element={<Index />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/select-sport" element={<SelectSport />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/signin" element={<SignIn />} />
                      <Route path="/signup" element={<SignUp />} />
                      <Route path="/test" element={<TestPage />} />
                      <Route path="/valorant" element={<ValorantAnalysis />} />
                      <Route path="/auth/google/callback" element={<GoogleCallback />} />
                      <Route path="/payment/success" element={<PaymentSuccess />} />
                      <Route path="/payment/cancel" element={<PaymentCancel />} />
                      <Route 
                        path="/dashboard" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <Dashboard />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/training" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <Training />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/players" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <Players />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/matches" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <Matches />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/general-stats" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <GeneralStats />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/attendance" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <Attendance />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/manual-actions" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <ManualActions />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/command-table" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <CommandTable />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/tactical-chat" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <TacticalChat />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/advanced-analytics" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <AdvancedAnalytics />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/community" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <CommunityHub />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/database-status" 
                        element={
                          <ProtectedRoute>
                            <ResponsiveLayout>
                              <DatabaseStatusPage />
                            </ResponsiveLayout>
                          </ProtectedRoute>
                        } 
                      />
                    </Routes>
                  </ThemeProvider>
                </TooltipProvider>
              </ChatbotProvider>
            </DatabaseProvider>
          </SportProvider>
        </AuthProvider>
      </LanguageProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;