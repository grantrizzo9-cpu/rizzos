
'use client';

import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQPage() {
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <div className="container max-w-3xl px-4 sm:px-6 py-12 md:py-24">
          <div className="text-center mb-12">
            <h1 className="font-headline text-4xl font-bold mb-4 text-accent">Frequently Asked Questions</h1>
            <p className="text-lg text-muted-foreground">Have questions? We have answers. Here are some of the most common queries we receive.</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">How do the daily payments work?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Our daily payment system is designed for maximum velocity. Every 24 hours, our system calculates the recurring commissions you've earned from all your active referrals in the previous period. We then automatically send your 70% or 75% commission directly to the PayPal email address you have on file. There's no minimum payout threshold. You earn it today, you get it tomorrow. This allows you to immediately reinvest your earnings back into your business.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">How does the 3-day free trial work?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                To start your trial, you pay a one-time activation fee equal to one day of your chosen plan's cost. This secures your server resources and goes 100% to the platform owner. After that, you get a 3-day free trial to use all the tools and start referring others. Once your trial ends, your daily subscription cost is covered by the platform's 30% share from just two referrals on the same plan as you—meaning you only ever have to pay once to be in profit.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">What can I do in my affiliate dashboard?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Your dashboard is your mission control center. It provides a real-time overview of your business. You can track key metrics like daily earnings, total earnings, and the number of active referrals. Your unique affiliate link, based on your username, is always visible for easy copying and sharing. The dashboard also features charts to visualize your earnings trends and referral growth over time, along with a detailed table of your recent referrals and their status.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">What are the different AI tools and who gets them?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Our AI studio features are tiered. The Starter plan gives you AI Ad Copy generation. The Bronze plan and up unlocks the powerful AI Blog, Article, and Website Creation tools. The ultimate tool, AI Video Generation, is exclusively available for our Diamond plan members, allowing them to create engaging video scripts and content effortlessly. All other plans (Silver, Gold, Platinum) have access to the full AI content suite except for video generation.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg">How does the commission bump to 75% work?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                It's simple and automatic. All members start at a generous 70% recurring daily commission rate. Once you reach the milestone of having 10 active referrals, our system automatically upgrades your account to the 75% commission tier. This is a permanent upgrade for the lifetime of your account, significantly boosting your daily income.
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-6">
              <AccordionTrigger className="text-lg">Is there a limit to how much I can earn?</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground">
                Absolutely not. Your earning potential is uncapped. The more customers you refer, the more you earn, every single day. With our scalable infrastructure and recurring commission model, your income grows directly in line with your marketing efforts. We provide the tools and the platform; you provide the ambition.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
