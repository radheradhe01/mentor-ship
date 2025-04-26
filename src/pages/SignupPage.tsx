import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { UserTypeSelection } from "@/components/auth/UserTypeSelection";
import { Input } from "@/components/ui/input"; // Corrected casing
import { Button } from "@/components/ui/button"; // Corrected casing
import { useUser } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

const SignupPage = () => {
  const [userType, setUserType] = useState<'mentor' | 'mentee' | null>(null);
  const { login } = useUser();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUserTypeSelect = (type: 'mentor' | 'mentee') => {
    setUserType(type);
  };

  // Register user with backend, then login
  const handleRegister = async () => {
    if (!userType || !email || !password || !name) {
      toast({ title: 'Missing Information', description: 'Please fill in all required fields.', variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    try {
      // Step 1: Register the user
      const registerRes = await fetch('/users/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name,
          avatar_url: avatarUrl || null,
          user_type: userType,
          password
        })
      });

      if (!registerRes.ok) {
        const errorData = await registerRes.json().catch(() => ({ detail: 'Registration failed. Please check your input.' }));
        throw new Error(errorData.detail || 'Registration failed');
      }

      toast({ title: 'Registration successful!', description: 'Logging you in...' });

      // Step 2: Log the user in immediately after successful registration
      await login(email, password);

      // Step 3: Navigate after successful login
      toast({ title: 'Login successful!', description: 'Redirecting to dashboard...' });
      setTimeout(() => {
        navigate(userType === 'mentor' ? "/mentor/dashboard" : "/mentee/dashboard");
      }, 500);

    } catch (err: any) {
      console.error("Registration/Login Error:", err);
      const errorMessage = err.message || 'An error occurred during signup. Please try again.';
      toast({ title: 'Signup Failed', description: errorMessage, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {!userType ? (
          <UserTypeSelection onSelect={handleUserTypeSelect} />
        ) : (
          <div className="max-w-md mx-auto py-8 px-4">
            <h2 className="text-2xl font-bold mb-4 text-center">
              Sign Up as {userType === 'mentor' ? 'Mentor' : 'Mentee'}
            </h2>
            <Input
              type="text"
              placeholder="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mb-2"
              required
            />
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mb-2"
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="mb-2"
              required
            />
            <Input
              type="text"
              placeholder="Avatar URL (optional)"
              value={avatarUrl}
              onChange={e => setAvatarUrl(e.target.value)}
              className="mb-4"
            />
            <Button className="w-full" onClick={handleRegister} disabled={isLoading}>
              {isLoading ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SignupPage;
