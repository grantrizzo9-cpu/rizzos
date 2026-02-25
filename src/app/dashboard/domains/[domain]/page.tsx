'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useDomains } from '@/contexts/domains-provider';
import { useAuth } from '@/components/auth/auth-provider';
import { getWebsites, type SavedWebsite } from '@/lib/firestore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Loader2, Globe, CheckCircle, AlertCircle, Cloud, UploadCloud, Trash2, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManageDomainPage() {
    const router = useRouter();
    const params = useParams();
    const domainName = typeof params.domain === 'string' ? decodeURIComponent(params.domain) : '';

    const { user } = useAuth();
    const { domains, updateDomainStatus, deployWebsiteToDomain, deleteDomain } = useDomains();
    const { toast } = useToast();
    
    const [isLoading, setIsLoading] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isDeploying, setIsDeploying] = useState(false);

    const [userWebsites, setUserWebsites] = useState<SavedWebsite[]>([]);
    const [selectedWebsite, setSelectedWebsite] = useState<string>('');

    const domain = domains.find(d => d.name === domainName);
    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    useEffect(() => {
        if (user?.uid) {
            getWebsites(user.uid).then(setUserWebsites);
        }
    }, [user]);

    if (!domain) {
        // Can show a not found page, but redirecting is simpler for now
        useEffect(() => {
            router.push('/dashboard/domains');
        },[router]);
        return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }
    
    const handleVerify = () => {
        setIsVerifying(true);
        // This is a simulation. In a real app, this would trigger a backend check.
        setTimeout(() => {
            const isSuccess = Math.random() > 0.3; // 70% chance of success
            const newStatus = isSuccess ? 'active' : 'error';
            updateDomainStatus(domainName, newStatus);
            toast({
                title: isSuccess ? "Verification Successful!" : "Verification Failed",
                description: isSuccess ? `${domainName} is pointing to our servers.` : `We couldn't verify your DNS records. Please double-check them and try again.`,
                variant: isSuccess ? 'default' : 'destructive',
            });
            setIsVerifying(false);
        }, 1500);
    };

    const handleDeploy = () => {
        if (!selectedWebsite) {
            toast({ title: "No website selected", description: "Please choose a website to deploy.", variant: 'destructive'});
            return;
        }
        setIsDeploying(true);
        // Simulation of deployment
        setTimeout(() => {
            deployWebsiteToDomain(domainName, selectedWebsite);
            toast({
                title: "Deployment Successful!",
                description: `Your website has been deployed to ${domainName}.`
            });
            setIsDeploying(false);
        }, 2000);
    };
    
    const handleDelete = () => {
        deleteDomain(domainName);
        toast({
            title: "Domain Removed",
            description: `${domainName} has been removed from your account.`
        });
        router.push('/dashboard/domains');
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <Button variant="ghost" asChild>
                <Link href="/dashboard/domains"><ArrowLeft className="mr-2"/> Back to All Domains</Link>
            </Button>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                             <CardTitle className="font-headline text-2xl flex items-center gap-2">
                                <Globe />
                                {domain.name}
                            </CardTitle>
                            <CardDescription>Manage connection and deployment for this domain.</CardDescription>
                        </div>
                        <Badge variant={
                            domain.status === 'active' ? 'default' :
                            domain.status === 'pending' ? 'secondary' : 'destructive'
                        }>
                            {domain.status}
                        </Badge>
                    </div>
                </CardHeader>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Step 1: Configure DNS Records</CardTitle>
                    <CardDescription>
                        Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <ul className="list-none space-y-2 bg-muted p-4 rounded-lg font-mono text-sm">
                        <li><strong>Type:</strong> A | <strong>Host:</strong> @ | <strong>Value:</strong> 199.36.158.100</li>
                        <li><strong>Type:</strong> A | <strong>Host:</strong> @ | <strong>Value:</strong> 199.36.158.101</li>
                        <li><strong>Type:</strong> CNAME | <strong>Host:</strong> www | <strong>Value:</strong> {cnameValue}</li>
                    </ul>
                     <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Need Help?</AlertTitle>
                        <AlertDescription>
                          DNS changes can be tricky. For a detailed walkthrough, check out our <Link href="/dashboard/strategy-center/connecting-your-domain" className="font-bold underline">domain connection guide</Link>.
                        </AlertDescription>
                    </Alert>
                </CardContent>
                <CardFooter className="flex justify-end">
                     <Button onClick={handleVerify} disabled={isVerifying}>
                        {isVerifying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                        Verify Configuration
                    </Button>
                </CardFooter>
            </Card>
            
            <Card>
                 <CardHeader>
                    <CardTitle>Step 2: Deploy Your Website</CardTitle>
                    <CardDescription>
                       Once your domain is verified and active, choose a website you've created with the AI Website Builder to deploy it.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {domain.status === 'active' ? (
                        <div className="space-y-4">
                             {domain.websiteId ? (
                                 <Alert variant="default" className="border-primary">
                                     <Cloud className="h-4 w-4"/>
                                     <AlertTitle>A site is already deployed!</AlertTitle>
                                     <AlertDescription>
                                         Website ID <code className="bg-background p-1 rounded font-mono text-xs">{domain.websiteId}</code> is currently live on this domain. Deploying a new site will replace it.
                                     </AlertDescription>
                                 </Alert>
                             ) : null}

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Select onValueChange={setSelectedWebsite} value={selectedWebsite}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select a generated website..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {userWebsites.length > 0 ? userWebsites.map(site => (
                                            <SelectItem key={site.id} value={site.id}>
                                                {site.themeName} - (ID: ...{site.id.slice(-6)})
                                            </SelectItem>
                                        )) : <p className="p-4 text-sm text-muted-foreground">No websites found.</p>}
                                    </SelectContent>
                                </Select>
                                 <Button onClick={handleDeploy} disabled={isDeploying || !selectedWebsite} className="w-full sm:w-auto">
                                    {isDeploying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UploadCloud className="mr-2 h-4 w-4" />}
                                    Deploy Site
                                </Button>
                            </div>
                             {userWebsites.length === 0 && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4"/>
                                    <AlertTitle>No Websites Found</AlertTitle>
                                    <AlertDescription>
                                        You haven't created any websites yet. Go to the <Link href="/dashboard/ai-content/website" className="font-bold underline">Website Builder</Link> to create one first.
                                    </AlertDescription>
                                </Alert>
                            )}

                        </div>
                    ) : (
                         <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4"/>
                            <AlertTitle>Domain Not Active</AlertTitle>
                            <AlertDescription>
                                Please verify your domain configuration in Step 1 before you can deploy a website. The domain status must be "active".
                            </AlertDescription>
                        </Alert>
                    )}
                </CardContent>
            </Card>

             <Card className="border-destructive">
                <CardHeader>
                    <CardTitle>Danger Zone</CardTitle>
                    <CardDescription>
                        Removing a domain is a permanent action and cannot be undone.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4"/>
                                Remove Domain
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently remove <strong className="font-bold">{domainName}</strong> from your account. This action cannot be undone.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Yes, remove this domain</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardContent>
            </Card>
        </div>
    );
}
