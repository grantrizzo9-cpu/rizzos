
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Globe, ArrowLeft, Info, ExternalLink } from 'lucide-react';
import { useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/auth-provider";

export default function ManageDomainPage() {
    const params = useParams();
    const { user } = useAuth();
    const domainName = typeof params.domain === 'string' ? decodeURIComponent(params.domain) : '';
    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
             <Button variant="ghost" asChild>
                <Link href="/dashboard/domains"><ArrowLeft className="mr-2"/> Back to All Domains</Link>
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Globe />
                        Connect: {domainName}
                    </CardTitle>
                    <CardDescription>Follow the steps below to connect your domain.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold text-lg mb-2">Step 1: Configure Your DNS Records</h3>
                        <p className="text-muted-foreground mb-4">
                            Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records. If your registrar uses '@' for the root domain, use that for the 'Host' field of the A records.
                        </p>
                        <div className="space-y-3 rounded-lg bg-muted p-4">
                            <div className="font-mono text-sm">
                                <p className="font-bold">A Record (1/2):</p>
                                <p><strong>Host:</strong> @</p>
                                <p><strong>Value:</strong> 199.36.158.100</p>
                            </div>
                             <hr className="border-border"/>
                            <div className="font-mono text-sm">
                                <p className="font-bold">A Record (2/2):</p>
                                <p><strong>Host:</strong> @</p>
                                <p><strong>Value:</strong> 199.36.158.101</p>
                            </div>
                             <hr className="border-border"/>
                            <div className="font-mono text-sm">
                                <p className="font-bold">CNAME Record:</p>
                                <p><strong>Host:</strong> www</p>
                                <p><strong>Value:</strong> {cnameValue}</p>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h3 className="font-semibold text-lg mb-2">Step 2: Check DNS Propagation</h3>
                        <p className="text-muted-foreground mb-4">
                            After adding the records, it can take some time (from a few minutes to an hour) for the changes to take effect globally. You can use a trusted third-party tool like DNS Checker to see the live status of your domain's propagation around the world.
                        </p>
                        <Button asChild variant="outline">
                            <a href={`https://dnschecker.org/#A/${domainName}`} target="_blank" rel="noopener noreferrer">
                                Check DNS Status with dnschecker.org <ExternalLink className="ml-2"/>
                            </a>
                        </Button>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Alert variant="default">
                        <Info className="h-4 w-4" />
                        <AlertTitle>What's Next?</AlertTitle>
                        <AlertDescription>
                           Once DNS Checker shows your 'A' records are pointing correctly, your domain is connected. The authorization of your domain on our platform will be handled automatically by our system.
                        </AlertDescription>
                    </Alert>
                </CardFooter>
            </Card>
        </div>
    );
}
