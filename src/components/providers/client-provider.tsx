
'use client';

import { AuthProvider } from '@/components/auth/auth-provider';
import { PayPalProvider } from '@/components/paypal/paypal-provider';
import { EarningsProvider } from '@/components/earnings/earnings-provider';
import { ReferralProvider } from '@/components/referrals/referral-provider';
import { ReactNode, useState, useEffect } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or a loading skeleton
  }

  return (
    <PayPalProvider>
      <AuthProvider>
        <ReferralProvider>
          <EarningsProvider>
            {children}
          </EarningsProvider>
        </ReferralProvider>
      </AuthProvider>
    </PayPalProvider>
  );
}
