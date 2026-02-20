import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { recentReferrals } from "@/lib/mock-data";
import { Users } from "lucide-react";

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><Users/>Your Referrals</CardTitle>
          <CardDescription>An overview of the customers you've referred.</CardDescription>
        </CardHeader>
        <CardContent>
           <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead>Plan</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Daily Commission</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReferrals.map((referral) => (
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
        </CardContent>
      </Card>
    </div>
  );
}
