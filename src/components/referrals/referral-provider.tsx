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
  activateReferral: (email: string, planName: string) => void;
}

const ReferralContext = createContext<ReferralContextType | undefined>(undefined);

const REFERRALS_LOCAL_STORAGE_KEY = 'platform_referrals';


export const ReferralProvider = ({ children }: { children: ReactNode }) => {
  const [referrals, setReferrals] = useState<PlatformReferral[]>([]);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedReferrals = localStorage.getItem(REFERRALS_LOCAL_STORAGE_KEY);
      if (storedReferrals) {
        setReferrals(JSON.parse(storedReferrals));
      } else {
        // If nothing in storage, initialize with mock data and save it
        localStorage.setItem(REFERRALS_LOCAL_STORAGE_KEY, JSON.stringify(initialReferrals));
        setReferrals(initialReferrals);
      }
    } catch (error) {
      console.error("Failed to load referrals from local storage:", error);
      setReferrals(initialReferrals);
    }
  }, []);

  const addReferral = useCallback((newReferralData: Omit<PlatformReferral, 'plan' | 'status'>) => {
    const newReferral: PlatformReferral = {
      ...newReferralData,
      plan: 'Starter', // Default plan for new signups
      status: 'pending',
    };
    
    setReferrals(prev => {
        const updatedReferrals = [newReferral, ...prev.filter(r => r.email !== newReferral.email)];
        try {
            localStorage.setItem(REFERRALS_LOCAL_STORAGE_KEY, JSON.stringify(updatedReferrals));
        } catch (error) {
            console.error("Failed to save referrals to local storage:", error);
        }
        return updatedReferrals;
    });
  }, []);
  
  const activateReferral = useCallback((email: string, planName: string) => {
    setReferrals(prev => {
        const updatedReferrals = prev.map(r =>
            r.email === email ? { ...r, status: 'activated', plan: planName } : r
        );
        try {
            localStorage.setItem(REFERRALS_LOCAL_STORAGE_KEY, JSON.stringify(updatedReferrals));
        } catch (error) {
            console.error("Failed to save referrals to local storage:", error);
        }
        return updatedReferrals;
    });
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
