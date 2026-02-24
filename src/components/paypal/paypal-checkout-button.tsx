'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import type { OnApproveData, CreateOrderData } from '@paypal/react-paypal-js';
import { useAuth } from '@/components/auth/auth-provider';
import { useToast } from '@/hooks/use-toast';
import { useReferrals } from '@/components/referrals/referral-provider';
import { type PricingTier } from '@/lib/site';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PayPalCheckoutButton({ tier }: { tier: PricingTier }) {
    const { activateAccount, user } = useAuth();
    const { activateReferral } = useReferrals();
    const { toast } = useToast();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | React.ReactNode | null>(null);
    const [{ isPending, isRejected, options: paypalOptions }] = usePayPalScriptReducer();

    const handleSuccessfulPayment = () => {
        activateAccount(tier.name);
        if (user?.email) {
          activateReferral(user.email);
        }
        toast({
            title: "Account Activated!",
            description: `Your ${tier.name} plan is now active. Welcome aboard!`,
        });
        router.push('/strategy-center/connecting-your-domain');
    };

    const handleSimulatePayment = () => {
        setIsLoading(true);
        setError(null);
        // Simulate network delay
        setTimeout(() => {
            activateAccount(tier.name);
            if (user?.email) {
              activateReferral(user.email);
            }
            setIsLoading(false);
            toast({
                title: "Account Activated!",
                description: `Your ${tier.name} plan is now active. Welcome aboard!`,
            });
            router.push('/strategy-center/connecting-your-domain');
        }, 500);
    }

    const isPayPalConfigured = paypalOptions.clientId && !paypalOptions.clientId.includes('YOUR_') && paypalOptions.clientId !== 'sb';

    const createOrder = (data: CreateOrderData, actions: any) => {
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
        return actions.order.capture().then((details: any) => {
            handleSuccessfulPayment();
        }).catch((err: any) => {
            console.error("PayPal payment capture failed. This is often a sandbox configuration issue. Full error object:", err);
            setError(
                <div>
                    <h3 className="font-bold mb-2">Payment Failed in PayPal Sandbox</h3>
                    <p className="mb-2">This is a common issue and usually means the test seller account is not set up correctly. Please check the following in your PayPal Developer Dashboard:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs">
                        <li><strong>Account Verified:</strong> Ensure your sandbox seller email address is verified.</li>
                        <li><strong>Receiving Preferences:</strong> Check that your seller account is not blocking payments.</li>
                        <li><strong>Currency Support:</strong> Make sure your seller account can accept payments in <strong>AUD</strong>.</li>
                    </ul>
                    <p className="mt-2 text-xs">For more specific details, please check the browser's developer console for the full error from PayPal.</p>
                </div>
            );
            setIsLoading(false);
        });
    };

    const onError = (err: any) => {
        const message = err.toString();
        if (message.includes('Window closed')) {
            return;
        }
        console.error('PayPal Checkout onError', err);
        setError('An unexpected error occurred with PayPal. This could be due to your sandbox account setup. Please check your browser console for more details and verify your sandbox seller account can receive payments.');
    };
    
    const onCancel = (data: Record<string, unknown>) => {
        toast({
            title: 'Payment Canceled',
            description: 'You canceled the payment process.',
            variant: 'default'
        });
    };

    if (isPending) {
        return <div className="flex justify-center items-center h-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
    }

    if (isLoading) {
        return <div className="flex justify-center items-center h-20"><Loader2 className="h-6 w-6 animate-spin" /></div>
    }


    return (
        <div className="w-full">
            <Button className="w-full" onClick={handleSimulatePayment}>
                Simulate Successful Payment
            </Button>
            
            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">
                        Or pay with
                    </span>
                </div>
            </div>

            {isRejected || !isPayPalConfigured ? (
                <div className="text-center p-3 border rounded-lg bg-destructive/10 text-destructive text-sm">
                    {isRejected ? "Could not load PayPal." : "PayPal is not configured."} Please check your Client ID or use the simulation button.
                </div>
            ) : (
                <>
                    {error && (
                        <div className="flex items-start gap-2 rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive mb-4">
                            <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                            <div>{error}</div>
                        </div>
                    )}
                    <PayPalButtons
                        style={{ layout: 'vertical', label: 'pay', color: 'black', shape: 'rect', tagline: false }}
                        forceReRender={[tier, error]}
                        createOrder={createOrder}
                        onApprove={onApprove}
                        onError={onError}
                        onCancel={onCancel}
                        onClick={() => setError(null)}
                    />
                </>
            )}
        </div>
    );
}
