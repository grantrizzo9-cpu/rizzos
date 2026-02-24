"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, ArrowUpCircle, Lock } from "lucide-react";
import { pricingTiers } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { PayPalCheckoutButton } from "@/components/paypal/paypal-checkout-button";
import { Button } from "@/components/ui/button";

export default function UpgradePage() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'renntapog@gmail.com';

  const goldTierIndex = pricingTiers.findIndex(tier => tier.name === 'Gold');

  return (
    <div className="space-y-8">
       <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl flex items-center justify-center gap-4">
              <ArrowUpCircle className="w-10 h-10"/>
              {user?.isPaid ? "Upgrade Your Plan" : "Activate Your Plan"}
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              All plans are billed daily in AUD. Start with a 3-day trial by covering just the first day's activation fee to secure your NVMe slot.
            </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {pricingTiers.map((tier, index) => {
              const isNewUser = !user?.isPaid;
              // For new users, lock plans above Gold. Admins see everything.
              const isLocked = isNewUser && !isAdmin && index > goldTierIndex;

              return (
              <Card key={tier.id} className={cn("flex flex-col", tier.isPopular && !isLocked && "border-primary ring-2 ring-primary", isLocked && "bg-muted/50")}>
                {tier.isPopular && !isLocked && (
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
                        <Check className={cn("h-5 w-5", isLocked ? "text-muted-foreground" : "text-primary")} />
                        <span className={cn(isLocked && "text-muted-foreground")}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <div className="w-full">
                    {user && (
                      isLocked ? (
                         <Button disabled className="w-full">
                            <Lock className="mr-2 h-4 w-4" />
                            Activate a lower plan to unlock
                         </Button>
                      ) : (
                        <PayPalCheckoutButton tier={tier} />
                      )
                    )}
                  </div>
                </CardFooter>
              </Card>
            )})}
        </div>
        <div className="mt-12 text-center text-muted-foreground">
            <p><strong>Commission Structure:</strong> All plans start at a 70% recurring daily commission rate. <br /> Automatically upgrade to <strong>75%</strong> upon reaching 10 active referrals.</p>
        </div>
    </div>
  );
}
