
'use client';

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function DisclaimerPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="container max-w-4xl px-4 sm:px-6 py-12 md:py-24">
          <h1 className="font-headline text-4xl font-bold mb-8 text-accent">Earnings Disclaimer</h1>
          <div className="prose space-y-4">
            <p>Host Pro Ai provides tools and a platform for affiliate marketing. Any earnings or income statements, or earnings or income examples, are only estimates of what we think you could earn. There is no assurance you'll do as well.</p>
            <p>Where specific income figures are used and attributed to an individual or business, those persons or businesses have earned that amount. There is no assurance you'll do as well. Any and all claims or representations as to income earnings on this web site are not to be considered as average earnings.</p>
            <p>There can be no assurance that any prior successes, or past results, as to income earnings, can be used as an indication of your future success or results. Monetary and income results are based on many factors. We have no way of knowing how well you will do, as we do not know you, your background, your work ethic, or your business skills or practices.</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
