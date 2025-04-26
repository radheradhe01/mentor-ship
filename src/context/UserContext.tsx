import { createContext, useContext, useState, ReactNode } from 'react';

type UserType = 'mentor' | 'mentee' | null;

interface UserProfile {
  name?: string;
  email?: string;
  userType: UserType;
  isOnboarded: boolean;
  interests?: string[];
  qualifications?: {
    highSchool?: string;
    graduation?: string;
    achievements?: string[];
    experience?: string;
    mentorshipExperience?: string;
  };
  avatar?: string;
}

interface UserContextType {
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const defaultUserContext: UserContextType = {
  user: null,
  setUser: () => {},
  updateUserProfile: () => {},
  login: async () => {},
  logout: () => {}
};

const UserContext = createContext<UserContextType>(defaultUserContext);

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const updateUserProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  // Real login: call backend, store JWT, set user
  const login = async (email: string, password: string) => {
    console.log("Attempting login via UserContext for:", email); // Add this log
    try { // Add try block
      const res = await fetch('/login/', { // <<< MUST BE /login/
        method: 'POST', // <<< MUST BE POST
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ username: email, password })
      });
      console.log("Login response status:", res.status); // Add this log

      if (!res.ok) {
        console.error("Login API call failed:", res.statusText); // Add error log
        throw new Error('Login failed');
      }
      const data = await res.json();
      console.log("Login successful, token received."); // Add success log
      localStorage.setItem('token', data.access_token);
      // Decode JWT to get user_type (assuming it's in the token)
      const decodedToken = JSON.parse(atob(data.access_token.split('.')[1]));
      setUser({ email, userType: decodedToken.user_type, isOnboarded: false }); // Set userType from token
    } catch (error) { // Add catch block
       console.error("Error during login fetch:", error);
       // Re-throw or handle as needed, maybe show a toast message
       throw error; // Re-throw so the calling component knows it failed
    }
  };

  // Real logout: clear JWT and user state
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserProfile, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
