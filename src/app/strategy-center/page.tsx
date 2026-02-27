'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This page is deprecated. The strategy center is now only available
 * to logged-in users via the /dashboard/strategy-center route.
 * This component redirects any public traffic to the pricing page.
 */
export default function StrategyCenterRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pricing');
  }, [router]);

  // Render nothing while redirecting
  return null;
}
