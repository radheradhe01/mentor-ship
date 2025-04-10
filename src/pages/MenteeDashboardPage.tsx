
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MenteeDashboard } from "@/components/dashboard/MenteeDashboard";
import { useUser } from "@/context/UserContext";
import { Navigate } from "react-router-dom";

const MenteeDashboardPage = () => {
  const { user } = useUser();
  
  // Redirect if user is not logged in or not a mentee
  if (!user || user.userType !== "mentee") {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <MenteeDashboard />
      </main>
      <Footer />
    </div>
  );
};

export default MenteeDashboardPage;
