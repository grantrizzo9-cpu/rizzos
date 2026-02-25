
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, Globe, Trash2, Info } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDomains } from "@/components/domains/domain-provider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from "@/components/auth/auth-provider";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"


export default function HostingPage() {
    const [domainInput, setDomainInput] = useState('');
    const { domains, addDomain, removeDomain } = useDomains();
    const { toast } = useToast();
    const { user } = useAuth();
    
    const cnameValue = user?.username ? `${user.username}.hostproai.com` : `[your-username].hostproai.com`;

    const handleAddDomain = () => {
        if (!domainInput) return;
        addDomain(domainInput);
        setDomainInput('');
        toast({
            title: "Domain Added",
            description: `${domainInput} has been added. Please allow up to an hour for settings to propagate before completing the setup in Firebase.`,
        });
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
                    <CardTitle className="flex items-center gap-2"><Globe />Connect a Custom Domain</CardTitle>
                    <CardDescription>Follow these steps to point your custom domain to our servers.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Step 1: Configure DNS Records</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Log in to your domain registrar (e.g., GoDaddy, Namecheap) and add the following three DNS records.
                        </p>
                        <div className="p-4 border rounded-lg bg-muted space-y-3 text-sm font-mono">
                           <p><strong>A Record 1:</strong> Host: @, Value: 199.36.158.100</p>
                           <p><strong>A Record 2:</strong> Host: @, Value: 199.36.158.101</p>
                           <p><strong>CNAME Record:</strong> Host: www, Value: {cnameValue}</p>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold mb-2">Step 2: Add Your Domain Here</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Once you have configured the records above, enter your domain name below and add it to your account.
                        </p>
                         <div className="flex gap-2 items-end">
                            <div className="grid w-full gap-1.5">
                                <Label htmlFor="domain">Domain Name</Label>
                                <Input
                                    id="domain"
                                    type="text"
                                    placeholder="your-new-domain.com"
                                    value={domainInput}
                                    onChange={(e) => setDomainInput(e.target.value)}
                                />
                            </div>
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button disabled={!domainInput}>Add Domain</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                    <AlertDialogTitle>Are you ready to add this domain?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        Please confirm that you have set the A and CNAME records at your registrar. DNS changes can take up to an hour to take effect globally.
                                    </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={handleAddDomain}>Yes, Add Domain</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                    </div>
                     <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Check Your Propagation</AlertTitle>
                        <AlertDescription>
                            You can use a free tool like <a href="https://dnschecker.org" target="_blank" rel="noopener noreferrer" className="font-semibold underline">dnschecker.org</a> to see if your new records are live across the world.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Connected Domains</CardTitle>
                    <CardDescription>A list of domains you have added to your account.</CardDescription>
                </CardHeader>
                <CardContent>
                    {domains.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Added On</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domains.map((domain) => (
                                    <TableRow key={domain.name}>
                                        <TableCell className="font-medium">{domain.name}</TableCell>
                                        <TableCell>
                                            <Badge variant="secondary">Added</Badge>
                                        </TableCell>
                                        <TableCell>{format(new Date(domain.connectedAt), "PPP")}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button asChild variant="outline" size="sm">
                                               <a href="https://console.firebase.google.com/project/_/hosting/main" target="_blank" rel="noopener noreferrer">
                                                   <ExternalLink className="mr-2 h-4 w-4" />
                                                   Complete in Firebase
                                               </a>
                                            </Button>
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
