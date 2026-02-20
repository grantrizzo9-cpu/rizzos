"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateVideoScript, type GenerateVideoScriptOutput } from '@/ai/flows/generate-video-script';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Film, Mic } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const formSchema = z.object({
  topic: z.string().min(10, 'Please enter a topic at least 10 characters long.'),
  targetAudience: z.string().min(5, 'Please describe the target audience.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function VideoStudioPage() {
  const [generatedScript, setGeneratedScript] = useState<GenerateVideoScriptOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: '',
      targetAudience: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedScript(null);
    try {
      const result = await generateVideoScript({ 
        topic: values.topic,
        targetAudience: values.targetAudience 
      });
      setGeneratedScript(result);
    } catch (error) {
      console.error('Error generating video script:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate the video script. Please try again.',
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
          <CardTitle>Video Script Studio</CardTitle>
          <CardDescription>
            Generate a structured video script for your next social media hit or tutorial.
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
                    <FormLabel>Video Topic</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'How NVMe hosting boosts your SEO in 2024'"
                        rows={3}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audience</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., 'Beginner affiliate marketers'"
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
                Generate Script
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Generated Script</CardTitle>
          <CardDescription>Your AI-generated video script will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {generatedScript && (
            <div className="space-y-6 text-sm">
                <h3 className="font-bold font-headline text-lg flex items-center gap-2">
                    <Film className="h-5 w-5 text-primary"/>
                    {generatedScript.scriptTitle}
                </h3>

                <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Introduction</h4>
                    <p className="text-muted-foreground">{generatedScript.introduction}</p>
                </div>
                
                <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Main Points</h4>
                    <Accordion type="single" collapsible className="w-full">
                        {generatedScript.mainPoints.map((point, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger>{point.heading}</AccordionTrigger>
                                <AccordionContent className="whitespace-pre-wrap text-muted-foreground">
                                    {point.content}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                <div className="space-y-2">
                    <h4 className="font-semibold text-primary">Conclusion</h4>
                    <p className="text-muted-foreground">{generatedScript.conclusion}</p>
                </div>

                <div className="space-y-2 bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold flex items-center gap-2"><Mic className="h-4 w-4"/> Call to Action</h4>
                    <p className="font-bold">{generatedScript.callToAction}</p>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
