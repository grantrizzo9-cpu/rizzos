
'use client';

import { AuthProvider } from '@/components/auth/auth-provider';
import { EarningsProvider } from '@/components/earnings/earnings-provider';
import { ReferralProvider } from '@/components/referrals/referral-provider';
import { DomainsProvider } from '@/contexts/domains-provider';
import { Toaster } from '@/components/ui/toaster';
import { ReactNode } from 'react';

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
      <AuthProvider>
        <ReferralProvider>
          <DomainsProvider>
            <EarningsProvider>
              <div className="flex min-h-screen flex-col">
                {children}
              </div>
              <Toaster />
            </EarningsProvider>
          </DomainsProvider>
        </ReferralProvider>
      </AuthProvider>
  );
}
