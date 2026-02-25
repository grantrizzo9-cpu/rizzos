
'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { format } from 'date-fns';
import { useAuth } from '@/components/auth/auth-provider';
import { useReferrals } from '@/components/referrals/referral-provider';
import { pricingTiers } from '@/lib/site';

// Data types
export interface Referral {
  id: string;
  email: string;
  plan: string;
  status: 'Active' | 'Trial' | 'Canceled';
  commission: number;
  date: Date;
}

export interface Earning {
  amount: number;
  date: Date;
}

// Chart data types
export interface DailyEarning {
  date: string; // e.g., 'Mon', 'Tue'
  [plan: string]: number | string;
}

export interface MonthlyReferral {
  month: string; // e.g., 'Jan', 'Feb'
  referrals: number;
}

interface EarningsContextType {
  referrals: Referral[];
  earnings: Earning[];
  addEarning: (tierPrice: number) => void;
  dailyEarnings: DailyEarning[];
  monthlyReferrals: MonthlyReferral[];
  totalEarnings: number;
  activeReferrals: number;
}

const EarningsContext = createContext<EarningsContextType | undefined>(undefined);

export const EarningsProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { referrals: platformReferrals } = useReferrals();

  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [earnings, setEarnings] = useState<Earning[]>([]);

  useEffect(() => {
    if (!user?.username || !platformReferrals) {
      setReferrals([]);
      setEarnings([]);
      return;
    }

    // Filter platform referrals to find ones made by the current logged-in user
    const myPlatformReferrals = platformReferrals.filter(
      r => r.affiliate === user.username
    );

    // Process only activated referrals for earnings
    const activatedReferrals = myPlatformReferrals.filter(r => r.status === 'activated');

    // Determine the correct commission rate
    const commissionRate = activatedReferrals.length >= 10 ? 75 : 70;

    const processedReferrals: Referral[] = myPlatformReferrals.map((pr, index) => {
      let dailyCommission = 0;
      const tier = pricingTiers.find(t => t.name === pr.plan);
      let status: 'Active' | 'Trial' = 'Trial';
      
      if (pr.status === 'activated') {
          status = 'Active';
          if (tier) {
              dailyCommission = tier.price * (commissionRate / 100);
          }
      }
      
      return {
        id: pr.email,
        email: pr.email,
        plan: pr.plan,
        status: status,
        commission: dailyCommission,
        date: new Date(new Date().setDate(new Date().getDate() - (index % 7))), // Spread dates over last 7 days
      };
    });

    const processedEarnings: Earning[] = processedReferrals
      .filter(r => r.commission > 0) // Only include actual earnings
      .map(r => ({
        amount: r.commission,
        date: r.date,
      }));

    setReferrals(processedReferrals);
    setEarnings(processedEarnings);
  }, [user, platformReferrals]);

  // This function is no longer needed but kept for compatibility with the payment button.
  // It correctly does nothing as earnings are now derived from referrals.
  const addEarning = () => {};

  const processEarningsForChart = (): DailyEarning[] => {
    const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d;
    }).reverse();

    const dailyData = days.map(d => ({
      date: format(d, 'E'),
    }));

    const dailyTotals: DailyEarning[] = dailyData.map(d => ({...d}));

    referrals.forEach(referral => {
      if (referral.status === 'Active' && referral.commission > 0) {
        const referralDateStr = format(referral.date, 'yyyy-MM-dd');
        const matchingDayIndex = days.findIndex(d => format(d, 'yyyy-MM-dd') === referralDateStr);

        if (matchingDayIndex !== -1) {
          const planName = referral.plan;
          if (!dailyTotals[matchingDayIndex][planName]) {
            dailyTotals[matchingDayIndex][planName] = 0;
          }
          (dailyTotals[matchingDayIndex][planName] as number) += referral.commission;
        }
      }
    });

    return dailyTotals;
  };
  
  const processReferralsForChart = (): MonthlyReferral[] => {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyTotals: { [key: string]: number } = {};
      monthNames.forEach(m => monthlyTotals[m] = 0);

      const monthCounter = new Set();
      referrals.forEach(ref => {
          const monthIndex = ref.date.getMonth();
          const monthName = monthNames[monthIndex];
          const uniqueKey = `${ref.email}-${monthIndex}`;

          if(!monthCounter.has(uniqueKey)) {
             monthlyTotals[monthName]++;
             monthCounter.add(uniqueKey);
          }
      });

      return monthNames.slice(0, new Date().getMonth() + 1).map(month => ({
          month,
          referrals: monthlyTotals[month] || 0
      }));
  };

  const totalEarnings = earnings.reduce((acc, item) => acc + item.amount, 0);
  const activeReferrals = referrals.filter(r => r.status === 'Active').length;
  const dailyEarnings = processEarningsForChart();
  const monthlyReferrals = processReferralsForChart();

  const value = { referrals, earnings, addEarning, dailyEarnings, monthlyReferrals, totalEarnings, activeReferrals };

  return (
    <EarningsContext.Provider value={value}>
      {children}
    </EarningsContext.Provider>
  );
};

export const useEarnings = (): EarningsContextType => {
  const context = useContext(EarningsContext);
  if (context === undefined) {
    throw new Error('useEarnings must be used within an EarningsProvider');
  }
  return context;
};
