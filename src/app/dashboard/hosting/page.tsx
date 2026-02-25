
'use client';

import { useAuth } from "@/components/auth/auth-provider";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Globe, Info, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function HostingPage() {
    const { user } = useAuth();
    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2">
                        <Globe />
                        Connect a Custom Domain
                    </CardTitle>
                    <CardDescription>
                        Follow these steps to point your custom domain to our servers and go live.
                    </CardDescription>
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
                            After adding the records, it can take up to an hour for the changes to take effect globally. You can use a tool like DNS Checker to see the live status.
                        </p>
                        <Button asChild variant="outline">
                            <a href={`https://dnschecker.org/#A/your-domain.com`} target="_blank" rel="noopener noreferrer">
                                Check DNS Status with dnschecker.org <ExternalLink className="ml-2"/>
                            </a>
                        </Button>
                         <p className="text-xs text-muted-foreground mt-2">Remember to replace 'your-domain.com' with your actual domain name in the checker.</p>
                    </div>

                    <Alert variant="destructive">
                        <Info className="h-4 w-4" />
                        <AlertTitle>Important Final Step: Authorize Your Domain</AlertTitle>
                        <AlertDescription>
                           <p className="mb-2">
                             After your DNS records are pointing to Firebase (which you can confirm with the checker), you must perform a one-time security step to authorize your domain in our system. This tells Firebase that it has your permission to serve content on your behalf.
                           </p>
                            <Button asChild>
                                <a href="https://console.firebase.google.com/project/_/hosting/main" target="_blank" rel="noopener noreferrer">
                                   Go to Firebase Console to Add Domain <ExternalLink className="ml-2"/>
                                </a>
                            </Button>
                            <p className="mt-2 text-xs">Click 'Add custom domain' and follow the steps. When it asks you to add DNS records, you can skip that part as you have already done it.</p>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
