"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateVideo } from '@/ai/flows/generate-video-from-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Film } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  prompt: z.string().min(10, 'Please enter a prompt at least 10 characters long.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function VideoCreatorPage() {
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedVideoUrl(null);
    try {
      const result = await generateVideo({ prompt: values.prompt });
      setGeneratedVideoUrl(result.videoUrl);
      toast({
        title: 'Video Generated!',
        description: 'Your video has been successfully created.',
      });
    } catch (error) {
      console.error('Error generating video:', error);
      toast({
        title: 'Error Generating Video',
        description: error instanceof Error ? error.message : 'An unknown error occurred. This can happen due to high demand. Please try again.',
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
          <CardTitle>AI Video Creator</CardTitle>
          <CardDescription>
            Bring your ideas to life. Describe a scene and our AI will generate a short video for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'A majestic dragon soaring over a mystical forest at dawn.'"
                        rows={5}
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
                Generate Video
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Generated Video</CardTitle>
          <CardDescription>Your AI-generated video will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex flex-col items-center justify-center h-64 space-y-4 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Generating video... This may take a minute or two.</p>
            </div>
          )}
          {!isLoading && generatedVideoUrl && (
            <div className="space-y-4">
               <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                 <video controls autoPlay loop className="w-full h-full bg-black">
                    <source src={generatedVideoUrl} type="video/mp4" />
                    Your browser does not support the video tag.
                 </video>
               </div>
            </div>
          )}
           {!isLoading && !generatedVideoUrl && (
             <Alert variant="default">
                <Film className="h-4 w-4" />
                <AlertTitle>Ready to create?</AlertTitle>
                <AlertDescription>
                    Enter a prompt on the left to generate your first AI video. This is a premium feature.
                </AlertDescription>
            </Alert>
           )}
        </CardContent>
      </Card>
    </div>
  );
}
