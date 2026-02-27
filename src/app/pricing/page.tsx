
import { Suspense } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { PricingClientPage } from './pricing-client-page';

export default function PricingPage() {
  return (
    <>
      <Suspense fallback={<div className="h-14" />}>
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

            <Suspense fallback={<div className="text-center p-8">Loading pricing plans...</div>}>
                <PricingClientPage />
            </Suspense>

            <div className="mt-12 text-center text-muted-foreground">
                <p><strong>Commission Structure:</strong> All plans start at a 70% recurring daily commission rate. <br /> Automatically upgrade to <strong>75%</strong> upon reaching 10 active referrals.</p>
            </div>
        </section>
      </main>
      <Suspense fallback={<div className="h-24" />}>
        <Footer />
      </Suspense>
    </>
  );
}
