import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import { WagmiProvider } from 'wagmi'
import { config } from './config/wagmiConfig.ts'
import {
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import Index from "./pages/Index";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ExplorePage from "./pages/ExplorePage";
import MyMentorshipsPage from "./pages/MyMentorshipsPage";
import MentorProfilePage from "./pages/MentorProfilePage";
import MentorDashboardPage from "./pages/MentorDashboardPage";
import MenteeDashboardPage from "./pages/MenteeDashboardPage";
import MeetingRoomPage from "./pages/MeetingRoomPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (

    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
       <RainbowKitProvider>
        <UserProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Index />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/explore" element={<ExplorePage />} />
                <Route path="/mentor/:mentorId" element={<MentorProfilePage />} />

                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path="/mentee/mentorships" element={<MyMentorshipsPage />} />
                  <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
                  <Route path="/mentee/dashboard" element={<MenteeDashboardPage />} />
                  <Route path="/meeting" element={<MeetingRoomPage />} />
                </Route>

                {/* Catch-all Not Found Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </UserProvider>
       </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
);

export default App;
