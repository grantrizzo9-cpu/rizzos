"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateAffiliateWebsite } from '@/ai/flows/generate-affiliate-website';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import { Loader2, Wand2, Clipboard, FileCode, BookUser, Palette } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  niche: z.string().min(5, 'Please describe your niche in at least 5 characters.'),
  targetDemographic: z.string().min(5, 'Please describe your target demographic.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function WebsiteBuilderPage() {
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      targetDemographic: '',
    },
  });

  async function onSubmit(values: FormValues) {
    if (!user?.username) {
        toast({
            title: 'Error',
            description: 'Could not find your affiliate username. Please ensure you are logged in.',
            variant: 'destructive',
        });
        return;
    }
    setIsLoading(true);
    setGeneratedCode(null);
    try {
      const result = await generateAffiliateWebsite({ 
        niche: values.niche,
        targetDemographic: values.targetDemographic,
        affiliateUsername: user.username,
      });
      setGeneratedCode(result.pageComponent);
    } catch (error) {
      console.error('Error generating website:', error);
      toast({
        title: 'Error',
        description: 'Failed to generate the website code. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const copyToClipboard = () => {
    if (!generatedCode) return;
    navigator.clipboard.writeText(generatedCode);
    toast({
      title: "Code Copied!",
      description: "The website component code has been copied to your clipboard.",
    });
  };

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>AI Website Builder</CardTitle>
          <CardDescription>
            Generate a complete, single-page affiliate site with your referral link built-in.
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
                        placeholder="e.g., 'Cold brew coffee makers'"
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
                        placeholder="e.g., 'Tech-savvy young professionals'"
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
                Generate Website
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="min-h-[400px]">
        <CardHeader>
          <CardTitle>Generated Website</CardTitle>
          <CardDescription>Your AI-generated website code and instructions will appear here.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          {generatedCode && (
            <Tabs defaultValue="code" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="code"><FileCode className="mr-2"/>Code</TabsTrigger>
                <TabsTrigger value="instructions"><BookUser className="mr-2"/>Instructions</TabsTrigger>
                <TabsTrigger value="customization"><Palette className="mr-2"/>Customize</TabsTrigger>
              </TabsList>
              <TabsContent value="code" className="relative mt-4">
                <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-7 w-7" onClick={copyToClipboard}>
                    <Clipboard className="h-4 w-4"/>
                </Button>
                <pre className="bg-muted text-muted-foreground rounded-lg p-4 text-xs overflow-x-auto max-h-[500px]">
                  <code>
                    {generatedCode}
                  </code>
                </pre>
              </TabsContent>
              <TabsContent value="instructions" className="text-sm text-muted-foreground p-2 space-y-4">
                <div>
                    <h4 className="font-semibold text-foreground mb-2">How to Use This Code</h4>
                    <p>This generated code is a complete Next.js page. Here’s how to launch it:</p>
                    <ol className="list-decimal list-inside space-y-2 mt-2 bg-muted p-4 rounded-lg">
                        <li>Open your terminal and run `npx create-next-app@latest my-affiliate-site` to start a new project.</li>
                        <li>Follow the prompts to create your Next.js app (using TypeScript and Tailwind CSS is recommended).</li>
                        <li>Navigate into your new project: `cd my-affiliate-site`.</li>
                        <li>Open `src/app/page.tsx` and replace its entire content with the code you copied from the "Code" tab.</li>
                        <li>Run `npm run dev` to start the development server. Your new affiliate site will be live at `http://localhost:3000`.</li>
                    </ol>
                </div>
                <div>
                    <h4 className="font-semibold text-foreground mb-2">Deploying Your Site</h4>
                    <p>Once you are ready, you can deploy your site to services like Vercel or Netlify for free to make it available to the world.</p>
                </div>
              </TabsContent>
               <TabsContent value="customization" className="text-sm text-muted-foreground p-2 space-y-4">
                 <div>
                    <h4 className="font-semibold text-foreground mb-2">Easy Customization</h4>
                    <p>The generated code includes comments to help you make changes:</p>
                    <ul className="list-disc list-inside space-y-2 mt-2 bg-muted p-4 rounded-lg">
                        <li><strong>Text:</strong> Find the text you want to change directly in the JSX and edit it. For example, look for `<h1>...</h1>` for headlines.</li>
                        <li><strong>Images:</strong> Look for the `next/image` component and change the `src` URL. You can use a free service like Unsplash or upload your own images.</li>
                        <li><strong>Colors:</strong> The code uses Tailwind CSS utility classes. To change the main color, you can search for classes like `bg-primary` or `text-primary` and replace them with other Tailwind color classes (e.g., `bg-blue-600`).</li>
                    </ul>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
