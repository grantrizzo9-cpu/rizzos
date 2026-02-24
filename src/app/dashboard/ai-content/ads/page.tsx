"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateMarketingAdCopy } from '@/ai/flows/generate-marketing-ad-copy-flow';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const formSchema = z.object({
  productName: z.string().min(3, "Product name must be at least 3 characters."),
  targetAudience: z.string().min(10, "Target audience description is too short."),
  keyBenefits: z.string().min(10, "Please list at least one key benefit."),
  callToAction: z.string().min(3, "Call to action is too short."),
  platform: z.enum(['Facebook', 'Instagram', 'X', 'TikTok', 'LinkedIn', 'YouTube']),
});

type FormValues = z.infer<typeof formSchema>;

// A generic type to hold the generated ad data, adaptable to different AI flow outputs
type GeneratedAd = {
    headline: string;
    bodyText: string;
    callToActionPhrase: string;
    hashtags: string[];
    emojis: string[];
};

export default function AdStudioPage() {
  const [generatedAd, setGeneratedAd] = useState<GeneratedAd | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const adImage = PlaceHolderImages.find(img => img.id === 'ad-studio-placeholder');


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: '',
      targetAudience: '',
      keyBenefits: '',
      callToAction: 'Learn More',
      platform: 'Instagram',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setGeneratedAd(null);
    try {
      // Using generateMarketingAdCopy as a diagnostic step
      const result = await generateMarketingAdCopy({
        productDescription: values.productName,
        targetAudience: values.targetAudience,
        keyFeaturesBenefits: values.keyBenefits.split('\n'),
        callToAction: values.callToAction,
        platform: values.platform,
        adLength: 'Medium', // Hardcode a reasonable default
      });

      // Adapt the result to the UI's expected format
      setGeneratedAd({
          headline: result.headline,
          bodyText: result.bodyCopy, // Map bodyCopy to bodyText
          callToActionPhrase: result.callToActionPhrase,
          hashtags: result.hashtags,
          emojis: result.emojis,
      });

    } catch (error) {
      console.error('Error generating ad:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate the ad script. Please try again.',
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
          <CardTitle>Social Media Ad Studio</CardTitle>
          <CardDescription>Generate high-converting ad copy and images for any platform.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField name="productName" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Product/Service Name</FormLabel><FormControl><Input placeholder="e.g., NVMe Edge Hosting" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="targetAudience" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Target Audience</FormLabel><FormControl><Input placeholder="e.g., SaaS founders, e-commerce store owners" {...field} /></FormControl><FormMessage /></FormItem>
              )} />
              <FormField name="keyBenefits" control={form.control} render={({ field }) => (
                <FormItem><FormLabel>Key Benefits (one per line)</FormLabel><FormControl><Textarea placeholder="e.g., Sub-second load times\nImproved SEO ranking\n99.9% uptime" {...field} rows={3} /></FormControl><FormMessage /></FormItem>
              )} />
               <div className="grid grid-cols-2 gap-4">
                <FormField name="callToAction" control={form.control} render={({ field }) => (
                    <FormItem><FormLabel>Call to Action</FormLabel><FormControl><Input placeholder="e.g., Sign Up Now" {...field} /></FormControl><FormMessage /></FormItem>
                )} />
                <FormField control={form.control} name="platform" render={({ field }) => (
                    <FormItem><FormLabel>Platform</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select a platform" /></SelectTrigger></FormControl><SelectContent><SelectItem value="Facebook">Facebook</SelectItem><SelectItem value="Instagram">Instagram</SelectItem><SelectItem value="X">X (Twitter)</SelectItem><SelectItem value="TikTok">TikTok</SelectItem><SelectItem value="LinkedIn">LinkedIn</SelectItem><SelectItem value="YouTube">YouTube</SelectItem></SelectContent></Select><FormMessage /></FormItem>
                )} />
               </div>
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Generate Ad Creative
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Generated Ad Creative</CardTitle>
          <CardDescription>Your AI-generated ad will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {generatedAd && adImage && (
            <div className="space-y-4">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg border">
                    <Image src={adImage.imageUrl} alt={adImage.description} layout="fill" objectFit="cover" data-ai-hint={adImage.imageHint}/>
                </div>
                <div className="bg-muted p-4 rounded-lg space-y-3">
                    <h3 className="font-bold font-headline">{generatedAd.headline}</h3>
                    <p className="text-sm whitespace-pre-wrap">{generatedAd.bodyText}</p>
                    <div className="text-sm font-bold text-primary">{generatedAd.callToActionPhrase}</div>
                    <div className="flex flex-wrap gap-2">
                        {generatedAd.emojis.map((emoji, i) => <span key={i}>{emoji}</span>)}
                    </div>
                    <div className="text-xs text-muted-foreground">{generatedAd.hashtags.join(' ')}</div>
                </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
