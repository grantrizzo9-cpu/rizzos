
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Mock user type, replace with your actual User type from Firebase
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  isPaid?: boolean;
  plan?: string;
  isFriendAndFamily?: boolean;
  referrer?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (userToSignIn?: User, isNewUser?: boolean, referrerUsername?: string) => void;
  signOut: () => void;
  activateAccount: (planName: string) => void;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// List of special accounts
const friendsAndFamilyEmails = [
    'friend@example.com',
    'family@example.com',
];

// Mock default user
const defaultMockUser: User = {
  uid: 'mock-admin-user-123',
  email: 'rentapog@gmail.com',
  displayName: 'Host Pro Ai Admin',
  username: 'hostproai',
  isPaid: true,
  plan: 'Diamond',
  referrer: null,
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

  const signIn = (userToSignIn?: User, isNewUser = false, referrerUsername?: string) => {
    setLoading(true);
    let userToSet: User;

    if (userToSignIn) {
      const isFriend = userToSignIn.email ? friendsAndFamilyEmails.includes(userToSignIn.email) : false;
      
      if (isFriend) {
          userToSet = { ...userToSignIn, isPaid: true, plan: 'Diamond', isFriendAndFamily: true, referrer: null };
      } else {
        userToSet = { 
            ...userToSignIn, 
            isPaid: isNewUser ? false : userToSignIn.isPaid ?? true, 
            isFriendAndFamily: false,
            referrer: referrerUsername || null,
        };
      }
    } else {
      userToSet = defaultMockUser;
    }
    
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
  
  const activateAccount = (planName: string) => {
    if (user) {
      const updatedUser = { ...user, isPaid: true, plan: planName };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };


  const value = { user, loading, signIn, signOut, activateAccount, updateUser };

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
