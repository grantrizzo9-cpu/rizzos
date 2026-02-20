"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateNicheSiteContentIdeas, type GenerateNicheSiteContentIdeasOutput } from '@/ai/flows/generate-niche-site-content-ideas';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2, Lightbulb, Sitemap } from 'lucide-react';

const formSchema = z.object({
  niche: z.string().min(5, 'Please describe your niche in at least 5 characters.'),
  targetDemographic: z.string().min(5, 'Please describe your target demographic.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function WebsiteBuilderPage() {
  const [generatedIdeas, setGeneratedIdeas] = useState<GenerateNicheSiteContentIdeasOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      targetDemographic: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedIdeas(null);
    try {
      const result = await generateNicheSiteContentIdeas({ 
        niche: values.niche,
        targetDemographic: values.targetDemographic
      });
      setGeneratedIdeas(result);
    } catch (error) {
      console.error('Error generating website ideas:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate website ideas. Please try again.',
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
          <CardTitle>Niche Site Idea Generator</CardTitle>
          <CardDescription>
            Get content ideas and a structural outline for your next niche affiliate website.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="niche"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Niche Topic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Eco-friendly dog toys'"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetDemographic"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Demographic</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Millennial pet owners in urban areas'"
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
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Ideas
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Generated Content Plan</CardTitle>
          <CardDescription>Your AI-generated site plan will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {generatedIdeas && (
            <div className="space-y-6">
                <div>
                    <h3 className="font-semibold font-headline flex items-center gap-2 mb-3">
                        <Lightbulb className="h-5 w-5 text-primary"/>
                        Key Content Ideas
                    </h3>
                    <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                        {generatedIdeas.contentIdeas.map((idea, index) => (
                            <li key={index}>{idea}</li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold font-headline flex items-center gap-2 mb-3">
                        <Sitemap className="h-5 w-5 text-primary"/>
                        Site Outline
                    </h3>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted p-4 rounded-lg font-mono text-xs">
                        {generatedIdeas.siteOutline}
                    </div>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
