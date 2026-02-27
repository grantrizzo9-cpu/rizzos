
'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Loader2, Link2, Info, ShieldCheck } from 'lucide-react';
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
    
    const allRecordsFound = domain.status === 'verified';

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <Button variant="ghost" asChild>
                <Link href="/dashboard/domains"><ArrowLeft className="mr-2"/> Back to Hosting Management</Link>
            </Button>
            
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
                         <Button asChild variant="outline">
                            <a href={`https://www.sslshopper.com/ssl-checker.html#hostname=${domain.name}`} target="_blank" rel="noopener noreferrer">
                                Check SSL Status <ExternalLink className="ml-2"/>
                            </a>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {!allRecordsFound ? (
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Action Required: Connect Your Domain</AlertTitle>
                            <AlertDescription>
                                Your domain is not yet connected. Add all the required DNS records at your domain provider (e.g., GoDaddy, Namecheap), then click the verification button below. It can take some time for DNS changes to propagate.
                            </AlertDescription>
                        </Alert>
                    ) : (
                         <Alert>
                            <ShieldCheck className="h-4 w-4" />
                            <AlertTitle>Domain Connected! SSL is Provisioning.</AlertTitle>
                            <AlertDescription>
                                 <p>Great news! Your DNS records are correctly configured. If you are seeing a "Not Secure" warning in your browser, please be patient.</p>
                                 <p className="mt-2">A free SSL certificate is being provisioned automatically. This process can take up to a few hours. Once complete, your site will be secure.</p>
                            </AlertDescription>
                        </Alert>
                    )}


                    <div>
                        <h3 className="font-semibold text-lg mb-2">Step 1: Add DNS Records</h3>
                        <p className="text-muted-foreground mb-4">
                            Log in to your domain registrar and add the following records exactly as they appear. One of the CNAME records is a unique verification code for your SSL certificate.
                        </p>
                        <div className="space-y-3 rounded-lg bg-muted p-4 border">
                           {domain.dnsRecords.map((record, index) => (
                               <div key={index}>
                                   <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between font-mono text-sm">
                                        <div className="break-all">
                                            <p className="font-bold">{record.type} Record:</p>
                                            <p><strong className="text-muted-foreground font-medium">Host:</strong> {record.host}</p>
                                            <p><strong className="text-muted-foreground font-medium">Value:</strong> {record.value}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs font-sans mt-2 sm:mt-0 sm:ml-4 flex-shrink-0">
                                            {getStatusIcon(record.status)}
                                            <span className="capitalize">{record.status}</span>
                                        </div>
                                   </div>
                                   {index < domain.dnsRecords.length - 1 && <hr className="border-border my-3"/>}
                               </div>
                           ))}
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Step 2: Verify Configuration</h3>
                         <p className="text-muted-foreground mb-4">
                           After adding the records in your registrar, click the button below to check the connection. Note: DNS changes can sometimes take time to propagate across the internet.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Button variant="outline" onClick={handleVerify} disabled={isVerifying}>
                                {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <RefreshCw className="mr-2"/>}
                                 {isVerifying ? 'Verifying...' : 'Verify DNS Records'}
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Link2 />Step 3: Deploy a Website</CardTitle>
                    <CardDescription>Once your domain is verified, select a generated website from your collection to make it live.</CardDescription>
                </CardHeader>
                <CardContent>
                    {!allRecordsFound && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertTitle>Verification Pending</AlertTitle>
                            <AlertDescription>
                                You must successfully verify your DNS configuration in Step 2 before you can deploy a website.
                            </AlertDescription>
                        </Alert>
                    )}
                    {allRecordsFound && !loadingWebsites && generatedWebsites.length === 0 && (
                        <Alert className="mb-6">
                            <Info className="h-4 w-4" />
                            <AlertTitle>No Websites Found</AlertTitle>
                            <AlertDescription>
                                You haven't created any websites yet. Go to the <Link href="/dashboard/ai-content/website" className="font-bold hover:underline">AI Website Builder</Link> to generate one.
                            </AlertDescription>
                        </Alert>
                    )}
                     {allRecordsFound && generatedWebsites.length > 0 && (
                        <Alert className="mb-6 border-primary text-primary-foreground">
                            <Info className="h-4 w-4 text-primary" />
                            <AlertTitle className="font-bold text-primary">Final Step: Deploy Your Site</AlertTitle>
                            <AlertDescription className="text-primary-foreground/90">
                                Your DNS is connected! Now, choose a website from the dropdown below and click 'Deploy' to make it live on the internet.
                            </AlertDescription>
                        </Alert>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                        <Select onValueChange={setSelectedWebsite} defaultValue={selectedWebsite} disabled={!allRecordsFound || isDeploying || loadingWebsites || generatedWebsites.length === 0}>
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
