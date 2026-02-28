
"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { DollarSign, WalletCards, Users, Wand2, BookText, Server, BookOpen, TrendingUp, Rocket } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const whyPartnerFeatures = [
  {
    icon: DollarSign,
    title: "Generous 70-75% Commissions",
    description: "Start at a 70% recurring commission rate. Refer 10 active customers to permanently unlock our top-tier 75% rate.",
  },
  {
    icon: WalletCards,
    title: "Reliable Daily Payouts",
    description: "No more waiting for your money. We pay out your commissions reliably every day directly to your configured payout provider.",
  },
  {
    icon: Users,
    title: "Permanent Referrals",
    description: "When you refer a user, they are yours for life. You earn commission on their recurring subscription payments, year after year.",
  },
  {
    icon: Wand2,
    title: "Integrated AI Tools",
    description: "Our subscriptions include access to powerful AI tools designed to help you and your referrals build and grow businesses faster.",
  },
  {
    icon: BookText,
    title: "Exclusive Marketing Guides",
    description: "Access a library of expert, written guides. The more you upgrade, the more advanced strategies you unlock to boost your sales.",
  },
  {
    icon: Server,
    title: "Reliable Web Hosting",
    description: "Offer your referrals fast, secure, and high-performance web hosting that they can depend on, increasing your conversion rates.",
  },
];

const incomePathSteps = [
    {
        title: "Start Your 3-Day Trial",
        description: "Choose your plan and pay a simple one-time activation fee to begin your 3-day, full-featured trial.",
    },
    {
        title: "Start with 2 Referrals & Enter Profit Mode",
        description: "Every new customer is automatically assigned their first two referrals. The platform's 30% share from these two referrals is designed to cover your own daily plan cost, making you profitable from day one.",
    },
    {
        title: "Earn 70-75% Recurring Daily Profit",
        description: "You earn 70% of every recurring daily payment from all your referrals. After 10 referrals, this increases to 75%. Payouts are sent automatically to your payment provider.",
    },
];

const marketingGuides = [
  {
    icon: BookOpen,
    title: "Starter Guides",
    description: "Learn the fundamentals of affiliate marketing, SEO basics, and social media promotion.",
  },
  {
    icon: TrendingUp,
    title: "Pro Guides",
    description: "Dive into content creation, email marketing, and web analytics to grow your audience.",
  },
  {
    icon: Rocket,
    title: "Premium Guides",
    description: "Master advanced SEO, PPC advertising, conversion optimization, and strategic partnerships to scale your income.",
  },
];

const testimonials = [
  {
    quote: "The recurring revenue model has completely changed my financial outlook. Rizzos Ai's 75% commission is just unbeatable.",
    name: "Sarah J.",
    role: "Super Affiliate",
    avatar: "https://picsum.photos/seed/sarah/100/100",
  },
  {
    quote: "The combination of web hosting and AI tools is genius. It's an incredibly easy sell, and my audience loves it. My earnings have skyrocketed.",
    name: "Mike R.",
    role: "Tech Blogger",
    avatar: "https://picsum.photos/seed/mike/100/100",
  },
  {
    quote: "The affiliate dashboard is a dream. All the stats I need are right there. This is the most transparent and profitable program I've ever been a part of.",
    name: "Emily C.",
    role: "Digital Marketer",
    avatar: "https://picsum.photos/seed/emily/100/100",
  },
];

const faqs = [
  {
    question: "How does the 3-day paid activation trial work?",
    answer: "To ensure commitment and prevent abuse, new customers pay a one-time activation fee equal to one day's cost of their selected plan. This fee activates a 3-day, full-featured trial, after which the account automatically transitions to a recurring daily payment plan."
  },
  {
    question: "How do I get my first 2 referrals?",
    answer: "To help you become profitable as quickly as possible, every new customer is automatically assigned their first 2 referrals by the platform. The commissions from these two referrals are designed to cover the cost of your own daily plan, putting you in profit mode from day one."
  },
  {
    question: "How does the referral tracking work?",
    answer: "When you sign up, you get a unique affiliate link. Share this link, and our system automatically tracks anyone who signs up through it, permanently linking them to your account. You can monitor all your referral activity in your affiliate dashboard in real-time.",
  },
  {
    question: "How and when do I get paid?",
    answer: "We process all commission payouts on a reliable daily schedule. All your earned commissions (70%, rising to 75% after 10 referrals) from recurring payments are automatically sent to the payout account you have on file. There are no minimum payout thresholds.",
  },
  {
    question: "What am I selling?",
    answer: "You're selling a high-value subscription that combines two essential business needs: blazing-fast, reliable NVMe web hosting and a powerful suite of integrated AI content creation tools. It's the ultimate all-in-one package for anyone looking to build and grow an online presence.",
  },
  {
    question: "Is there a limit to how much I can earn?",
    answer: "Absolutely not. Your earning potential is uncapped. The more customers you refer, the more you earn, every single day. We provide a scalable platform so your income can grow as large as your marketing efforts.",
  },
];

export function HomePageClient() {
  const incomePathImage = PlaceHolderImages.find(img => img.id === 'income-path');
  const affiliateDashboardImage = PlaceHolderImages.find(img => img.id === 'affiliate-dashboard');
  const aiStudioImage = PlaceHolderImages.find(img => img.id === 'ai-studio');
  
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref');
  const signupHref = ref ? `/signup?ref=${ref}` : '/signup';

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-background">
          <div className="container px-4 sm:px-6 mx-auto text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Earn 70%-75% Daily Commissions with<br/> <span className="text-primary">AI-Powered Hosting</span>
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Get started today and build a reliable daily income stream. Our automated system handles everything.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href={signupHref}>Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">Learn More</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Why Partner Section */}
        <section id="features" className="w-full bg-muted py-12 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Why Partner with Rizzos Ai?</h2>
              <p className="mt-4 text-muted-foreground">We've built the ultimate platform for affiliates to thrive.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {whyPartnerFeatures.map((feature) => (
                <Card key={feature.title} className="flex flex-col text-center items-center bg-card shadow-sm border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <feature.icon className="h-6 w-6" />
                     </div>
                    <CardTitle className="font-headline text-xl">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Your Simple Path to Daily Income Section */}
        <section id="income-path" className="w-full bg-background py-12 md:py-24">
            <div className="container grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
                <div className="space-y-8">
                    <div className="space-y-3">
                        <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Your Simple Path to Daily Income</h2>
                        <p className="text-muted-foreground">In just three easy steps, you can be on your way to earning reliable, daily income.</p>
                    </div>
                    <ul className="space-y-6">
                        {incomePathSteps.map((step, index) => (
                             <li key={index} className="flex gap-4">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">{index + 1}</div>
                                <div className="space-y-1">
                                    <h3 className="font-semibold text-lg">{step.title}</h3>
                                    <p className="text-muted-foreground">{step.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
                 {incomePathImage && (
                    <div className="relative flex h-full min-h-[400px] items-center justify-center">
                         <Image
                            src={incomePathImage.imageUrl}
                            alt={incomePathImage.description}
                            width={600}
                            height={600}
                            className="object-cover rounded-lg"
                            data-ai-hint={incomePathImage.imageHint}
                        />
                    </div>
                 )}
            </div>
        </section>

        {/* New Feature Section 1: Affiliate Dashboard */}
        <section id="affiliate-dashboard" className="w-full bg-muted py-12 md:py-24">
            <div className="container grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
                {affiliateDashboardImage && (
                    <div className="relative order-last lg:order-first flex h-full min-h-[400px] items-center justify-center">
                         <Image
                            src={affiliateDashboardImage.imageUrl}
                            alt={affiliateDashboardImage.description}
                            width={600}
                            height={600}
                            className="object-cover rounded-lg"
                            data-ai-hint={affiliateDashboardImage.imageHint}
                        />
                    </div>
                 )}
                 <div className="space-y-4">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Real-Time Affiliate Dashboard</h2>
                    <p className="text-muted-foreground md:text-lg">Track your success with a powerful, intuitive dashboard. See your earnings, referrals, and growth metrics in real-time. Your unique affiliate link is always front and center, ready to be shared. Make data-driven decisions to optimize your campaigns and maximize your recurring income.</p>
                </div>
            </div>
        </section>

        {/* New Feature Section 2: AI Tools */}
        <section id="ai-tools" className="w-full bg-background py-12 md:py-24">
            <div className="container grid items-center gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
                 <div className="space-y-4">
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Integrated AI Content Studio</h2>
                    <p className="text-muted-foreground md:text-lg">Stop wrestling with content creation. Our built-in AI studio is your secret weapon. Generate high-quality blog posts, captivating ad copy, and even video scripts in minutes. Create entire niche websites with a few clicks. Our AI tools give you the content velocity you need to dominate any niche.</p>
                </div>
                 {aiStudioImage && (
                    <div className="relative flex h-full min-h-[400px] items-center justify-center">
                         <Image
                            src={aiStudioImage.imageUrl}
                            alt={aiStudioImage.description}
                            width={600}
                            height={600}
                            className="object-cover rounded-lg"
                            data-ai-hint={aiStudioImage.imageHint}
                        />
                    </div>
                 )}
            </div>
        </section>

        {/* New Section: Marketing Playbook */}
        <section id="playbook" className="w-full bg-muted py-12 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">From Beginner to Pro: Your Marketing Playbook</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">Our subscription tiers come with a tiered library of marketing guides. The higher your plan, the more you learn, and the more you earn.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {marketingGuides.map((guide) => (
                <Card key={guide.title} className="flex flex-col text-center items-center bg-card shadow-sm border border-transparent transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader>
                     <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                        <guide.icon className="h-6 w-6" />
                     </div>
                    <CardTitle className="font-headline text-xl">
                      {guide.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground text-sm">{guide.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="w-full bg-background py-12 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Trusted by Top Earners</h2>
              <p className="mt-4 text-muted-foreground">Don't just take our word for it. Here's what our affiliates are saying.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.name} className="bg-card">
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground mb-4">"{testimonial.quote}"</p>
                    <div className="flex items-center gap-4">
                      <Avatar>
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="w-full bg-muted py-12 md:py-24">
          <div className="container max-w-3xl px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="font-headline text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              <p className="text-lg text-muted-foreground">Have questions? We have answers.</p>
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
        </section>

        {/* CTA Section */}
        <section id="cta" className="w-full bg-primary py-12 md:py-20">
          <div className="container text-center text-primary-foreground px-4 sm:px-6">
            <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Ready to Start Earning?</h2>
            <p className="mt-4 mx-auto max-w-xl">Join the most profitable affiliate program in the industry and start your journey to daily income.</p>
            <div className="mt-8">
              <Button size="lg" variant="secondary" asChild>
                <Link href={signupHref}>Sign Up & Get Your Affiliate Link</Link>
              </Button>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
