import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, signInWithGoogle, signOut, getCurrentUser } from '../lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getCurrentUser();
    setUser(user);
    setLoading(false);
  }, []);

  const handleSignInWithGoogle = async () => {
    const user = await signInWithGoogle();
    setUser(user);
  };

  const handleLogout = () => {
    signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signInWithGoogle: handleSignInWithGoogle,
      logout: handleLogout
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}