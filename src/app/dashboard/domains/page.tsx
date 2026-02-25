
'use client';

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, ServerOff, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useDomains, type Domain } from "@/contexts/domains-provider";
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
} from "@/components/ui/alert-dialog";

export default function HostingPage() {
    const { domains, addDomain, deleteDomain } = useDomains();
    const [newDomainName, setNewDomainName] = useState("");

    const handleAddDomain = () => {
        if (newDomainName.trim()) {
            addDomain(newDomainName.trim());
            setNewDomainName("");
        }
    };
    
    const getStatusVariant = (status: Domain['status']) => {
        switch (status) {
            case 'verified':
                return 'default';
            case 'pending':
                return 'secondary';
            case 'error':
                return 'destructive';
            default:
                return 'outline';
        }
    }

    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive/>Hosting Management</CardTitle>
                    <CardDescription>Add your custom domains here to connect them to your generated websites.</CardDescription>
                </CardHeader>
                <CardContent>
                     <div className="flex flex-col sm:flex-row gap-4 max-w-lg">
                        <Input 
                            placeholder="e.g., your-cool-site.com" 
                            value={newDomainName}
                            onChange={(e) => setNewDomainName(e.target.value)}
                        />
                        <Button type="button" onClick={handleAddDomain}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Domain
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Your Domains</CardTitle>
                    <CardDescription>A list of all domains you've added to your account.</CardDescription>
                </CardHeader>
                 <CardContent>
                    {domains.length > 0 ? (
                       <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Domain</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {domains.map((domain) => (
                                    <TableRow key={domain.id}>
                                        <TableCell className="font-medium">
                                            <Link href={`/dashboard/domains/${domain.id}`} className="hover:underline">
                                                {domain.name}
                                            </Link>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusVariant(domain.status)}>{domain.status}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link href={`/dashboard/domains/${domain.id}`}>
                                                    Manage
                                                </Link>
                                            </Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete your domain configuration.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => deleteDomain(domain.id)}>Continue</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-16">
                            <ServerOff className="mx-auto h-12 w-12 mb-4"/>
                            <h3 className="text-lg font-semibold">No Domains Added Yet</h3>
                            <p>Use the form above to add your first domain and get it connected.</p>
                        </div>
                    )}
                 </CardContent>
            </Card>
        </div>
    )
}
