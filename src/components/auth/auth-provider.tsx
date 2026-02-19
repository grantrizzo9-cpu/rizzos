"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user type, replace with your actual User type from Firebase
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (userToSignIn?: User) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock default user
const defaultMockUser: User = {
  uid: 'mock-user-123',
  email: 'affiliate@ai-host.com',
  displayName: 'Pro Affiliate',
  username: 'proaffiliate',
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, you'd use Firebase's onAuthStateChanged here.
    const authState = localStorage.getItem('authed');
    if (authState === 'true') {
       const storedUser = localStorage.getItem('user');
       setUser(storedUser ? JSON.parse(storedUser) : defaultMockUser);
    }
    setLoading(false);
  }, []);

  const signIn = (userToSignIn?: User) => {
    setLoading(true);
    const userToSet = userToSignIn || defaultMockUser;
    localStorage.setItem('authed', 'true');
    localStorage.setItem('user', JSON.stringify(userToSet));
    setUser(userToSet);
    setLoading(false);
  };

  const signOut = () => {
    setLoading(true);
    localStorage.removeItem('authed');
    localStorage.removeItem('user');
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
