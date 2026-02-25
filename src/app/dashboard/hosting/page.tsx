'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/components/auth/auth-provider";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function HostingPage() {
    const { user } = useAuth();
    const [domainName, setDomainName] = useState('');

    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    const handleCheckStatus = () => {
        if (!domainName) {
            alert('Please enter a domain name to check.');
            return;
        }
        // Open dnschecker.org for both A and CNAME records in new tabs
        window.open(`https://dnschecker.org/#A/${domainName}`, '_blank');
        window.open(`https://dnschecker.org/#CNAME/www.${domainName}`, '_blank');
    };

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Globe />Connect a Custom Domain</CardTitle>
                    <CardDescription>Follow these steps to point your custom domain to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Step 1: Configure Your DNS Records</AlertTitle>
                        <AlertDescription>
                            <p>Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records. Some registrars use '@' for the root domain. If you need to purchase a domain, you can do so from our domain registrar <a href="https://rizzosai.shopco.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-semibold">Rizzo's Domains</a>.</p>
                            <div className="mt-4 p-4 bg-muted rounded-lg font-mono text-sm space-y-2">
                                <p><strong>A Record 1:</strong> Host: @, Value: 199.36.158.100</p>
                                <p><strong>A Record 2:</strong> Host: @, Value: 199.36.158.101</p>
                                <p><strong>CNAME Record:</strong> Host: www, Value: {cnameValue}</p>
                            </div>
                        </AlertDescription>
                    </Alert>

                     <Alert>
                        <CheckCircle2 className="h-4 w-4" />
                        <AlertTitle>Step 2: Verify Propagation</AlertTitle>
                        <AlertDescription>
                            <p className="mb-4">After adding the records, it can take up to an hour for them to take effect globally. Enter your domain below and click "Check DNS Status" to see real-time results from around the world. Once you see green checkmarks, your site is live.</p>
                            <div className="flex gap-2 max-w-md">
                                <Input 
                                    placeholder="your-domain.com" 
                                    value={domainName}
                                    onChange={(e) => setDomainName(e.target.value.trim())}
                                />
                                <Button onClick={handleCheckStatus}>
                                    Check DNS Status
                                </Button>
                            </div>
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
