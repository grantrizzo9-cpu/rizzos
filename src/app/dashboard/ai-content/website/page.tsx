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
import { Loader2, Wand2, Eye, Info, Globe } from 'lucide-react';
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
  const [isPublishing, setIsPublishing] = useState(false);
  const [deploymentInitiated, setDeploymentInitiated] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [publishedDomain, setPublishedDomain] = useState<string>('');
  const { toast } = useToast();
  const { user } = useAuth();
  const { domains, deployWebsiteToDomain } = useDomains();
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
    setDeploymentInitiated(false);
    setPublishedDomain('');
    try {
      const jsonContent = await generateWebsiteJson({
        niche: values.niche,
        username: user.username,
        domainName: values.domainName,
      });

      const selectedTheme = themes.find(t => t.name === values.themeName);
      if (!selectedTheme) {
        throw new Error('Selected theme not found.');
      }

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

  const handlePublishAndDeploy = async () => {
    if (!generatedHtml || !user?.uid) {
      toast({ title: 'Error', description: 'No website content to publish.', variant: 'destructive'});
      return;
    }
    if (!selectedDomain) {
      toast({ title: 'Error', description: 'Please select a domain to publish to.', variant: 'destructive'});
      return;
    }
    setIsPublishing(true);
    setDeploymentInitiated(false);
    try {
      const selectedThemeName = form.getValues('themeName');
      const websiteId = await saveWebsite(user.uid, generatedHtml, selectedThemeName);
      
      deployWebsiteToDomain(selectedDomain, websiteId);

      const domainObject = domains.find(d => d.id === selectedDomain);
      if (domainObject) {
        setPublishedDomain(domainObject.name);
      }

      setDeploymentInitiated(true);
      toast({
        title: 'Deployment Initiated',
        description: `We've started linking your website to ${domainObject?.name}. It may take a few minutes for changes to go live.`,
      });
    } catch (error) {
       console.error('Error publishing website:', error);
       toast({ title: 'Error Publishing', description: 'Could not save and deploy the website.', variant: 'destructive'});
    } finally {
        setIsPublishing(false);
    }
  };


  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <Card className="lg:col-span-2 h-fit">
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
                <TabsList>
                    <TabsTrigger value="preview"><Eye className="mr-2"/>Preview</TabsTrigger>
                    <TabsTrigger value="html">{'</>'}</TabsTrigger>
                </TabsList>
                <TabsContent value="preview" className="flex-grow mt-4">
                  <iframe
                    srcDoc={generatedHtml}
                    className="w-full h-full border rounded-md bg-white"
                    title="Generated Website Preview"
                    sandbox="allow-scripts allow-popups allow-popups-to-escape-sandbox allow-same-origin"
                  />
                </TabsContent>
                <TabsContent value="html" className="relative mt-4 flex-grow">
                     <pre className="bg-muted text-muted-foreground rounded-lg p-4 text-xs overflow-auto h-full max-h-[700px]">
                        <code>{generatedHtml}</code>
                    </pre>
                </TabsContent>
              </Tabs>
               
               <div className="border-t pt-4 space-y-4">
                 <h3 className="font-semibold">Publish to Domain</h3>
                 <div className="flex flex-col sm:flex-row gap-4">
                    <Select onValueChange={setSelectedDomain} value={selectedDomain} disabled={verifiedDomains.length === 0}>
                        <SelectTrigger>
                            <SelectValue placeholder={verifiedDomains.length === 0 ? "No verified domains" : "Select a verified domain"} />
                        </SelectTrigger>
                        <SelectContent>
                            {verifiedDomains.map(domain => (
                                <SelectItem key={domain.id} value={domain.id}>{domain.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button onClick={handlePublishAndDeploy} disabled={isPublishing || !selectedDomain}>
                        {isPublishing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Globe className="mr-2 h-4 w-4" />}
                        Publish to Domain
                    </Button>
                 </div>
                 {verifiedDomains.length === 0 && <FormDescription>You must add and verify a domain in the 'Hosting' section before you can publish.</FormDescription>}
               </div>
               
               {deploymentInitiated && publishedDomain && (
                 <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>Deployment Initiated. What's next?</AlertTitle>
                    <AlertDescription>
                        It can take <strong>5-10 minutes</strong> for your site to become live at <a href={`http://${publishedDomain}`} target="_blank" rel="noopener noreferrer" className="font-bold underline">{publishedDomain}</a>.
                        If you still see an error after 10 minutes, please re-verify your DNS settings in the 'Hosting' section.
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
