
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Users, Edit } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';


// The User type from auth-provider copied here as it's not exported
interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  isPaid?: boolean;
  plan?: string;
  isFriendAndFamily?: boolean;
  referrer?: string | null;
  isNewlyActivatedFamily?: boolean;
}

const formSchema = z.object({
  email: z.string().email("Invalid email address."),
  password: z.string().min(6, "Password must be at least 6 characters.").optional().or(z.literal('')),
});

export default function AdminFamilyPage() {
    const { allUsers, setFamilyStatus, updateUserDetails } = useAuth();
    const { toast } = useToast();
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const handleDeactivate = (email: string, displayName: string) => {
        setFamilyStatus(email, false);
        toast({
            title: "Family Status Revoked",
            description: `The account for ${displayName} no longer has free family access.`,
            variant: "destructive",
        });
    };
    
    const openEditDialog = (user: User) => {
        setEditingUser(user);
        form.reset({
            email: user.email || '',
            password: '',
        });
        setIsDialogOpen(true);
    };

    function onSubmit(values: z.infer<typeof formSchema>) {
        if (!editingUser || !editingUser.email) return;

        const dataToUpdate: { email: string, password?: string } = { email: values.email };
        
        // In a real app with a backend, you'd send the password for hashing and updating.
        // For this mock app, we'll just update the email which is stored in our mock DB.
        if (values.password) {
          console.log(`Password change requested for ${values.email} to: ${values.password}. This is a mock action.`);
          // If the user object in the mock DB had a password field, you'd add it here:
          // dataToUpdate.password = values.password;
        }

        updateUserDetails(editingUser.email, dataToUpdate);

        toast({
            title: "User Updated",
            description: `${editingUser.displayName}'s details have been updated.`,
        });
        setIsDialogOpen(false);
        setEditingUser(null);
    }
    
    // This page now only shows users who have been promoted to Family status
    const familyMembers = allUsers.filter(user => user.isFriendAndFamily && user.email !== 'rentapog@gmail.com');

    return (
        <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
            setIsDialogOpen(isOpen);
            if (!isOpen) {
                setEditingUser(null);
            }
        }}>
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <UserCheck />
                        Friends & Family List
                    </CardTitle>
                    <CardDescription>
                        This is a list of all users you have personally activated. You can revoke their access here.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {familyMembers.length > 0 ? (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Display Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Plan</TableHead>
                                    <TableHead>Referred By</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {familyMembers.map((member) => (
                                    <TableRow key={member.uid}>
                                        <TableCell className="font-medium">{member.displayName}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>
                                            <Badge variant='default'>
                                                {member.plan}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="font-mono text-xs">{member.referrer || 'N/A'}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={() => openEditDialog(member)}>
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            {member.email && (
                                                <Button
                                                    size="sm"
                                                    variant="destructive"
                                                    onClick={() => handleDeactivate(member.email!, member.displayName || member.email!)}
                                                >
                                                    Deactivate
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    ) : (
                        <div className="text-center text-muted-foreground py-8">
                            <Users className="mx-auto h-12 w-12 mb-4"/>
                            <h3 className="text-lg font-semibold">No Family Members Yet</h3>
                            <p>Activate users from the main admin dashboard to add them to this list.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit User: {editingUser?.displayName}</DialogTitle>
                    <DialogDescription>
                        Change the email or set a new password for this user. Leave password blank to keep it unchanged.
                    </DialogDescription>
                </DialogHeader>
                 <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="user@example.com" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>New Password (Optional)</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="Enter new password" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">Save Changes</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
