
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
  login: (email: string, userType: UserType) => void;
  logout: () => void;
}

const defaultUserContext: UserContextType = {
  user: null,
  setUser: () => {},
  updateUserProfile: () => {},
  login: () => {},
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

  const login = (email: string, userType: UserType) => {
    setUser({
      email,
      userType,
      isOnboarded: false,
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, updateUserProfile, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
