
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MentorDashboard } from "@/components/dashboard/MentorDashboard";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const MentorDashboardPage = () => {
  const { user } = useUser();
  
  // Redirect if user is not logged in or not a mentor
  if (!user || user.userType !== "mentor") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <MentorDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default MentorDashboardPage;
