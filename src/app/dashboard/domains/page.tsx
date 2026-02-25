'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useDomains } from '@/contexts/domains-provider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { HardDrive, PlusCircle, ChevronRight, ServerOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const addDomainSchema = z.object({
    domainName: z.string().min(3, { message: "Domain name must be at least 3 characters."})
        .regex(/^(?!-)[A-Za-z0-9-]+([-.]{1}[a-z0-9]+)*\.[A-Za-z]{2,}$/, { message: "Please enter a valid domain name." }),
});

export default function DomainsPage() {
    const { domains, addDomain } = useDomains();
    const { toast } = useToast();

    const form = useForm<z.infer<typeof addDomainSchema>>({
        resolver: zodResolver(addDomainSchema),
        defaultValues: {
            domainName: '',
        },
    });

    function onSubmit(values: z.infer<typeof addDomainSchema>) {
        addDomain(values.domainName);
        toast({
            title: "Domain Added",
            description: `${values.domainName} is now pending configuration.`,
        });
        form.reset();
    }
    
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive/>Domain Management</CardTitle>
                    <CardDescription>Add your custom domains here to connect them to your generated websites.</CardDescription>
                </CardHeader>
                <CardContent>
                     <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-lg">
                            <FormField
                                control={form.control}
                                name="domainName"
                                render={({ field }) => (
                                    <FormItem className="flex-grow">
                                    <FormLabel className="sr-only">Domain Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., your-cool-site.com" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Add Domain
                            </Button>
                        </form>
                    </Form>
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
                                    <TableRow key={domain.name}>
                                        <TableCell className="font-medium">{domain.name}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                domain.status === 'active' ? 'default' :
                                                domain.status === 'pending' ? 'secondary' : 'destructive'
                                            }>
                                                {domain.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={`/dashboard/domains/${domain.name}`}>
                                                    Manage <ChevronRight className="ml-2 h-4 w-4" />
                                                </Link>
                                            </Button>
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
