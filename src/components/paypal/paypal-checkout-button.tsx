'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useReferrals } from '@/components/referrals/referral-provider';
import { type PricingTier } from '@/lib/site';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// This component now simulates a payment flow since PayPal has been removed.
export function PayPalCheckoutButton({ tier }: { tier: PricingTier }) {
    const { activateAccount, user } = useAuth();
    const { activateReferral } = useReferrals();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccessfulPayment = useCallback(() => {
        try {
            activateAccount(tier.name);
            if (user?.email) {
              activateReferral(user.email, tier.name);
            }
            toast({
                title: "Account Activated!",
                description: `Your ${tier.name} plan is now active. Welcome aboard!`,
            });
            // Redirect to the domain connection guide after successful payment.
            window.location.assign('/dashboard/strategy-center/connecting-your-domain');
        } catch (e) {
            console.error("Error during post-payment processing:", e);
            // In case of error, stop loading
            setIsLoading(false);
        }
    }, [activateAccount, tier.name, user?.email, activateReferral, toast]);

    const handleActivate = useCallback(() => {
        setIsLoading(true);
        // Simulate network delay for payment processing
        setTimeout(() => {
            handleSuccessfulPayment();
        }, 1000);
    }, [handleSuccessfulPayment]);

    return (
        <div className="w-full">
             <Button className="w-full" onClick={handleActivate} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Processing...' : `Activate ${tier.name} Plan`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
                Payment processing is handled by our third-party provider, PayQuicker.
            </p>
        </div>
    );
}
