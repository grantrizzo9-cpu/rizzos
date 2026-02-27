
'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { pricingTiers, type PricingTier } from "@/lib/site";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const getAffiliatePlanIndex = (username: string | undefined | null): number => {
    if (!username) {
        return pricingTiers.length - 1;
    }

    const mockAffiliates: { [key: string]: string } = {
        'hostproai': 'Diamond',
        'premium_user': 'Premium',
        'pro_user': 'Pro',
    };

    const planName = mockAffiliates[username.toLowerCase()] || 'Pro';
    const planIndex = pricingTiers.findIndex(t => t.name === planName);
    return planIndex > -1 ? planIndex : pricingTiers.length - 1;
};

export function PricingClientPage() {
    const { user } = useAuth();
    const searchParams = useSearchParams();
    const ref = searchParams.get('ref');
    const signupHref = ref ? `/signup?ref=${ref}` : '/signup';
    
    let visibleTiers: PricingTier[] = pricingTiers;

    if (!user) {
        const affiliatePlanIndex = getAffiliatePlanIndex(ref);
        visibleTiers = pricingTiers.slice(0, affiliatePlanIndex + 1);
    }

    return (
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
    );
}
