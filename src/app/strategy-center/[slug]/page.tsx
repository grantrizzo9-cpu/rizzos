
'use client';

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useMemo, use } from "react";
import { ArrowRight } from "lucide-react";
import { strategyArticles } from "@/lib/site";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export default function ArticlePage({ params }: ArticlePageProps) {
  // Per Next.js, we should unwrap the params promise with `use`.
  const { slug } = use(params);
  const { user } = useAuth();
  
  const article = strategyArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  const processedContent = useMemo(() => {
    if (!article) return "";
    let content = article.content;
    
    if (slug === 'connecting-your-domain') {
      const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;
      const cnameHtml = `<code class="bg-muted p-1 rounded font-mono">${cnameValue}</code>`;
      content = content.replace(/\[USER_CNAME_VALUE\]/g, cnameHtml);
    }
    
    return content;
  }, [article, user, slug]);

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
