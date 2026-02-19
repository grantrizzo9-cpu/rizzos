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
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm"></div>
          <div className="container relative z-10 mx-auto text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Infrastructure as Income
            </h1>
            <p className="mx-auto mt-6 max-w-[700px] text-lg text-muted-foreground md:text-xl">
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

        {/* Features Section */}
        <section id="features" className="w-full bg-card py-12 md:py-24">
          <div className="container">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-4xl">The High-Income Affiliate Stack</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to build, scale, and monetize.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Card key={feature.title} className="flex flex-col">
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
                    <CardTitle className="flex items-center gap-2 font-headline">
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

        {/* OpenSRS & Transparency Section */}
        <section className="w-full py-12 md:py-24">
          <div className="container grid items-center gap-8 md:grid-cols-2">
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
            <div className="relative h-80 rounded-lg bg-card p-6">
              <div className="flex flex-col items-center justify-center h-full">
                <p className="font-mono text-sm text-muted-foreground">
                  [Domain Pipeline: ACTIVE]
                </p>
                <div className="font-mono text-green-400 text-lg my-4">
                  CLIENT.COM &lt;--&gt; OpenSRS &lt;--&gt; Firebase Hosting
                </div>
                 <p className="font-mono text-sm text-muted-foreground">
                  [Status: All systems operational]
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
