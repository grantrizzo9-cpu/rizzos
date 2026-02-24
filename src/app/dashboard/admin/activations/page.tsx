'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCheck } from "lucide-react";
import { useToast } from '@/hooks/use-toast';
import { useReferrals } from "@/components/referrals/referral-provider"; // Import useReferrals

export default function AdminActivationsPage() {
    const { referrals, activateReferral } = useReferrals(); // Use context
    const { toast } = useToast();

    const handleActivate = (email: string) => {
        activateReferral(email); // Call context function
        toast({
            title: "User Activated",
            description: `The account for ${email} has been successfully activated.`,
        });
    };

    const pendingReferrals = referrals.filter(r => r.status === 'pending');

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2">
                    <UserCheck />
                    Manual Account Activations
                </CardTitle>
                <CardDescription>
                    Review and manually activate new user accounts that are pending.
                </CardDescription>
            </CardHeader>
            <CardContent>
                {pendingReferrals.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Referred User</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Plan</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingReferrals.map((referral) => (
                                <TableRow key={referral.email}>
                                    <TableCell className="font-medium">{referral.referredUser}</TableCell>
                                    <TableCell>{referral.email}</TableCell>
                                    <TableCell>{referral.plan}</TableCell>
                                    <TableCell>
                                        <Badge variant="secondary">{referral.status}</Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            size="sm"
                                            onClick={() => handleActivate(referral.email)}
                                        >
                                            Activate
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <p className="text-center text-muted-foreground py-8">No accounts are currently pending activation.</p>
                )}
            </CardContent>
        </Card>
    );
}
