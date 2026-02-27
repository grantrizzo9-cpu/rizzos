'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * This page is deprecated. Strategy articles are now only available
 * to logged-in, authenticated users via the /dashboard/strategy-center/[slug] route.
 * This component redirects any public traffic to the pricing page.
 */
export default function StrategyArticleRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/pricing');
  }, [router]);

  // Render nothing while redirecting
  return null;
}
