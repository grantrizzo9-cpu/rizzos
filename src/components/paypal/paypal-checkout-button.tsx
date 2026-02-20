'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalButtons } from '@paypal/react-paypal-js';
import type { OnApproveData, CreateOrderData } from '@paypal/react-paypal-js';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { type PricingTier } from '@/lib/site';
import { Loader2, AlertCircle } from 'lucide-react';

export function PayPalCheckoutButton({ tier }: { tier: PricingTier }) {
    const { activateAccount } = useAuth();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSuccessfulPayment = () => {
        activateAccount();
        toast({
            title: "Account Activated!",
            description: `Your ${tier.name} plan is now active. Welcome aboard!`,
        });
        router.push('/dashboard');
    };

    const createOrder = (data: CreateOrderData, actions: any) => {
        // IMPORTANT: In a production environment, you should create the order on your server
        // to prevent users from manipulating the price on the client side.
        // This is a client-side example for demonstration purposes only.
        console.log('Creating order for tier:', tier.name, 'Price:', tier.price);
        return actions.order.create({
            purchase_units: [
                {
                    description: `Host Pro Ai - ${tier.name} Plan Activation`,
                    amount: {
                        currency_code: 'AUD',
                        value: tier.price.toFixed(2),
                    },
                },
            ],
            application_context: {
                shipping_preference: 'NO_SHIPPING'
            }
        });
    };

    const onApprove = (data: OnApproveData, actions: any) => {
        setIsLoading(true);
        setError(null);
        // IMPORTANT: In a production environment, you should capture the order on your server
        // to securely validate the payment. This ensures the correct amount was paid.
        return actions.order.capture().then((details: any) => {
            console.log('Payment successful. Details:', details);
            handleSuccessfulPayment();
        }).catch((err: any) => {
            console.error('Error capturing payment:', err);
            setError("There was an error processing your payment. This can sometimes happen with sandbox accounts. Please check your PayPal sandbox account's balance and notification settings, then try again.");
            setIsLoading(false);
        });
    };

    const onError = (err: any) => {
        console.error('PayPal Checkout onError', err);
        setError('A PayPal error occurred. This could be due to your sandbox account setup. Please check your browser console for more details and verify your sandbox seller account can receive payments.');
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-10"><Loader2 className="h-6 w-6 animate-spin" /></div>
    }

    return (
        <>
            {error && (
                <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive mb-2">
                    <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <p>{error}</p>
                </div>
            )}
            <PayPalButtons
                style={{ layout: 'vertical', label: 'pay' }}
                forceReRender={[tier, error]}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onError}
                onClick={() => setError(null)}
            />
        </>
    );
}
