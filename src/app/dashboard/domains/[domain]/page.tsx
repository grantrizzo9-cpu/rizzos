
'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Loader2, Link2, Clock, Info } from 'lucide-react';
import { useDomains, type DnsRecord } from "@/contexts/domains-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { generateDeploymentLog } from '@/ai/flows/generate-deployment-log';


// --- Typewriter Component for Deployment Log ---
const Typewriter = ({ text }: { text: string; }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText(''); // Reset on new text
    if (text) {
      let i = 0;
      const intervalId = setInterval(() => {
        const chunkSize = Math.random() > 0.9 ? Math.floor(Math.random() * 10) + 1 : 1;
        i += chunkSize;
        if (i > text.length) {
            i = text.length;
        }
        setDisplayedText(text.substring(0, i));
        
        if (i >= text.length) {
          clearInterval(intervalId);
        }
      }, 25);
      return () => clearInterval(intervalId);
    }
  }, [text]);

  return <pre className="bg-black text-green-400 font-mono text-sm p-4 rounded-lg whitespace-pre-wrap overflow-y-auto max-h-[60vh]">{displayedText}<span className="animate-pulse">_</span></pre>;
};


const getStatusIcon = (status: DnsRecord['status']) => {
    switch (status) {
        case 'verifying':
            return <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />;
        case 'found':
            return <CheckCircle2 className="h-4 w-4 text-green-500" />;
        case 'missing':
            return <AlertCircle className="h-4 w-4 text-destructive" />;
        default:
            return null;
    }
}

export default function ManageDomainPage() {
    const params = useParams();
    const { toast } = useToast();
    const { getDomainById, verifyDomainDns, deployWebsiteToDomain, generatedWebsites, loadingWebsites } = useDomains();
    const domainId = typeof params.domain === 'string' ? params.domain : '';

    const [isVerifying, setIsVerifying] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<string>('');
    const [isDeploying, setIsDeploying] = useState(false);
    
    const [isGeneratingLog, setIsGeneratingLog] = useState(false);
    const [deploymentLogContent, setDeploymentLogContent] = useState<string | null>(null);
    const [publishedDomain, setPublishedDomain] = useState<string>('');
    
    const domain = getDomainById(domainId);

    useEffect(() => {
        if (!domain) {
            return;
        }
        setSelectedWebsite(domain.deployedWebsiteId || '');
    }, [domain]);
    

    if (!domain) {
        return (
             <div className="space-y-8 max-w-4xl mx-auto">
                <Card>
                    <CardHeader><CardTitle>Domain Not Found</CardTitle></CardHeader>
                    <CardContent><p>The specified domain could not be found. It may have been deleted.</p>
                     <Button variant="ghost" asChild className="mt-4">
                        <Link href="/dashboard/domains"><ArrowLeft className="mr-2"/> Back to Hosting Management</Link>
                    </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    const handleVerify = async () => {
        setIsVerifying(true);
        await verifyDomainDns(domain.id);
        setIsVerifying(false);
    };

    const handleDeploy = async () => {
        if (!selectedWebsite) {
            toast({ title: "No website selected", description: "Please choose a website to deploy.", variant: "destructive"});
            return;
        }
        setIsDeploying(true);
        setDeploymentLogContent(null);
        setIsGeneratingLog(true);
        setPublishedDomain(domain.name);


        try {
            deployWebsiteToDomain(domain.id, selectedWebsite);
            
            toast({ 
                title: "Deployment Initiated", 
                description: `Now generating a deployment log for ${domain.name}. This may take a moment.` 
            });

            const result = await generateDeploymentLog({ domainName: domain.name });
            setIsGeneratingLog(false);
            setDeploymentLogContent(result.logContent);

        } catch (error) {
           console.error('Error deploying website or generating log:', error);
           toast({ title: 'Error During Deployment', description: 'Could not complete the deployment or generate the deployment log.', variant: 'destructive'});
           setIsGeneratingLog(false);
        } finally {
            setIsDeploying(false);
        }
    };
    
    const allRecordsFound = domain.dnsRecords.every(r => r.status === 'found');

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <Button variant="ghost" asChild>
                <Link href="/dashboard/domains"><ArrowLeft className="mr-2"/> Back to Hosting Management</Link>
            </Button>

            {allRecordsFound ? (
                 <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300 [&>svg]:text-green-600">
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertTitle className="font-bold">Domain Connected!</AlertTitle>
                    <AlertDescription>
                       All DNS records are pointing to our servers correctly. You can now deploy one of your generated websites to this domain.
                    </AlertDescription>
                </Alert>
            ) : (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Action Required</AlertTitle>
                    <AlertDescription>
                       One or more DNS records are missing or incorrect. Please configure them at your domain registrar and click "Verify DNS" to check again.
                    </AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle className="font-headline text-2xl flex items-center gap-2">
                                <Globe />
                                {domain.name}
                            </CardTitle>
                            <CardDescription>Follow the steps below to connect your domain.</CardDescription>
                        </div>
                        <Button variant="outline" onClick={handleVerify} disabled={isVerifying}>
                            {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2"/>}
                             Verify DNS
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Step 1: Configure Your DNS Records</h3>
                        <p className="text-muted-foreground mb-4">
                            Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following <strong>three</strong> DNS records. If your registrar uses '@' for the root domain, use that for the 'Host' field of the A records.
                        </p>
                        <div className="space-y-3 rounded-lg bg-muted p-4 border">
                           {domain.dnsRecords.map((record, index) => (
                               <div key={index}>
                                   <div className="flex items-center justify-between font-mono text-sm">
                                        <div>
                                            <p className="font-bold">{record.type} Record ({index + 1}/{domain.dnsRecords.length}):</p>
                                            <p><strong>Host:</strong> {record.host}</p>
                                            <p><strong>Value:</strong> {record.value}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-sans">
                                            {getStatusIcon(record.status)}
                                            <span className="capitalize">{record.status}</span>
                                        </div>
                                   </div>
                                   {index < domain.dnsRecords.length - 1 && <hr className="border-border my-3"/>}
                               </div>
                           ))}
                        </div>
                        {!allRecordsFound && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Important Tip!</AlertTitle>
                                <AlertDescription>
                                    <p>If your `www` CNAME record isn't working, it's likely because a conflicting `A` record for `www` already exists. Most registrars create this automatically.</p>
                                    <p className="mt-2 font-bold">You must delete any `A` record with the host `www` before the `CNAME` record will work correctly.</p>
                                </AlertDescription>
                            </Alert>
                        )}
                        <Alert variant="default" className="mt-4">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Why are there three records?</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside space-y-2">
                                    <li>The <strong>two 'A' records</strong> point your main domain (the part without 'www') directly to our server's physical IP addresses for reliability.</li>
                                    <li>The <strong>one 'CNAME' record</strong> tells the internet that your 'www' subdomain is just an alias for your main domain.</li>
                                </ul>
                                <p className="mt-2">This setup ensures that visitors arrive at your site correctly whether they type <strong>{domain.name}</strong> or <strong>www.{domain.name}</strong> into their browser.</p>
                            </AlertDescription>
                        </Alert>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Step 2: Wait for DNS Propagation</h3>
                        <p className="text-muted-foreground mb-4">
                           After adding the records, it can take time (from a few minutes to several hours) for the changes to take effect globally. Clicking "Verify DNS" too soon might show errors even if your setup is correct.
                        </p>
                         <Alert>
                            <Clock className="h-4 w-4" />
                            <AlertTitle>Be Patient!</AlertTitle>
                            <AlertDescription>
                                DNS is not instant. If you just saved your records, please wait at least 30-60 minutes before clicking "Verify DNS". You can use a third-party tool like DNS Checker to see the live status of your domain's propagation around the world.
                            </AlertDescription>
                        </Alert>
                        <Button asChild variant="outline" className="mt-4">
                            <a href={`https://dnschecker.org/#A/${domain.name}`} target="_blank" rel="noopener noreferrer">
                                Check DNS Status with dnschecker.org <ExternalLink className="ml-2"/>
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Link2 />Step 3: Deploy a Website</CardTitle>
                    <CardDescription>Once your domain is verified, select a generated website from your collection to deploy to this domain.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                        <Select onValueChange={setSelectedWebsite} defaultValue={selectedWebsite} disabled={!allRecordsFound || isDeploying}>
                            <SelectTrigger>
                                <SelectValue placeholder={loadingWebsites ? "Loading websites..." : "Select a generated website"} />
                            </SelectTrigger>
                            <SelectContent>
                                {loadingWebsites ? (
                                    <div className="flex items-center justify-center p-4">
                                        <Loader2 className="h-4 w-4 animate-spin"/>
                                    </div>
                                ) : (
                                    generatedWebsites.map(site => (
                                        <SelectItem key={site.id} value={site.id}>
                                            {site.themeName} - (ID: ...{site.id.slice(-6)})
                                        </SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                        <Button onClick={handleDeploy} disabled={!allRecordsFound || !selectedWebsite || isDeploying}>
                           {isDeploying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Globe className="mr-2"/> }
                           {isDeploying ? 'Deploying...' : 'Deploy & View Log'}
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    {domain.deployedWebsiteId && (
                         <div className="text-sm text-muted-foreground pt-4">
                           Currently, website <span className="font-mono text-xs">{domain.deployedWebsiteId}</span> is linked to this domain. Re-deploying will link a different site.
                         </div>
                    )}
                </CardFooter>
            </Card>
            
            <Dialog open={isGeneratingLog || !!deploymentLogContent} onOpenChange={(isOpen) => { if (!isOpen) { setDeploymentLogContent(null); setIsGeneratingLog(false); }}}>
                <DialogContent className="max-w-3xl bg-black border-gray-700">
                  <DialogHeader>
                    <DialogTitle className="text-white font-mono">Deployment Log: {publishedDomain}</DialogTitle>
                    <DialogDescription className="text-gray-400 font-mono">
                      This is a simulated visualization of the backend deployment process. The real deployment is running on Google's servers. This log helps you see the steps involved. Global propagation can take 5-10 minutes.
                    </DialogDescription>
                  </DialogHeader>
                   {isGeneratingLog ? (
                    <div className="flex flex-col items-center justify-center h-48 text-green-400 font-mono">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <p className="mt-4">Contacting AI... Generating deployment sequence...</p>
                    </div>
                  ) : (
                    deploymentLogContent && <Typewriter text={deploymentLogContent} />
                  )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

    