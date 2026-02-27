'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { type PricingTier } from '@/lib/site';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';


export function StripeCheckoutButton({ tier }: { tier: PricingTier }) {
    const { user } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const handleCheckout = async () => {
        if (!user || !user.email) {
            toast({ title: "You must be logged in", description: "Please log in or sign up to activate a plan.", variant: "destructive" });
            return;
        }
        setIsLoading(true);

        try {
            // Construct the URL with parameters
            const url = new URL(tier.stripePaymentLink);
            url.searchParams.append('client_reference_id', user.uid);
            url.searchParams.append('customer_email', user.email);
            // Add metadata
            url.searchParams.append('metadata[planName]', tier.name);
            url.searchParams.append('metadata[userId]', user.uid);

            // Redirect the user to the Stripe Payment Link
            window.location.href = url.toString();

        } catch (error) {
            console.error("Stripe checkout error:", error);
            toast({
                title: "Checkout Error",
                description: error instanceof Error ? error.message : "Could not initiate the payment process. Please try again.",
                variant: "destructive",
            });
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            <Button className="w-full" onClick={handleCheckout} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isLoading ? 'Redirecting to payment...' : `Activate ${tier.name} Plan`}
            </Button>
            <p className="text-xs text-center text-muted-foreground mt-2">
                Secure payments powered by Stripe.
            </p>
        </div>
    );
}
