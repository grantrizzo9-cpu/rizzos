'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Loader2 } from 'lucide-react';

/**
 * This page acts as a router. The main upgrade/payment page is inside the dashboard.
 * - If the user is logged in, it redirects them to the dashboard payment page.
 * - If the user is not logged in, it redirects them to the public pricing page, 
 *   as they need to see the options before signing up.
 */
export default function UpgradeRedirectPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
        if (user) {
            router.replace('/dashboard/upgrade');
        } else {
            // If not logged in, they can't access the dashboard upgrade page.
            // Send them to the public pricing page to see options and sign up.
            router.replace('/pricing');
        }
    }
  }, [router, user, loading]);

  // Render a loader while redirecting to provide user feedback.
  return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
  );
}
