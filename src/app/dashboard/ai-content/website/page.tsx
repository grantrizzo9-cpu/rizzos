'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  generateWebsiteJson,
} from '@/ai/flows/website-generator';
import { generateHtmlForWebsite } from '@/lib/website-html-generator';
import { saveWebsite } from '@/lib/firestore';
import { themes } from '@/lib/data';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import { useDomains } from '@/contexts/domains-provider';
import { Loader2, Wand2, Eye, UploadCloud } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  niche: z.string().min(5, 'Please describe your niche in at least 5 characters.'),
  themeName: z.string({
    required_error: 'Please select a theme.',
  }),
  domainName: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function WebsiteBuilderPage() {
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPublished, setIsPublished] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { domains } = useDomains();
  const verifiedDomains = domains.filter(d => d.status === 'verified');


  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      niche: '',
      themeName: 'Midnight Glow',
      domainName: '',
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
    setGeneratedHtml(null);
    setIsPublished(false);
    try {
      // 1. Generate the JSON content from the AI
      const jsonContent = await generateWebsiteJson({
        niche: values.niche,
        username: user.username,
        domainName: values.domainName,
      });

      // 2. Find the selected theme
      const selectedTheme = themes.find(t => t.name === values.themeName);
      if (!selectedTheme) {
        throw new Error('Selected theme not found.');
      }

      // 3. Generate the final HTML
      const html = generateHtmlForWebsite(
        jsonContent,
        selectedTheme,
        user.username
      );
      setGeneratedHtml(html);
    } catch (error) {
      console.error('Error generating website:', error);
      toast({
        title: 'Error Generating Website',
        description: 'Failed to generate the website content. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handlePublish = async () => {
    if (!generatedHtml || !user?.uid) {
      toast({ title: 'Error', description: 'No website content to publish.', variant: 'destructive'});
      return;
    }
    setIsLoading(true);
    try {
      const selectedThemeName = form.getValues('themeName');
      const websiteId = await saveWebsite(user.uid, generatedHtml, selectedThemeName);
      setIsPublished(true);
      toast({
        title: 'Website Published!',
        description: `Your new site is saved with ID: ${websiteId}`,
      });
    } catch (error) {
       console.error('Error publishing website:', error);
       toast({ title: 'Error Publishing', description: 'Could not save website to database.', variant: 'destructive'});
    } finally {
        setIsLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>1-Click Website Generator</CardTitle>
          <CardDescription>
            Generate a complete, themed affiliate site with your referral link built-in.
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
                      <Input placeholder="e.g., 'Cold brew coffee makers'" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="domainName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Domain Name (Optional)</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={verifiedDomains.length === 0}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a verified domain" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {verifiedDomains.map(domain => (
                          <SelectItem key={domain.id} value={domain.name}>
                            {domain.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                        Use one of your verified domains for branding. If left blank, a fictional brand will be created.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="themeName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visual Theme</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a theme" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {themes.map(theme => (
                          <SelectItem key={theme.name} value={theme.name}>
                            {theme.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading && !generatedHtml ? (
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

      <Card className="lg:col-span-3 min-h-[700px] flex flex-col">
        <CardHeader>
          <CardTitle>Generated Website</CardTitle>
          <CardDescription>Your AI-generated website preview will appear here.</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col">
          {isLoading && !generatedHtml && (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
                <p className="text-muted-foreground">Generating content & building your site...</p>
              </div>
            </div>
          )}
          {generatedHtml && (
            <div className="flex flex-col flex-grow space-y-4">
              <Tabs defaultValue="preview" className="w-full flex-grow flex flex-col">
                <div className="flex justify-between items-center">
                    <TabsList>
                        <TabsTrigger value="preview"><Eye className="mr-2"/>Preview</TabsTrigger>
                        <TabsTrigger value="html">{'</>'}</TabsTrigger>
                    </TabsList>
                    <Button onClick={handlePublish} disabled={isLoading || isPublished} size="sm">
                        {isLoading && generatedHtml ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                        {isPublished ? 'Published' : 'Publish'}
                    </Button>
                </div>
                <TabsContent value="preview" className="flex-grow mt-4">
                  <iframe
                    srcDoc={generatedHtml}
                    className="w-full h-full border rounded-md bg-white"
                    title="Generated Website Preview"
                    sandbox="allow-scripts allow-popups allow-same-origin"
                  />
                </TabsContent>
                <TabsContent value="html" className="relative mt-4 flex-grow">
                     <pre className="bg-muted text-muted-foreground rounded-lg p-4 text-xs overflow-auto h-full max-h-[700px]">
                        <code>{generatedHtml}</code>
                    </pre>
                </TabsContent>
              </Tabs>
               {isPublished && (
                 <Alert>
                    <UploadCloud className="h-4 w-4" />
                    <AlertTitle>Site Saved!</AlertTitle>
                    <AlertDescription>
                        Your website has been saved. You can access it from your dashboard in the future. (Feature coming soon).
                    </AlertDescription>
                </Alert>
               )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
