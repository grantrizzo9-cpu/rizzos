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
import { Loader2, Film, Clapperboard } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  topic: z.string().min(10, 'Please enter a topic at least 10 characters long.'),
  targetAudience: z.string().min(5, 'Please describe the target audience.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function VideoScriptCreatorPage() {
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
      toast({
        title: 'Script Generated!',
        description: 'Your video script has been successfully created.',
      });
    } catch (error) {
      console.error('Error generating script:', error);
      toast({
        title: 'Error Generating Script',
        description: error instanceof Error ? error.message : 'An unknown error occurred. Please try again.',
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
          <CardTitle>AI Video Script Writer</CardTitle>
          <CardDescription>
            Generate a complete, structured script for your next marketing video.
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
                        placeholder="e.g., 'Why NVMe hosting is essential for e-commerce in 2024'"
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
                        placeholder="e.g., 'Shopify store owners, digital marketers'"
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
                  <Film className="mr-2 h-4 w-4" />
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
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Writing your script...</p>
            </div>
          )}
          {!isLoading && generatedScript && (
            <div className="space-y-6 text-sm prose prose-sm max-w-none">
              <h3 className="font-bold text-lg text-primary">{generatedScript.scriptTitle}</h3>
              
              <div>
                  <h4 className="font-semibold">Introduction:</h4>
                  <p className="text-muted-foreground">{generatedScript.introduction}</p>
              </div>

              <div>
                  <h4 className="font-semibold">Main Points:</h4>
                  <ul className="list-disc list-inside space-y-2">
                      {generatedScript.mainPoints.map((point, index) => (
                          <li key={index}>
                              <strong>{point.heading}:</strong> <span className="text-muted-foreground">{point.content}</span>
                          </li>
                      ))}
                  </ul>
              </div>

              <div>
                  <h4 className="font-semibold">Conclusion:</h4>
                  <p className="text-muted-foreground">{generatedScript.conclusion}</p>
              </div>
              
               <div>
                  <h4 className="font-semibold">Call to Action:</h4>
                  <p className="text-muted-foreground">{generatedScript.callToAction}</p>
              </div>
            </div>
          )}
           {!isLoading && !generatedScript && (
             <Alert variant="default">
                <Clapperboard className="h-4 w-4" />
                <AlertTitle>Ready to create?</AlertTitle>
                <AlertDescription>
                    Enter a topic on the left to generate your first video script.
                </AlertDescription>
            </Alert>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
