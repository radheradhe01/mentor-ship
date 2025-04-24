import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Import Supabase client
import { Session, User } from '@supabase/supabase-js'; // Import Supabase types

type UserType = 'mentor' | 'mentee'; // Removed null, userType should be set during signup

// Keep your existing profile structure, but ensure it aligns with 'profiles' table
interface UserProfile {
  id: string; // Add Supabase user ID
  wallet_address: string; // Add wallet address
  user_type: UserType;
  name?: string;
  email?: string; // Email will come from Supabase auth user
  created_at?: string;
  updated_at?: string;
  qualifications?: string;
  bio?: string;
  profile_picture_url?: string;
  is_verified?: boolean;
  mentor_price?: number;
  linkedin_url?: string;
  availability?: any; // Consider a stricter type if possible
  goals?: string;
  // isOnboarded might be derived or stored in profiles table
  isOnboarded?: boolean; // You might want to add this to your profiles table
  interests?: string[]; // This likely comes from profile_interests join
}

interface UserContextType {
  session: Session | null;
  user: User | null; // Supabase auth user
  profile: UserProfile | null; // User profile data from 'profiles' table
  loading: boolean; // Loading state for initial auth check
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, userType: UserType, walletAddress: string, name?: string) => Promise<void>;
  // Keep updateUserProfile if needed for client-side updates before saving
  updateUserProfileContext: (updates: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessionAndProfile = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          // Fetch profile if session exists
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // Ignore 'PGRST116' (No rows found)
             console.error('Error fetching profile:', profileError);
          } else {
             setProfile(profileData as UserProfile | null);
          }
        } else {
          setProfile(null); // Clear profile if no session
        }
      } catch (error) {
        console.error("Error fetching session or profile:", error);
        setSession(null);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setLoading(true);
        setSession(session);
        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
          // Fetch profile on auth state change (login/token refresh)
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', currentUser.id)
            .single();

           if (profileError && profileError.code !== 'PGRST116') {
             console.error('Error fetching profile on auth change:', profileError);
             setProfile(null); // Clear profile on error
           } else {
             setProfile(profileData as UserProfile | null);
           }
        } else {
          setProfile(null); // Clear profile on logout
        }
        setLoading(false);
      }
    );

    // Cleanup listener on component unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // Profile will be fetched by onAuthStateChange listener
    } catch (error) {
      console.error("Login failed:", error);
      alert(`Login failed: ${error instanceof Error ? error.message : String(error)}`);
      // Ensure state is cleared if login fails unexpectedly after state change started
      setSession(null);
      setUser(null);
      setProfile(null);
    } finally {
      // Listener will set loading to false
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // State will be cleared by onAuthStateChange listener
    } catch (error) {
      console.error("Logout failed:", error);
      alert(`Logout failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
       // Listener should handle setting loading to false, but ensure it happens
       setLoading(false);
       // Explicitly clear state as a fallback
       setSession(null);
       setUser(null);
       setProfile(null);
    }
  };

  const signup = async (email: string, password: string, userType: UserType, walletAddress: string, name?: string) => {
    setLoading(true);
    try {
      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error("Signup successful but no user data returned.");

      // 2. Create a corresponding profile in the 'profiles' table
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: authData.user.id, // Link to the auth user
          email: email,
          user_type: userType,
          wallet_address: walletAddress,
          name: name ?? '', // Use provided name or default to empty string
          // Add other default profile fields if necessary
        });

      if (profileError) {
        console.error("Error creating profile after signup:", profileError);
        // Consider how to handle this - maybe delete the auth user?
        // For now, just log the error. The user exists in auth but not profiles.
        throw new Error(`Signup succeeded but profile creation failed: ${profileError.message}`);
      }

      // Optionally sign in the user immediately after signup, or prompt them to check email if verification is enabled
      alert('Signup successful! Please check your email for verification if enabled, then log in.');
      // Note: onAuthStateChange will handle setting the user/session state if email verification is not required or after verification.

    } catch (error) {
      console.error("Signup failed:", error);
      alert(`Signup failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to update context state directly (e.g., optimistic UI updates)
  const updateUserProfileContext = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const value = {
    session,
    user,
    profile,
    loading,
    login,
    logout,
    signup,
    updateUserProfileContext,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook to use the UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
