
"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowUpCircle } from "lucide-react";
import { pricingTiers, type PricingTier } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { StripeCheckoutButton } from "@/components/stripe/stripe-checkout-button";
import { verifyStripeSession } from "@/ai/flows/verify-stripe-session-flow";
import { useToast } from "@/hooks/use-toast";


const getAffiliatePlanIndex = (username: string | undefined | null): number => {
    if (!username) {
        return pricingTiers.length - 1;
    }
    const mockAffiliates: { [key: string]: string } = {
        'hostproai': 'Premium',
        'pro_user': 'Pro',
        'starter_user': 'Starter',
    };
    const planName = mockAffiliates[username.toLowerCase()] || 'Pro';
    const planIndex = pricingTiers.findIndex(t => t.name === planName);
    return planIndex > -1 ? planIndex : pricingTiers.length - 1;
};

export default function UpgradePage() {
  const { user, activateAccount } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();

   useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (searchParams.get('payment_success') === 'true' && user && !user.isPaid && sessionId) {
        
        verifyStripeSession({ sessionId })
            .then(sessionInfo => {
                if (sessionInfo.status === 'paid' && sessionInfo.userId === user.uid && sessionInfo.planName) {
                    activateAccount(sessionInfo.planName);
                    toast({
                        title: "Account Activated!",
                        description: `Your ${sessionInfo.planName} plan is now active. Welcome aboard!`,
                    });
                    router.replace('/dashboard/strategy-center/connecting-your-domain');
                } else {
                     toast({ title: "Payment verification failed.", description: "There was an issue confirming your payment with Stripe.", variant: "destructive" });
                     router.replace('/dashboard/upgrade');
                }
            })
            .catch(err => {
                 console.error("Stripe verification error:", err);
                 toast({ title: "An error occurred during payment verification.", description: "Please contact support if you believe this is an error.", variant: "destructive" });
                 router.replace('/dashboard/upgrade');
            });
    }
  }, [searchParams, user, activateAccount, router, toast]);

  if (!user) {
    return null; 
  }
  
  const isAdmin = user?.email === 'rentapog@gmail.com';
  let visibleTiers: PricingTier[] = [];

  if (isAdmin) {
    visibleTiers = pricingTiers;
  } else if (user.isPaid && user.plan) {
    const currentUserPlanIndex = pricingTiers.findIndex(t => t.name === user.plan);
    
    if (currentUserPlanIndex !== -1) {
      visibleTiers = pricingTiers.slice(currentUserPlanIndex + 1);
    } else {
      visibleTiers = pricingTiers;
    }
  } else {
    const affiliatePlanIndex = getAffiliatePlanIndex(user.referrer);
    visibleTiers = pricingTiers.slice(0, affiliatePlanIndex + 1);
  }

  return (
    <div className="space-y-8">
       <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl flex items-center justify-center gap-4">
              <ArrowUpCircle className="w-10 h-10"/>
              {user?.isPaid ? "Upgrade Your Plan" : "Activate Your Plan"}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
             Choose a daily plan to get started. With just two referrals on the same plan, your own subscription is paid for, putting you in profit mode.
            </p>
        </div>
        {visibleTiers.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {visibleTiers.map((tier) => (
                  <Card key={tier.id} className={cn("flex flex-col", tier.isPopular && visibleTiers.length > 1 && "border-primary ring-2 ring-primary")}>
                    {tier.isPopular && visibleTiers.length > 1 && (
                      <div className="py-1.5 px-4 bg-primary text-center text-sm font-semibold text-primary-foreground rounded-t-lg -mt-px">
                        Most Popular
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">{tier.name}</CardTitle>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold tracking-tighter">${tier.price.toFixed(2)}</span>
                        <span className="text-muted-foreground">/ day (AUD)</span>
                      </div>
                      <CardDescription>{tier.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <ul className="space-y-3">
                        {tier.features.map((feature) => (
                          <li key={feature} className="flex items-center gap-2">
                            <Check className="h-5 w-5 text-primary" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <div className="w-full">
                        {user && <StripeCheckoutButton tier={tier} />}
                      </div>
                    </CardFooter>
                  </Card>
                ))}
            </div>
        ) : (
            user.isPaid && (
                <Card className="max-w-2xl mx-auto text-center">
                    <CardHeader>
                        <CardTitle className="font-headline">You're at the Top!</CardTitle>
                        <CardDescription>You are currently on our highest available plan.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Thank you for being a top-tier partner! There are no further upgrades available at this time.</p>
                    </CardContent>
                </Card>
            )
        )}
        <div className="mt-12 text-center text-muted-foreground">
            <p><strong>Commission Structure:</strong> All plans start at a 65% recurring daily commission rate. <br /> Automatically upgrade to <strong>70%</strong> upon reaching 25 active referrals.</p>
        </div>
    </div>
  );
}
