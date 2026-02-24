'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { platformReferrals as initialReferrals } from '@/lib/mock-data';

export interface PlatformReferral {
  referredUser: string;
  email: string;
  affiliate: string;
  plan: string;
  status: 'pending' | 'activated';
}

interface ReferralContextType {
  referrals: PlatformReferral[];
  addReferral: (referral: Omit<PlatformReferral, 'plan' | 'status'>) => void;
  activateReferral: (email: string) => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);
const LOCAL_STORAGE_KEY = 'platformReferrals';

const getInitialState = () => {
  // This function runs only on the client, once, to get the initial state.
  if (typeof window === 'undefined') {
    return initialReferrals;
  }
  try {
    const item = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    // If there's something in local storage, use it. Otherwise, use the mock data.
    return item ? JSON.parse(item) : initialReferrals;
  } catch (error) {
    console.error("Failed to read from localStorage, using initial data.", error);
    return initialReferrals;
  }
};


export const ReferralProvider = ({ children }: { children: ReactNode }) => {
  const [referrals, setReferrals] = useState<PlatformReferral[]>(getInitialState);

  // This effect now ONLY saves to localStorage when the referrals state changes.
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(referrals));
    } catch (error) {
      console.error("Failed to write to localStorage", error);
    }
  }, [referrals]);


  const addReferral = useCallback((newReferralData: Omit<PlatformReferral, 'plan' | 'status'>) => {
    const newReferral: PlatformReferral = {
      ...newReferralData,
      plan: 'Starter', // Default plan for new signups
      status: 'pending',
    };
    setReferrals(prev => [newReferral, ...prev.filter(r => r.email !== newReferral.email)]);
  }, []);
  
  const activateReferral = useCallback((email: string) => {
    setReferrals(currentReferrals =>
        currentReferrals.map(r =>
            r.email === email ? { ...r, status: 'activated' } : r
        )
    );
  }, []);


  const value = { referrals, addReferral, activateReferral };

  return (
    <ReferralContext.Provider value={value}>
      {children}
    </ReferralContext.Provider>
  );
};

export const useReferrals = (): ReferralContextType => {
  const context = useContext(ReferralContext);
  if (context === undefined) {
    throw new Error('useReferrals must be used within a ReferralProvider');
  }
  return context;
};
