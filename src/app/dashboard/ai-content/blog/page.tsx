"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateSeoBlogArticle } from '@/ai/flows/generate-seo-blog-article';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';

const formSchema = z.object({
  topic: z.string().min(10, 'Please enter a topic at least 10 characters long.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function BlogGeneratorPage() {
  const [generatedArticle, setGeneratedArticle] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedArticle(null);
    try {
      const result = await generateSeoBlogArticle({ topic: values.topic });
      setGeneratedArticle(result.articleContent);
    } catch (error) {
      console.error('Error generating article:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate the blog article. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Blog Post Generator</CardTitle>
          <CardDescription>
            Enter a topic, and our AI will generate a 500+ word, SEO-optimized blog article for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="topic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'The benefits of NVMe hosting for e-commerce websites'"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Article
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Generated Article</CardTitle>
          <CardDescription>Your AI-generated content will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {generatedArticle && (
            <div
              className="prose prose-invert max-w-none prose-sm prose-p:text-muted-foreground"
              dangerouslySetInnerHTML={{ __html: generatedArticle.replace(/\n/g, '<br />') }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
