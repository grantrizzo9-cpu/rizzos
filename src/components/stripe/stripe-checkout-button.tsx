'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { type PricingTier } from '@/lib/site';
import { createCheckoutSession } from '@/ai/flows/create-stripe-checkout-flow';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
    throw new Error('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable not set.');
}

// Load Stripe outside of component to avoid reloading on every render
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

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

        if (tier.stripePriceId.startsWith('replace_with_real_')) {
            toast({
                title: "Stripe Price ID Not Configured",
                description: `This plan's Price ID is a placeholder. You need to create a Product in your Stripe dashboard and update the ID for the "${tier.name}" plan in the file 'src/lib/site.ts'.`,
                variant: "destructive",
                duration: 15000,
            });
            setIsLoading(false);
            return;
        }

        try {
            const { sessionId } = await createCheckoutSession({
                priceId: tier.stripePriceId,
                userId: user.uid,
                userEmail: user.email,
                planName: tier.name,
            });

            const stripe = await stripePromise;
            if (!stripe) {
                throw new Error("Stripe.js failed to load.");
            }

            const { error } = await stripe.redirectToCheckout({ sessionId });

            if (error) {
                throw new Error(error.message);
            }
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
