"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Loader2 } from "lucide-react";
import { pricingTiers } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PricingPage() {
  const { user, activateAccount } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingTierId, setLoadingTierId] = useState<string | null>(null);

  const handleActivation = (tierId: string, tierName: string) => {
    // If user is not logged in, redirect to sign up
    if (!user) {
        router.push('/signup');
        return;
    }

    // If user is already paid, do nothing
    if (user.isPaid) {
        router.push('/dashboard');
        return;
    }

    setIsLoading(true);
    setLoadingTierId(tierId);

    // Simulate payment processing
    setTimeout(() => {
        activateAccount();
        toast({
            title: "Account Activated!",
            description: `Your ${tierName} plan is now active. Welcome aboard!`,
        });
        router.push('/dashboard');
        setIsLoading(false);
        setLoadingTierId(null);
    }, 1500);
  }

  const getButtonContent = (tierId: string) => {
    if (isLoading && loadingTierId === tierId) {
      return (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      );
    }
    if (user) {
      return user.isPaid ? 'Go to Dashboard' : 'Start 3-Day Trial';
    }
    return 'Sign Up to Start';
  };


  return (
    <>
      <Header />
      <main className="flex-1">
        <section className="container px-4 sm:px-6 py-12 md:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl">
              Find Your Edge. Start Earning Daily.
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              All plans are billed daily in AUD. Start with a 3-day trial by covering just the first day's activation fee to secure your NVMe slot.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingTiers.map((tier) => (
              <Card key={tier.id} className={cn("flex flex-col", tier.isPopular && "border-primary ring-2 ring-primary")}>
                {tier.isPopular && (
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
                  <Button
                    className="w-full"
                    onClick={() => handleActivation(tier.id, tier.name)}
                    disabled={isLoading}
                  >
                    {getButtonContent(tier.id)}
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
      <Footer />
    </>
  );
}
