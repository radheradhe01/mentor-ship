
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <UserProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/mentee/mentorships" element={<MyMentorshipsPage />} />
            <Route path="/mentor/:mentorId" element={<MentorProfilePage />} />
            <Route path="/mentor/dashboard" element={<MentorDashboardPage />} />
            <Route path="/mentee/dashboard" element={<MenteeDashboardPage />} />
            <Route path="/meeting" element={<MeetingRoomPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </UserProvider>
  </QueryClientProvider>
);

export default App;
