
'use client';

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { strategyArticles } from "@/lib/site";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function StrategyCenterPage() {
  const publicArticles = strategyArticles.filter(article => article.slug !== 'connecting-your-domain');
  
  return (
    <>
      <Suspense>
        <Header />
      </Suspense>
      <main className="flex-1">
        <section className="container px-4 sm:px-6 py-12 md:py-24">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tighter sm:text-5xl text-accent">
              Strategy Center
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Deep-dive marketing guides to help you scale your network and maximize your daily income.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {publicArticles.map((article) => {
              const image = PlaceHolderImages.find(img => img.id === article.image);
              return (
                <Link href={`/strategy-center/${article.slug}`} key={article.slug}>
                  <Card className="h-full overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
                    {image && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={image.imageUrl}
                          alt={image.description}
                          fill
                          className="object-cover"
                          data-ai-hint={image.imageHint}
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-headline text-xl text-accent">{article.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>{article.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
      <Suspense>
        <Footer />
      </Suspense>
    </>
  );
}
