
import { notFound } from "next/navigation";
import Image from "next/image";
import { strategyArticles } from "@/lib/site";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

type ArticlePageProps = {
  params: {
    slug: string;
  };
};

export async function generateStaticParams() {
  return strategyArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default function ArticlePage({ params }: ArticlePageProps) {
  const article = strategyArticles.find((a) => a.slug === params.slug);

  if (!article) {
    notFound();
  }

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
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}

    