import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserTypeSelection } from "@/components/auth/UserTypeSelection";
import { MentorQualificationForm } from "@/components/auth/MentorQualificationForm";
import { MenteeInterestsForm } from "@/components/auth/MenteeInterestsForm";
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAccount } from 'wagmi';

const SignupPage = () => {
  const [step, setStep] = useState(0); // 0: Email/Pass, 1: UserType, 2: Details
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<'mentor' | 'mentee' | null>(null);
  const { signup, loading } = useUser();
  const { address: walletAddress } = useAccount();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleEmailPassSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walletAddress) {
      toast({ title: "Wallet Not Connected", description: "Please connect your wallet first.", variant: "destructive" });
      return;
    }
    setStep(1);
  };

  const handleUserTypeSelect = (type: 'mentor' | 'mentee') => {
    setUserType(type);
    setStep(2);
  };

  const handleMentorSubmit = async (qualifications: any) => {
    if (!userType || !walletAddress) {
      toast({ title: "Error", description: "User type or wallet address missing.", variant: "destructive" });
      return;
    }
    try {
      await signup(email, password, userType, walletAddress, qualifications.name);
      toast({ title: "Signup Initiated", description: "Check your email for verification if needed, then log in." });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed in component:", error);
    }
  };

  const handleMenteeSubmit = async (data: { name: string, interests: string[] }) => {
    if (!userType || !walletAddress) {
      toast({ title: "Error", description: "User type or wallet address missing.", variant: "destructive" });
      return;
    }
    try {
      await signup(email, password, userType, walletAddress, data.name);
      toast({ title: "Signup Initiated", description: "Check your email for verification if needed, then log in." });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed in component:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-4">
        {step === 0 && (
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>Enter your email and password to start.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleEmailPassSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading || !walletAddress}>
                  {loading ? "Proceeding..." : !walletAddress ? "Connect Wallet First" : "Continue"}
                </Button>
                {!walletAddress && <p className="text-xs text-red-500 text-center pt-2">Please connect your wallet to sign up.</p>}
              </form>
            </CardContent>
          </Card>
        )}
        {step === 1 && (
          <UserTypeSelection onSelect={handleUserTypeSelect} />
        )}
        {step === 2 && userType === 'mentor' && (
          <MentorQualificationForm onSubmit={handleMentorSubmit} />
        )}
        {step === 2 && userType === 'mentee' && (
          <MenteeInterestsForm onSubmit={handleMenteeSubmit} />
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
