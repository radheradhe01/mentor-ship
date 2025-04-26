import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Assuming you have jwt-decode installed

interface User {
  email: string;
  userType: 'mentor' | 'mentee';
  isOnboarded: boolean; // We need to fetch this properly later
  name?: string; // Add name and avatar
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  completeOnboarding: () => void; // Function to mark onboarding as complete
  isLoading: boolean; // Add loading state
}

interface DecodedToken {
  sub: string; // email
  user_type: 'mentor' | 'mentee';
  exp: number;
  // Add other fields if present in your token
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Rename AuthProvider to UserProvider
export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // useEffect hook to check localStorage for token (remains the same)
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        if (decodedToken.exp * 1000 > Date.now()) {
          // TODO: Fetch full user profile (name, avatar, isOnboarded) using /users/me endpoint
          setUser({
            email: decodedToken.sub,
            userType: decodedToken.user_type,
            isOnboarded: false, // Placeholder - fetch this!
            // name: fetchedName, // Add after fetching
            // avatar: fetchedAvatar, // Add after fetching
          });
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);


  // login function (remains the same)
  const login = async (email: string, password: string) => {
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    const response = await fetch('/login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: "Login failed" }));
      throw new Error(errorData.detail || 'Login failed');
    }

    const data = await response.json();
    const token = data.access_token;
    localStorage.setItem('authToken', token);
    const decodedToken = jwtDecode<DecodedToken>(token);

    // TODO: Fetch full user profile (name, avatar, isOnboarded) using /users/me endpoint
    setUser({
      email: decodedToken.sub,
      userType: decodedToken.user_type,
      isOnboarded: false, // Placeholder - fetch this!
    });
  };

  // logout function (remains the same)
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  // completeOnboarding function (remains the same)
  const completeOnboarding = () => {
    setUser(currentUser => {
      if (!currentUser) return null;
      // TODO: Ideally, refetch user data from /users/me to confirm onboarding status
      return { ...currentUser, isOnboarded: true };
    });
  };


  return (
    // Use AuthContext.Provider as before, the value contains the state and functions
    <AuthContext.Provider value={{ user, login, logout, completeOnboarding, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

// useUser hook remains the same
export const useUser = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider'); // Update error message slightly
  }
  return context;
};
