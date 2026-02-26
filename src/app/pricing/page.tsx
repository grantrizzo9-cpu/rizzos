"use client";

import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { pricingTiers, type PricingTier } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";


// Mock function to get affiliate's plan index. In a real app, this would be a DB lookup.
const getAffiliatePlanIndex = (username: string | undefined | null): number => {
    if (!username) {
        // Default for direct visitors (no ref link): show all plans.
        return pricingTiers.length - 1;
    }

    // Mock affiliate plans.
    const mockAffiliates: { [key: string]: string } = {
        'hostproai': 'Diamond',
        'starter_user': 'Starter',
        'bronze_user': 'Bronze',
        'silver_user': 'Silver',
        'gold_user': 'Gold',
        'platinum_user': 'Platinum',
    };

    const planName = mockAffiliates[username.toLowerCase()] || 'Gold'; // Default if affiliate not in mock list
    const planIndex = pricingTiers.findIndex(t => t.name === planName);
    return planIndex > -1 ? planIndex : pricingTiers.length - 1;
};

export default function PricingPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');
    const signupHref = ref ? `/signup?ref=${ref}` : '/signup';
    
    let visibleTiers: PricingTier[] = pricingTiers;

    // If a user is not logged in, we check for a referral code to filter plans.
    if (!user) {
        const affiliatePlanIndex = getAffiliatePlanIndex(ref);
        visibleTiers = pricingTiers.slice(0, affiliatePlanIndex + 1);
    }
    // If a user is logged in, they are either an affiliate or an admin,
    // and they will be redirected to the /dashboard/upgrade page, so this page's
    // filtering is primarily for new, prospective customers.


  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <section className="container px-4 sm:px-6 py-12 md:py-24">
            <div className="mx-auto mb-12 max-w-3xl text-center">
                <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
                Find Your Edge. Start Earning Daily.
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                Pay a one-time activation fee to start your 3-day free trial. After the trial, your daily plan fee is covered by the platform's 30% share from just two of your referrals, putting you in profit mode immediately.
                </p>
            </div>

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
                        <Button asChild className="w-full">
                            <Link href={user ? '/dashboard/upgrade' : signupHref}>
                                {user ? 'Manage in Dashboard' : 'Sign Up & Get Started'}
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
                ))}
            </div>

            <div className="mt-12 text-center text-muted-foreground">
                <p><strong>Commission Structure:</strong> All plans start at a 70% recurring daily commission rate. <br /> Automatically upgrade to <strong>75%</strong> upon reaching 10 active referrals.</p>
            </div>
        </section>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}