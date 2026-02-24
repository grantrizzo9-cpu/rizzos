"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { pricingTiers } from "@/lib/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/auth-provider";
import { useRouter } from "next/navigation";
import { PayPalCheckoutButton } from "@/components/paypal/paypal-checkout-button";

export default function PricingPage() {
  const { user } = useAuth();
  const router = useRouter();

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
                  <div className="w-full">
                    {user && !user.isPaid ? (
                        <PayPalCheckoutButton tier={tier} />
                    ) : (
                      <Button
                        className="w-full"
                        onClick={() => router.push(user ? '/dashboard' : '/signup')}
                      >
                        {user ? 'Go to Dashboard' : 'Sign Up to Start'}
                      </Button>
                    )}
                  </div>
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
