
'use client';

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe, ArrowLeft, Info, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Loader2, Link2 } from 'lucide-react';
import { useDomains, type DnsRecord } from "@/contexts/domains-provider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";

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
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { getDomainById, verifyDomainDns, deployWebsiteToDomain, generatedWebsites, loadingWebsites } = useDomains();
    const domainId = typeof params.domain === 'string' ? params.domain : '';

    const [isVerifying, setIsVerifying] = useState(false);
    const [selectedWebsite, setSelectedWebsite] = useState<string>('');
    const [isDeploying, setIsDeploying] = useState(false);
    
    const domain = getDomainById(domainId);

    useEffect(() => {
        if (!domain) {
            // maybe redirect or show a not found message after a delay
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

    const handleDeploy = () => {
        if (!selectedWebsite) {
            toast({ title: "No website selected", description: "Please choose a website to deploy.", variant: "destructive"});
            return;
        }
        setIsDeploying(true);
        setTimeout(() => {
            deployWebsiteToDomain(domain.id, selectedWebsite);
            toast({ title: "Deployment Successful!", description: `Website successfully linked to ${domain.name}.` });
            setIsDeploying(false);
        }, 1000);
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
                            Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records. If your registrar uses '@' for the root domain, use that for the 'Host' field of the A records.
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
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Step 2: Check DNS Propagation</h3>
                        <p className="text-muted-foreground mb-4">
                            After adding the records, it can take some time (from a few minutes to an hour) for the changes to take effect globally. You can use a trusted third-party tool like DNS Checker to see the live status of your domain's propagation around the world.
                        </p>
                        <Button asChild variant="outline">
                            <a href={`https://dnschecker.org/#A/${domain.name}`} target="_blank" rel="noopener noreferrer">
                                Check DNS Status with dnschecker.org <ExternalLink className="ml-2"/>
                            </a>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2"><Link2 />Deploy a Website</CardTitle>
                    <CardDescription>Once your domain is verified, select a generated website from your collection to deploy to this domain.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                        <Select onValueChange={setSelectedWebsite} defaultValue={selectedWebsite} disabled={!allRecordsFound}>
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
                            Deploy
                        </Button>
                    </div>
                </CardContent>
                <CardFooter>
                    {domain.deployedWebsiteId && (
                         <Alert variant="default">
                            <Info className="h-4 w-4" />
                            <AlertTitle>Live Website</AlertTitle>
                            <AlertDescription>
                               Website <span className="font-mono text-xs">{domain.deployedWebsiteId}</span> is currently deployed to this domain. Re-deploying will overwrite the current site.
                            </AlertDescription>
                        </Alert>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}
