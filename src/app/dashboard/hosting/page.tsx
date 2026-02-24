
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { HardDrive, ExternalLink, Globe, Loader2, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useDomains } from "@/components/domains/domain-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/components/auth/auth-provider";

type DnsStatus = 'idle' | 'checking' | 'connected' | 'error';

type DnsCheckResult = {
    type: 'A' | 'CNAME';
    host: string;
    value: string;
    status: 'ok' | 'missing' | 'mismatch';
};

export default function HostingPage() {
    const [domainInput, setDomainInput] = useState('');
    const [checkStatus, setCheckStatus] = useState<DnsStatus>('idle');
    const [checkResults, setCheckResults] = useState<DnsCheckResult[]>([]);

    const { domains, addDomain, removeDomain } = useDomains();
    const { toast } = useToast();
    const { user } = useAuth();
    
    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    const handleCheckDomain = async () => {
        if (!domainInput) return;
        setCheckStatus('checking');
        setCheckResults([]);

        // This is a simulation. A real implementation would require a backend endpoint to perform DNS lookups.
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        const requiredCnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

        if (domainInput.toLowerCase() === 'rizzosaipro.com') {
            // SIMULATE THE MISMATCH: The user's DNS is set to `rizzosaipro.hostproai.com` but the system requires a CNAME based on the username 'fde'.
            setCheckResults([
                { type: 'A', host: '@', value: '199.36.158.100', status: 'ok' },
                { type: 'A', host: '@', value: '199.36.158.101', status: 'ok' },
                { type: 'CNAME', host: 'www', value: 'rizzosaipro.hostproai.com', status: 'mismatch' },
            ]);
            setCheckStatus('error');
            toast({
                title: "CNAME Value Mismatch",
                description: `Your DNS points to the wrong value. It must point to ${requiredCnameValue}`,
                variant: "destructive"
            });
        } else if (domainInput.toLowerCase() === 'success-domain.com') {
            // SIMULATE A SUCCESSFUL CONNECTION
            setCheckResults([
                { type: 'A', host: '@', value: '199.36.158.100', status: 'ok' },
                { type: 'A', host: '@', value: '199.36.158.101', status: 'ok' },
                { type: 'CNAME', host: 'www', value: requiredCnameValue, status: 'ok' },
            ]);
            setCheckStatus('connected');
            addDomain(domainInput);
            setDomainInput('');
            toast({
                title: "Domain Connected!",
                description: `${domainInput} has been successfully verified and added.`,
            });
        } else {
             // SIMULATE A GENERIC FAILURE (records not found)
            setCheckResults([
                { type: 'A', host: '@', value: '199.36.158.100', status: 'missing' },
                { type: 'A', host: '@', value: '199.36.158.101', status: 'missing' },
                { type: 'CNAME', host: 'www', value: requiredCnameValue, status: 'missing' },
            ]);
            setCheckStatus('error');
            toast({
                title: "Verification Failed",
                description: `Could not find the required DNS records for ${domainInput}.`,
                variant: "destructive"
            });
        }
    };
    
    const handleDisconnectDomain = (domainName: string) => {
        removeDomain(domainName);
        toast({
            title: "Domain Disconnected",
            description: `${domainName} has been removed from your list.`,
            variant: "destructive"
        });
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive />Hosting Manager</CardTitle>
                    <CardDescription>Connect and manage your custom domains for your websites.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Alert>
                        <HardDrive className="h-4 w-4" />
                        <AlertTitle>New to Connecting a Domain?</AlertTitle>
                        <AlertDescription>
                            <p>Our step-by-step guide will walk you through purchasing and connecting a domain in minutes.</p>
                            <Button asChild className="mt-4">
                                <Link href="/dashboard/strategy-center/connecting-your-domain">
                                    View Domain Connection Guide <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe />Connect a New Domain</CardTitle>
                    <CardDescription>Enter a domain below to verify it's pointing correctly to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 items-end">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="domain">Domain Name</Label>
                            <Input
                                id="domain"
                                type="text"
                                placeholder="your-new-domain.com"
                                value={domainInput}
                                onChange={(e) => setDomainInput(e.target.value)}
                                disabled={checkStatus === 'checking'}
                            />
                        </div>
                        <Button onClick={handleCheckDomain} disabled={!domainInput || checkStatus === 'checking'}>
                            {checkStatus === 'checking' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Verify Domain
                        </Button>
                    </div>
                     <p className="text-xs text-muted-foreground pt-2">
                        For this demo, try `rizzosaipro.com` to see a mismatch error, or `success-domain.com` for a success.
                    </p>
                </CardContent>
                {checkStatus !== 'idle' && (
                    <>
                        <Separator />
                        <CardFooter className="flex flex-col items-start gap-4 pt-6">
                            {checkStatus === 'checking' && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Checking DNS records for {domainInput}...</span>
                                </div>
                            )}

                            {checkStatus === 'connected' && (
                                <div className="w-full space-y-4">
                                    <div className="p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6"/>
                                        <div>
                                            <h3 className="font-bold">Verification Successful!</h3>
                                            <p className="text-sm">The domain has been added to your list of connected domains below.</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            )}

                             {checkStatus === 'error' && (
                                <div className="w-full space-y-4">
                                     <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-3">
                                        <XCircle className="h-6 w-6"/>
                                        <div>
                                            <h3 className="font-bold">
                                                {checkResults.some(r => r.status === 'mismatch') ? 'Configuration Mismatch' : 'Configuration Error'}
                                            </h3>
                                            <p className="text-sm">
                                                {checkResults.some(r => r.status === 'mismatch') 
                                                ? `There's a mismatch in your CNAME record. Your DNS settings must point to the value required by your account.`
                                                : 'Some required DNS records are missing or incorrect. Please check your settings.'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                             )}

                             {checkResults.length > 0 && (
                                <div className="w-full p-4 border rounded-lg">
                                    <h4 className="font-semibold mb-2">DNS Verification Results</h4>
                                     <p className="text-xs text-muted-foreground mb-4">
                                        Required CNAME value for your account ({user?.username}): <code className="bg-muted p-1 rounded-sm">{cnameValue}</code>
                                    </p>
                                    <ul className="space-y-2 text-sm">
                                        {checkResults.map((res, i) => (
                                            <li key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 font-mono text-xs">
                                                    <span className={cn("h-2 w-2 rounded-full", res.status === 'ok' ? 'bg-green-500' : 'bg-red-500')}></span>
                                                    <span className="w-16">{res.type}</span>
                                                    <span className="w-24 text-muted-foreground">{res.host}</span>
                                                    <span>{res.value}</span>
                                                </div>
                                                <span className={cn("text-xs font-bold", res.status === 'ok' ? 'text-green-500' : 'text-red-500')}>
                                                    {res.status === 'ok' ? 'OK' : (res.status === 'mismatch' ? 'MISMATCH' : 'MISSING')}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                             )}

                        </CardFooter>
                    </>
                )}
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Connected Domains</CardTitle>
                    <CardDescription>A list of your verified domains on the platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    {domains.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Connected On</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domains.map((domain) => (
                                    <TableRow key={domain.name}>
                                        <TableCell className="font-medium">{domain.name}</TableCell>
                                        <TableCell>{format(new Date(domain.connectedAt), "PPP")}</TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="destructive" size="sm" onClick={() => handleDisconnectDomain(domain.name)}>
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Disconnect
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">You have not connected any domains yet.</p>
                    )}
                </CardContent>
            </Card>

        </div>
    );
}

    