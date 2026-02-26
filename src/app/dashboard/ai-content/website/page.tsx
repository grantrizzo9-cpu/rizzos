'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  generateWebsiteJson,
} from '@/ai/flows/website-generator';
import { generateDeploymentVideo } from '@/ai/flows/generate-deployment-video';
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import { useDomains } from '@/contexts/domains-provider';
import { Loader2, Wand2, Eye, Globe, Film } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [publishedDomain, setPublishedDomain] = useState<string>('');
  
  // New state for deployment video
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [deploymentVideoUrl, setDeploymentVideoUrl] = useState<string | null>(null);

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
    setDeploymentVideoUrl(null);
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
    const domainObject = domains.find(d => d.id === selectedDomain);
    if (!domainObject) {
      toast({ title: 'Error', description: 'Please select a domain to publish to.', variant: 'destructive'});
      return;
    }

    setIsPublishing(true);
    setIsGeneratingVideo(true);
    setDeploymentVideoUrl(null);
    
    try {
      const selectedThemeName = form.getValues('themeName');
      const websiteId = await saveWebsite(user.uid, generatedHtml, selectedThemeName);
      
      deployWebsiteToDomain(domainObject.id, websiteId);
      setPublishedDomain(domainObject.name);

      toast({
        title: 'Deployment Initiated',
        description: `Now generating a live deployment log for ${domainObject.name}. This may take a moment.`,
      });

      // Generate the video
      const result = await generateDeploymentVideo({ domainName: domainObject.name });
      setDeploymentVideoUrl(result.videoUrl);

    } catch (error) {
       console.error('Error publishing website or generating video:', error);
       toast({ title: 'Error During Deployment', description: 'Could not save the website or generate the deployment log.', variant: 'destructive'});
    } finally {
        setIsPublishing(false);
        setIsGeneratingVideo(false);
    }
  };


  return (
    <>
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
                   <h3 className="font-semibold">Publish & View Deployment</h3>
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
                      <Button onClick={handlePublishAndDeploy} disabled={isPublishing || !selectedDomain || isGeneratingVideo}>
                          {isPublishing || isGeneratingVideo ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Film className="mr-2 h-4 w-4" />}
                          Publish & View Log
                      </Button>
                   </div>
                   {verifiedDomains.length === 0 && <FormDescription>You must add and verify a domain in the 'Hosting' section before you can publish.</FormDescription>}
                 </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!deploymentVideoUrl} onOpenChange={(isOpen) => !isOpen && setDeploymentVideoUrl(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Live Deployment Log: {publishedDomain}</DialogTitle>
            <DialogDescription>
              This is a visualization of the backend deployment process. Your site is now live, but global propagation can take 5-10 minutes.
            </DialogDescription>
          </DialogHeader>
          {deploymentVideoUrl && (
            <div className="relative aspect-video w-full overflow-hidden rounded-lg border mt-4">
              <video controls autoPlay loop className="w-full h-full bg-black">
                <source src={deploymentVideoUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
