
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

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
  allUsers: User[];
  setFamilyStatus: (email: string, isFamily: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock default user
const defaultMockUser: User = {
  uid: 'mock-admin-user-123',
  email: 'rentapog@gmail.com',
  displayName: 'Platform Admin',
  username: 'hostproai',
  isPaid: true,
  plan: 'Diamond',
  referrer: null,
  isFriendAndFamily: true,
};


// --- Mock DB Functions for Testing ---
const MOCK_USER_DB_KEY = 'mock_user_db';

const getMockUserDB = (): User[] => {
  if (typeof window === 'undefined') return [];
  try {
    const db = window.localStorage.getItem(MOCK_USER_DB_KEY);
    return db ? JSON.parse(db) : [];
  } catch {
    return [];
  }
};

const saveMockUserDB = (db: User[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MOCK_USER_DB_KEY, JSON.stringify(db));
};
// --- End Mock DB Functions ---


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAllUsers = useCallback(() => {
    setAllUsers(getMockUserDB());
  }, []);

  useEffect(() => {
    // --- PRE-SEED MOCK DATA FOR TESTING ---
    const db = getMockUserDB();
    const adminUserExists = db.some(u => u.email === 'rentapog@gmail.com');
     if (!adminUserExists) {
        db.push(defaultMockUser);
    }
    const rentarizUserExists = db.some(u => u.email === 'rentariz@gmail.com');
    if (!rentarizUserExists) {
        const rentarizUser: User = {
            uid: 'mock-rentariz-user-456',
            email: 'rentariz@gmail.com',
            displayName: 'Rentariz',
            username: 'rentariz',
            isPaid: true,
            plan: 'Diamond',
            isFriendAndFamily: false,
            referrer: null,
        };
        db.push(rentarizUser);
    }
    saveMockUserDB(db);
    // --- END PRE-SEED ---
    
    loadAllUsers();

    // In a real app, you'd use Firebase's onAuthStateChanged here.
    const authState = localStorage.getItem('authed');
    if (authState === 'true') {
       const storedUser = localStorage.getItem('user');
       setUser(storedUser ? JSON.parse(storedUser) : defaultMockUser);
    }
    setLoading(false);
  }, [loadAllUsers]);

  const signIn = (userToSignIn?: User, isNewUser = false, referrerUsername?: string) => {
    setLoading(true);
    let userToSet: User;

    if (userToSignIn) {
      userToSet = { 
        ...userToSignIn,
        referrer: userToSignIn.referrer || referrerUsername || null,
      };
    } else {
      userToSet = defaultMockUser;
    }
    
    if (userToSet.email) {
      const db = getMockUserDB();
      const userIndex = db.findIndex(u => u.email === userToSet.email);
      if (userIndex > -1) {
        db[userIndex] = { ...db[userIndex], ...userToSet };
      } else {
        db.push(userToSet);
      }
      saveMockUserDB(db);
    }

    localStorage.setItem('authed', 'true');
    localStorage.setItem('user', JSON.stringify(userToSet));
    setUser(userToSet);
    loadAllUsers();
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
      const db = getMockUserDB();
      const userIndex = db.findIndex(u => u.email === user.email);
      if (userIndex > -1) {
        db[userIndex] = updatedUser;
        saveMockUserDB(db);
      }
      loadAllUsers();
    }
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      const db = getMockUserDB();
      const userIndex = db.findIndex(u => u.email === user.email);
      if (userIndex > -1) {
        db[userIndex] = updatedUser;
        saveMockUserDB(db);
      }
      loadAllUsers();
    }
  };

  const setFamilyStatus = (email: string, isFamily: boolean) => {
    if (!email) return;
    const db = getMockUserDB();
    const updatedDb = db.map(u => {
        if (u.email === email) {
            return {
                ...u,
                isFriendAndFamily: isFamily,
                isPaid: isFamily, // isPaid is true if they are family (free access)
                plan: isFamily ? 'Diamond' : undefined,
            };
        }
        return u;
    });
    saveMockUserDB(updatedDb);
    loadAllUsers();
  };


  const value = { user, loading, signIn, signOut, activateAccount, updateUser, allUsers, setFamilyStatus };

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
