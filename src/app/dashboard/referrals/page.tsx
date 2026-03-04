
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useEarnings } from "@/components/earnings/earnings-provider";
import { useAuth } from "@/components/auth/auth-provider";
import { AffiliateReferralsCard } from "@/components/affiliate/affiliate-referrals-card";
import { Users } from "lucide-react";

export default function ReferralsPage() {
  const { referrals } = useEarnings();
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Users/>Your Referrals</CardTitle>
          <CardDescription>An overview of the customers you've referred.</CardDescription>
        </CardHeader>
        <CardContent>
            {referrals.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No referrals yet. Share your link from the dashboard to get started!</p>
            ) : (
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Customer</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Est. Daily Commission</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {referrals.map((referral) => (
                        <TableRow key={referral.id}>
                        <TableCell>{referral.email}</TableCell>
                        <TableCell>{referral.plan}</TableCell>
                        <TableCell>
                            <Badge variant={referral.status === 'Active' ? 'default' : referral.status === 'Trial' ? 'secondary' : 'destructive'}>{referral.status}</Badge>
                        </TableCell>
                        <TableCell className="text-right">${referral.commission.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            )}
        </CardContent>
      </Card>

      {/* Affiliate Program Referrals */}
      {user?.username && <AffiliateReferralsCard username={user.username} />}
    </div>
  );
}
