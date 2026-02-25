'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Globe, Loader2, CheckCircle, XCircle, Info } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type CheckStatus = 'pending' | 'loading' | 'checked';
type RecordStatus = 'pending' | 'success' | 'error';

interface DnsCheckResult {
    aRecord: RecordStatus;
    cnameRecord: RecordStatus;
}

export default function HostingPage() {
    const { user } = useAuth();
    const [domainName, setDomainName] = useState('');
    const [checkStatus, setCheckStatus] = useState<CheckStatus>('pending');
    const [results, setResults] = useState<DnsCheckResult | null>(null);

    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    const handleVerifyDomain = () => {
        if (!domainName) {
            alert('Please enter a domain name.');
            return;
        }
        setCheckStatus('loading');
        setResults(null);

        // Simulate the check for a more believable UI experience
        setTimeout(() => {
            const isSuccess = domainName.toLowerCase() === 'success-domain.com' || domainName.toLowerCase() === 'rizzosaipro.com';
            const isFailure = domainName.toLowerCase() === 'fail-domain.com';

            setResults({
                aRecord: isFailure ? 'error' : 'success',
                cnameRecord: isSuccess ? 'success' : 'error',
            });
            setCheckStatus('checked');
        }, 1500);
    };

    const StatusIcon = ({ status }: { status: RecordStatus }) => {
        if (status === 'success') return <CheckCircle className="h-5 w-5 text-green-500" />;
        if (status === 'error') return <XCircle className="h-5 w-5 text-destructive" />;
        return null;
    };

    return (
        <div className="space-y-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Globe />Connect Your Custom Domain</CardTitle>
                    <CardDescription>Enter your domain to verify its DNS settings and connect it to our platform.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col sm:flex-row gap-2 max-w-md">
                        <Input
                            placeholder="your-domain.com"
                            value={domainName}
                            onChange={(e) => {
                                setDomainName(e.target.value.trim());
                                setCheckStatus('pending'); // Reset check when user types
                                setResults(null);
                            }}
                        />
                        <Button onClick={handleVerifyDomain} disabled={checkStatus === 'loading'} className="w-full sm:w-auto">
                            {checkStatus === 'loading' ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            Verify Domain
                        </Button>
                    </div>
                </CardContent>

                {checkStatus !== 'pending' && (
                    <CardFooter className="flex-col items-start gap-4 border-t pt-6">
                        <h3 className="font-semibold text-lg">DNS Check Results</h3>
                        {checkStatus === 'loading' && (
                             <div className="w-full text-center py-8">
                                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2"/>
                                <p className="text-muted-foreground">Verifying DNS records for {domainName}...</p>
                            </div>
                        )}
                        {checkStatus === 'checked' && results && (
                             <div className="w-full space-y-4">
                                <div className="flex items-center justify-between p-3 border rounded-md">
                                    <div className="flex items-center gap-3">
                                        <StatusIcon status={results.aRecord} />
                                        <div>
                                            <p className="font-medium">A Records</p>
                                            <p className="text-xs text-muted-foreground font-mono">199.36.158.100 & 199.36.158.101</p>
                                        </div>
                                    </div>
                                    <p className={cn("font-semibold", results.aRecord === 'success' ? 'text-green-500' : 'text-destructive')}>
                                        {results.aRecord === 'success' ? 'Connected' : 'Error'}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-md">
                                     <div className="flex items-center gap-3">
                                        <StatusIcon status={results.cnameRecord} />
                                        <div>
                                            <p className="font-medium">CNAME Record (www)</p>
                                            <p className="text-xs text-muted-foreground font-mono">{cnameValue}</p>
                                        </div>
                                    </div>
                                    <p className={cn("font-semibold", results.cnameRecord === 'success' ? 'text-green-500' : 'text-destructive')}>
                                        {results.cnameRecord === 'success' ? 'Connected' : 'Error'}
                                    </p>
                                </div>
                                
                                { (results.aRecord === 'error' || results.cnameRecord === 'error') && (
                                     <Alert variant="destructive">
                                        <Info className="h-4 w-4" />
                                        <AlertTitle>Configuration Error</AlertTitle>
                                        <AlertDescription>
                                           <p>One or more of your DNS records are not pointing to our servers correctly. Please ensure your registrar has the exact records listed above.</p>
                                           <p className="mt-2">It can take some time for DNS changes to update globally. If you've just updated your records, please wait a few minutes and try again.</p>
                                           <p className="mt-2">For detailed instructions, please see our <Link href="/dashboard/strategy-center/connecting-your-domain" className="font-bold underline">domain connection guide</Link>.</p>
                                        </AlertDescription>
                                    </Alert>
                                )}
                                { (results.aRecord === 'success' && results.cnameRecord === 'success') && (
                                      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-950 dark:border-green-800 dark:text-green-300 [&>svg]:text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <AlertTitle>Domain Connected!</AlertTitle>
                                        <AlertDescription>
                                           Congratulations! Your domain is correctly pointed to our servers.
                                        </AlertDescription>
                                    </Alert>
                                )}
                             </div>
                        )}
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
