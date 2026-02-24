'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
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

export const ReferralProvider = ({ children }: { children: ReactNode }) => {
  const [referrals, setReferrals] = useState<PlatformReferral[]>(initialReferrals);

  const addReferral = useCallback((newReferralData: Omit<PlatformReferral, 'plan' | 'status'>) => {
    const newReferral: PlatformReferral = {
      ...newReferralData,
      plan: 'Starter', // Default plan for new signups
      status: 'pending',
    };
    setReferrals(prev => [newReferral, ...prev]);
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
