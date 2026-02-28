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

const faqs = [
  {
    question: "How do the daily payments work?",
    answer: "Our payment system is designed for speed and transparency. At the end of each 24-hour cycle, our system calculates the recurring commissions you've earned from all your active referrals. We then automatically send your 65% or 70% commission directly to the payout account you have on file. There's no minimum payout threshold."
  },
  {
    question: "How does the pricing and trial work?",
    answer: "We use a simple, transparent daily subscription model with no long-term contracts. There is no traditional \"free trial.\" Your subscription begins with your first daily payment. Our model is designed to make you profitable quickly: the platform's 30% share from just two referrals on the same daily plan as you is enough to cover your own daily subscription cost. This means you can be in profit mode with just two sales."
  },
  {
    question: "What can I do in my affiliate dashboard?",
    answer: "Your dashboard is your mission control center. It provides a real-time overview of your business. You can track key metrics like daily earnings, total earnings, and the number of active referrals. Your unique affiliate link, based on your username, is always visible for easy copying and sharing. The dashboard also features charts to visualize your earnings trends and referral growth over time, along with a detailed table of your recent referrals and their status."
  },
  {
    question: "What are the different AI tools and who gets them?",
    answer: "Our AI studio features are tiered to provide increasing value. The Starter plan gives you our powerful AI Ad Copy generator. The Pro plan unlocks the AI Blog and Website Creation tools. The ultimate tool, AI Video Generation, is exclusively available for our Premium plan members, allowing them to create engaging video scripts and content effortlessly."
  },
  {
    question: "How does the commission bump to 70% work?",
    answer: "It's simple and automatic. All members start at a generous 65% recurring daily commission rate. Once you reach the milestone of having 25 active referrals, our system automatically upgrades your account to the 70% commission tier. This is a permanent upgrade for the lifetime of your account, significantly boosting your daily income."
  },
  {
    question: "Is there a limit to how much I can earn?",
    answer: "Absolutely not. Your earning potential is uncapped. The more customers you refer, the more you earn, every single day. With our scalable infrastructure and recurring commission model, your income grows directly in line with your marketing efforts. We provide the tools and the platform; you provide the ambition."
  }
];


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
          <Accordion type="multiple" className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem value={`item-${index}`} key={index}>
                <AccordionTrigger className="text-lg text-left hover:no-underline">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-base text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
