'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { HardDrive, ExternalLink, Globe, Loader2, CheckCircle, XCircle } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

type DnsStatus = 'idle' | 'checking' | 'connected' | 'error';

type DnsCheckResult = {
    type: 'A' | 'CNAME';
    host: string;
    value: string;
    status: 'ok' | 'missing';
};

export default function HostingPage() {
    const [domain, setDomain] = useState('');
    const [status, setStatus] = useState<DnsStatus>('idle');
    const [results, setResults] = useState<DnsCheckResult[]>([]);

    const handleCheckDomain = async () => {
        if (!domain) return;
        setStatus('checking');
        setResults([]);

        // This is a simulation. A real implementation would require a backend endpoint to perform DNS lookups.
        await new Promise(resolve => setTimeout(resolve, 2500));

        // Simulate a successful connection
        setResults([
            { type: 'A', host: '@', value: '199.36.158.100', status: 'ok' },
            { type: 'A', host: '@', value: '199.36.158.101', status: 'ok' },
            { type: 'CNAME', host: 'www', value: '[your-username].hostproai.com', status: 'ok' },
        ]);
        setStatus('connected');

        // To simulate an error, you could do something like this:
        // setResults([
        //     { type: 'A', host: '@', value: '199.36.158.100', status: 'ok' },
        //     { type: 'A', host: '@', value: '199.36.158.101', status: 'missing' },
        //     { type: 'CNAME', host: 'www', value: '[your-username].hostproai.com', status: 'ok' },
        // ]);
        // setStatus('error');
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
                                <Link href="/strategy-center/connecting-your-domain">
                                    View Domain Connection Guide <ExternalLink className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Globe />Connect Your Domain</CardTitle>
                    <CardDescription>Enter your domain below to verify it's pointing correctly to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex gap-2 items-end">
                        <div className="grid w-full gap-1.5">
                            <Label htmlFor="domain">Domain Name</Label>
                            <Input
                                id="domain"
                                type="text"
                                placeholder="your-domain.com"
                                value={domain}
                                onChange={(e) => setDomain(e.target.value)}
                                disabled={status === 'checking'}
                            />
                        </div>
                        <Button onClick={handleCheckDomain} disabled={!domain || status === 'checking'}>
                            {status === 'checking' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Verify Domain
                        </Button>
                    </div>
                </CardContent>
                {status !== 'idle' && (
                    <>
                        <Separator />
                        <CardFooter className="flex flex-col items-start gap-4 pt-6">
                            {status === 'checking' && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span>Checking DNS records for {domain}...</span>
                                </div>
                            )}

                            {status === 'connected' && (
                                <div className="w-full space-y-4">
                                    <div className="p-4 rounded-md bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800 flex items-center gap-3">
                                        <CheckCircle className="h-6 w-6"/>
                                        <div>
                                            <h3 className="font-bold">Domain Connected!</h3>
                                            <p className="text-sm">{domain} is correctly configured and pointing to Host Pro Ai.</p>
                                        </div>
                                    </div>
                                    
                                </div>
                            )}

                             {status === 'error' && (
                                <div className="w-full space-y-4">
                                     <div className="p-4 rounded-md bg-destructive/10 text-destructive border border-destructive/20 flex items-center gap-3">
                                        <XCircle className="h-6 w-6"/>
                                        <div>
                                            <h3 className="font-bold">Configuration Error</h3>
                                            <p className="text-sm">Some DNS records are missing or incorrect. Please review the guide and your registrar settings.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                             {results.length > 0 && (
                                <div className="w-full p-4 border rounded-lg">
                                    <h4 className="font-semibold mb-2">DNS Check Results</h4>
                                    <ul className="space-y-2 text-sm">
                                        {results.map((res, i) => (
                                            <li key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-2 font-mono text-xs">
                                                    <span className={cn("h-2 w-2 rounded-full", res.status === 'ok' ? 'bg-green-500' : 'bg-red-500')}></span>
                                                    <span className="w-16">{res.type}</span>
                                                    <span className="w-24 text-muted-foreground">{res.host}</span>
                                                    <span>{res.value}</span>
                                                </div>
                                                <span className={cn("text-xs font-bold", res.status === 'ok' ? 'text-green-500' : 'text-red-500')}>
                                                    {res.status === 'ok' ? 'Found' : 'Missing'}
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
                    <p className="text-center text-muted-foreground py-8">You have not connected any domains yet.</p>
                </CardContent>
            </Card>

        </div>
    );
}
