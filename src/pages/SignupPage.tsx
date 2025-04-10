
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserTypeSelection } from "@/components/auth/UserTypeSelection";
import { MentorQualificationForm } from "@/components/auth/MentorQualificationForm";
import { MenteeInterestsForm } from "@/components/auth/MenteeInterestsForm";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SignupPage = () => {
  const [userType, setUserType] = useState<'mentor' | 'mentee' | null>(null);
  const { login, updateUserProfile } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleUserTypeSelect = (type: 'mentor' | 'mentee') => {
    setUserType(type);
    login("example@email.com", type);
  };
  
  const handleMentorSubmit = (qualifications: any) => {
    updateUserProfile({
      name: qualifications.name,
      qualifications,
      isOnboarded: true,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`
    });
    
    toast({
      title: "Profile created successfully!",
      description: "Welcome to MentorSpark as a mentor.",
    });
    
    setTimeout(() => {
      navigate("/mentor/dashboard");
    }, 1000);
  };
  
  const handleMenteeSubmit = (data: { name: string, interests: string[] }) => {
    updateUserProfile({
      name: data.name,
      interests: data.interests,
      isOnboarded: true,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 70)}.jpg`
    });
    
    toast({
      title: "Profile created successfully!",
      description: "Welcome to MentorSpark as a mentee.",
    });
    
    setTimeout(() => {
      navigate("/mentee/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {!userType ? (
          <UserTypeSelection onSelect={handleUserTypeSelect} />
        ) : userType === 'mentor' ? (
          <MentorQualificationForm onSubmit={handleMentorSubmit} />
        ) : (
          <MenteeInterestsForm onSubmit={handleMenteeSubmit} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
