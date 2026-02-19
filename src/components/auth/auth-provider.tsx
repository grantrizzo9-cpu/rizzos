"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user type, replace with your actual User type from Firebase
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  // Add other user properties here
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // Add mock sign-in/sign-out for demonstration
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock auth functions
const mockSignIn = (): User => ({
  uid: 'mock-user-123',
  email: 'affiliate@ai-host.com',
  displayName: 'Pro Affiliate',
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd use Firebase's onAuthStateChanged here.
    // For this mock, we'll just simulate a logged-in user after a delay.
    const authState = localStorage.getItem('authed');
    if (authState === 'true') {
       setUser(mockSignIn());
    }
    setLoading(false);
  }, []);

  const signIn = () => {
    setLoading(true);
    localStorage.setItem('authed', 'true');
    setUser(mockSignIn());
    setLoading(false);
  };

  const signOut = () => {
    setLoading(true);
    localStorage.removeItem('authed');
    setUser(null);
    setLoading(false);
  };


  const value = { user, loading, signIn, signOut };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
