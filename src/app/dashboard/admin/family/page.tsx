'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCheck, Users } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/components/auth/auth-provider';

export default function AdminFamilyPage() {
    const { allUsers, setFamilyStatus } = useAuth();
    const { toast } = useToast();

    const handleDeactivate = (email: string, displayName: string) => {
        setFamilyStatus(email, false);
        toast({
            title: "Family Status Revoked",
            description: `The account for ${displayName} no longer has free family access.`,
            variant: "destructive",
        });
    };
    
    // This page now only shows users who have been promoted to Family status
    const familyMembers = allUsers.filter(user => user.isFriendAndFamily && user.email !== 'rentapog@gmail.com');

    return (
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
                                    <TableCell className="text-right">
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
    );
}
