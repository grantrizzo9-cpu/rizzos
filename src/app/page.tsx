import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Zap, Cpu, DollarSign } from "lucide-react";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const features = [
  {
    icon: Zap,
    title: "NVMe Edge Hosting",
    description: "Enterprise-grade infrastructure that delivers sub-second load times, giving your sites a critical SEO and user experience advantage.",
    image: PlaceHolderImages.find(img => img.id === 'nvme-speed'),
  },
  {
    icon: Cpu,
    title: "Integrated GenAI Studio",
    description: "Go from idea to deployment in minutes. Generate SEO-optimized articles, ad copy, and even entire niche sites with our Gemini-powered tools.",
    image: PlaceHolderImages.find(img => img.id === 'ai-studio'),
  },
  {
    icon: DollarSign,
    title: "75% Daily Payouts",
    description: "Turn essential infrastructure into a high-velocity income stream. We pay out a market-leading 70-75% recurring commission every 24 hours.",
    image: PlaceHolderImages.find(img => img.id === 'daily-payouts'),
  },
];

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-40">
           {heroImage && (
            <Image
              src={heroImage.imageUrl}
              alt={heroImage.description}
              fill
              className="object-cover z-0"
              data-ai-hint={heroImage.imageHint}
              priority
            />
          )}
          <div className="absolute inset-0 bg-black/60"></div>
          <div className="container px-4 sm:px-6 relative z-10 mx-auto text-center text-white">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Infrastructure as Income
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-neutral-200 md:text-xl">
              A specialized SaaS platform for high-income affiliate marketers.
              We fused enterprise-grade hosting with AI creation tools and a 75% daily payout program.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/signup">Start Your 3-Day Trial</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full bg-background py-12 md:py-24">
            <div className="container px-4 text-center">
                <h2 className="font-headline text-4xl font-bold tracking-tighter text-primary sm:text-5xl">The problem is, you're paying for infrastructure.</h2>
                <p className="mx-auto mt-4 max-w-[600px] text-lg text-muted-foreground md:text-xl">With Host Pro Ai, you get paid by it.</p>
            </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full bg-secondary py-12 md:py-24">
          <div className="container px-4 sm:px-6">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">The High-Income Affiliate Stack</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to build, scale, and monetize.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col bg-card shadow-md transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                   {feature.image && (
                    <div className="relative h-48 w-full">
                      <Image
                        src={feature.image.imageUrl}
                        alt={feature.image.description}
                        fill
                        className="object-cover rounded-t-lg"
                        data-ai-hint={feature.image.imageHint}
                      />
                    </div>
                  )}
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline text-accent">
                      <feature.icon className="h-6 w-6 text-primary" />
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Why Us Section */}
        <section id="why-us" className="w-full bg-background py-12 md:py-24">
          <div className="container max-w-4xl px-4 sm:px-6 mx-auto">
              <div className="space-y-6 text-lg">
                  <h2 className="font-headline text-4xl font-bold text-accent">Why Host Pro Ai Is The Ultimate Platform for Ambitious Marketers</h2>
                  <p className="text-muted-foreground">In the fast-paced world of affiliate marketing, success is no longer about just promoting a product; it’s about building a sustainable, scalable business that generates predictable income. Host Pro Ai was born from a simple yet powerful observation: the most successful affiliates treat their business like a portfolio of assets, not a series of one-off promotions. We've built an entire ecosystem designed to empower this modern approach, providing you with three core pillars of success: revolutionary daily cashflow, unparalleled technological advantage, and a force-multiplying AI content engine.</p>
                  <p className="text-muted-foreground">We've meticulously engineered every facet of our platform to remove friction, accelerate your growth, and maximize your earning potential. Forget the old rules of waiting months for payouts or spending weeks on content creation. We are here to provide you with the infrastructure, the tools, and the financial velocity to dominate your niches and build a true digital empire. This isn't just another hosting platform; it's a paradigm shift in how affiliate marketing is done. It's your unfair advantage.</p>
                  
                  <h3 className="font-headline text-3xl font-bold text-accent pt-6">The Daily Payout Revolution: Your Growth</h3>
                  <p className="text-muted-foreground">Cashflow is the lifeblood of any business. In traditional affiliate marketing, this lifeblood is slowed to a trickle. You make a sale today and wait 30, 60, or even 90 days for your commission. This is a massive drag on your ability to scale. It’s like trying to win a race with the parking brake on. You can’t reinvest your earnings into new ad campaigns, you can’t quickly double down on a winning strategy, and you can’t scale your operations with confidence. Your own success is held hostage by archaic payment schedules.</p>
                  <p className="text-muted-foreground">Host Pro Ai demolishes this barrier with our revolutionary daily payout system. When you generate a commission, you don't wait. We pay you your industry-leading 70-75% cut every single day, directly to your PayPal account. This isn't just a feature; it's a fundamental change in your business's financial DNA. It transforms your earnings from a static, future promise into a dynamic, daily-compounding growth engine. Every single day, your previous day's success directly funds the next. Your ad campaigns become self-sustaining. You can test new niches, keywords, and traffic sources with unprecedented speed, using the house's money. This concept is known as cashflow velocity, and we provide you with the highest velocity in the industry. While your competitors are waiting for their monthly check to clear, you’ve already reinvested your capital 30 times over, creating an ever-widening gap they simply cannot bridge.</p>

                  <h3 className="font-headline text-3xl font-bold text-accent pt-6">We are so confident in the power of our platform that we want you to experience it firsthand with virtually no risk</h3>
                  <p className="text-muted-foreground">We’ve designed a unique trial that gives you full, unrestricted access to the power of Host Pro Ai. To secure your dedicated, high-performance NVMe server slot and prevent abuse, we simply ask for a one-time activation fee equivalent to a single day's pricing for your chosen plan. That’s it. Once activated, your next three days are completely on us.</p>
                  <p className="text-muted-foreground">This isn't a watered-down, feature-limited trial. You get the full experience. Deploy a website, test the sub-second load times, and put our AI Content Studio through its paces. Generate articles, create ad copy, and see for yourself the sheer velocity you can achieve. And here's the best part: your affiliate link is active from the very first moment. If you refer someone during your 3-day trial, you start earning your 70% daily commission immediately. It's entirely possible to have your initial activation fee paid back and be in profit before your trial even ends. This is your opportunity to validate the platform, understand its power, and start building your income stream from day one.</p>

                  <h3 className="font-headline text-3xl font-bold text-accent pt-6">The Ultimate AI Co-Pilot for Niche Dominance</h3>
                  <p className="text-muted-foreground">Content is the engine of affiliate marketing, but it's also the biggest bottleneck. Quality content takes time, research, and expertise. Or, at least, it used to. Our integrated AI Studio, powered by Google's Gemini, is your personal on-demand marketing agency, ready to turn your ideas into high-performance content across multiple formats.</p>
                  <p className="text-muted-foreground">Our AI features are tiered to grow with you. Starting with the Starter Plan, you unlock our Basic AI Tools, perfect for crafting high-converting ad copy that grabs attention. As you move to the Bronze Plan, you gain access to a powerful suite of Article, Blog, and Website Creation tools, allowing you to build entire niche sites from the ground up in record time. Our higher-tier plans give you the full, unrestricted power of the content suite.</p>
                  <p className="text-muted-foreground">But the true game-changer awaits on our Diamond Plan: AI Video Generation. Video is the most engaging medium online, but it's also the most resource-intensive to create. Our tool solves this. It can transform an article into a structured video script or generate new video concepts from a simple prompt, giving you the ability to dominate high-engagement platforms like YouTube and TikTok without ever needing to hire a video editor or scriptwriter. This is how you achieve true content velocity—being everywhere your audience is, with quality content tailored to each platform, produced at a scale your competitors can only dream of.</p>
              </div>
          </div>
        </section>

        {/* OpenSRS & Transparency Section */}
        <section className="w-full bg-secondary py-12 md:py-24">
          <div className="container px-4 sm:px-6 grid items-center gap-8 md:grid-cols-2">
            <div>
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">Transparent & Reliable Foundation</h2>
              <p className="mt-4 text-muted-foreground">
                We're built on industry-leading technology. Our domain fulfillment is powered by the OpenSRS registrar pipeline, one of the world's largest and most trusted domain providers. This ensures seamless, reliable domain management for you and your referrals.
              </p>
              <ul className="mt-6 space-y-4">
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Rock-Solid DNS</h3>
                    <p className="text-muted-foreground">Fast, secure, and reliable domain routing for maximum uptime.</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-semibold">Automated Provisioning</h3>
                    <p className="text-muted-foreground">Firebase Hosting integration means your sites are provisioned instantly and securely.</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="relative flex h-80 items-center justify-center rounded-lg bg-background p-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <p className="text-sm text-muted-foreground">Domain fulfillment powered by</p>
                    <p className="text-5xl font-bold font-headline tracking-widest text-foreground/80">OpenSRS</p>
                    <p className="text-sm text-muted-foreground">A Tucows Company</p>
                </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
