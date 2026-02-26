
'use client';

import { notFound, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { strategyArticles } from "@/lib/site";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";


export default function ArticlePage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  
  const article = strategyArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const processedContent = useMemo(() => {
    if (!article) return "";
    let content = article.content;
    
    if (slug === 'connecting-your-domain') {
      const cnameValue = `your-username.hostproai.com`;
      const cnameHtml = `<code class="bg-muted p-1 rounded font-mono">${cnameValue}</code>`;
      content = content.replace(/\[USER_CNAME_VALUE\]/g, cnameHtml);

      const dnsCnameImage = PlaceHolderImages.find(img => img.id === 'dns-cname');
      const imageUrl = dnsCnameImage ? dnsCnameImage.imageUrl : 'https://placehold.co/800x300/e2e8f0/2d3748/png?text=Image%20Not%20Found';

      const imageHtml = `
       <div class="my-4 p-2 border border-border rounded-lg bg-muted">
            <img src="${imageUrl}" alt="DNS CNAME record example" class="rounded-md w-full" data-ai-hint="dns cname"/>
            <p class="text-xs text-center p-2 text-muted-foreground">Example of adding a CNAME record for your domain.</p>
       </div>`;
      content = content.replace(/\[DNS_IMAGE_PLACEHOLDER\]/g, imageHtml);
    }
    
    return content;
  }, [article, slug]);

  const image = PlaceHolderImages.find(img => img.id === article.image);

  return (
    <>
      <Header />
      <main className="flex-1">
        <article className="container max-w-4xl px-4 sm:px-6 py-12 md:py-24">
          <div className="space-y-4 text-center">
            <h1 className="font-headline text-4xl font-extrabold tracking-tighter lg:text-5xl text-accent">
              {article.title}
            </h1>
            <p className="text-muted-foreground md:text-xl">
              {article.description}
            </p>
          </div>
          {image && (
            <div className="relative my-8 h-96 w-full rounded-lg overflow-hidden">
              <Image
                src={image.imageUrl}
                alt={image.description}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            </div>
          )}
          <div
            className="prose mx-auto mt-8 max-w-none prose-h2:font-headline prose-h3:font-headline prose-p:text-muted-foreground prose-a:text-primary prose-strong:text-foreground prose-h2:text-accent prose-h3:text-accent"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />

          {slug === 'connecting-your-domain' && (
            <div className="mt-12 text-center">
              <Button asChild size="lg">
                <Link href="/dashboard">
                  Continue to your Dashboard
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
