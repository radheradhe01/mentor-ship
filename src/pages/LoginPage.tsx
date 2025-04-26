import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<'mentor' | 'mentee'>('mentee');
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast({
        title: "Error",
        description: "Please enter your email",
        variant: "destructive",
      });
      return;
    }
    try {
      await login(email, password);
      toast({
        title: `Logged in as ${userType}`,
        description: `Welcome back to Emiwex as a ${userType}.`,
      });
      setTimeout(() => {
        navigate(userType === 'mentor' ? "/mentor/dashboard" : "/mentee/dashboard");
      }, 1000);
    } catch (err) {
      toast({
        title: "Login failed",
        description: "Invalid credentials.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center py-10">
        <Card className="w-full max-w-md mx-4 animate-fade-in">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login to Emiwex</CardTitle>
            <CardDescription>Enter your email to sign in to your account</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="example@email.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="Enter your password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>User Type</Label>
                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant={userType === 'mentor' ? 'default' : 'outline'}
                    className={userType === 'mentor' ? 'bg-mentor-primary hover:bg-mentor-secondary' : ''}
                    onClick={() => setUserType('mentor')}
                  >
                    Mentor
                  </Button>
                  <Button
                    type="button"
                    variant={userType === 'mentee' ? 'default' : 'outline'}
                    className={userType === 'mentee' ? 'bg-mentee-primary hover:bg-mentee-secondary' : ''}
                    onClick={() => setUserType('mentee')}
                  >
                    Mentee
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                type="submit" 
                className="w-full"
                style={{ 
                  backgroundColor: userType === 'mentor' ? '#9b87f5' : '#33C3F0',
                  borderColor: userType === 'mentor' ? '#9b87f5' : '#33C3F0',
                }}
              >
                Login
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
