"use client";

import { AreaChart as AreaChartIcon, BarChart as BarChartIcon, DollarSign, Users, Percent, Link as LinkIcon, Info, TrendingUp, AlertCircle, Package, ShieldAlert, LayoutDashboard, CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CartesianGrid, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar } from 'recharts';
import { earningsData, referralsData, recentReferrals, platformReferrals } from "@/lib/mock-data";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useAuth } from "@/components/auth/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

const chartConfig = {
  earnings: {
    label: "Earnings (AUD)",
    color: "hsl(var(--primary))",
  },
  referrals: {
    label: "Referrals",
    color: "hsl(var(--destructive))",
  }
};

function AdminDashboard() {
  return (
    <div className="space-y-8">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide affiliate activity summary.</p>
        
        <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>You are the Platform Owner</AlertTitle>
            <AlertDescription>
                This Admin section shows platform-wide revenue. The first payment from every new user is a 100% platform fee. Commissions are earned on subsequent recurring payments.
            </AlertDescription>
        </Alert>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform Revenue</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$1,019.40</div>
                    <p className="text-xs text-muted-foreground">Platform profit after affiliate payouts.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Gross Sales</CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$1,019.40</div>
                    <p className="text-xs text-muted-foreground">Total value of all sales before affiliate payouts.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Affiliate Payouts</CardTitle>
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">$0.00</div>
                    <p className="text-xs text-muted-foreground">Total commissions paid or due to all affiliates.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Platform-Wide Referrals</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+22</div>
                    <p className="text-xs text-muted-foreground">Total users referred across the entire platform.</p>
                </CardContent>
            </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Activations</CardTitle>
                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">4</div>
                    <p className="text-xs text-muted-foreground">Users who signed up but have not yet paid.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Platform Users</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">47</div>
                    <p className="text-xs text-muted-foreground">Total number of user accounts on the platform.</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Active Affiliates</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">47</div>
                    <p className="text-xs text-muted-foreground">Total users who are active affiliates.</p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Recent Platform-Wide Referrals</CardTitle>
                <CardDescription>The latest sign-ups from all affiliates.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Referred User</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Affiliate</TableHead>
                            <TableHead>Plan</TableHead>
                            <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {platformReferrals.map((referral, index) => (
                            <TableRow key={index}>
                                <TableCell className="font-medium">{referral.referredUser}</TableCell>
                                <TableCell>{referral.email}</TableCell>
                                <TableCell className="font-mono text-xs">{referral.affiliate}</TableCell>
                                <TableCell>{referral.plan}</TableCell>
                                <TableCell>
                                    <Badge variant={referral.status === 'activated' ? 'default' : 'secondary'}>{referral.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}

function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const totalEarnings = earningsData.reduce((acc, item) => acc + item.earnings, 0);
  const activeReferrals = recentReferrals.filter(r => r.status === 'Active').length;
  const commissionRate = activeReferrals >= 10 ? 75 : 70;

  const affiliateLink = user?.username ? `https://affiliateaihost.com/ref/${user.username}` : '';

  const copyToClipboard = () => {
    if (!affiliateLink) return;
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: "Copied to clipboard!",
      description: "Your affiliate link has been copied.",
    });
  };

  if (!user?.isPaid) {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <CreditCard />
                    Activate Your Account
                </CardTitle>
                <CardDescription>
                    Your account is not yet active. To start using the dashboard and earning commissions, you need to activate your plan.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Click the button below to choose a plan and complete the activation. Your 3-day free trial will start immediately after the one-time activation fee is paid.</p>
            </CardContent>
            <CardFooter>
                <Button asChild className="w-full">
                    <Link href="/pricing">Activate Your Plan</Link>
                </Button>
            </CardFooter>
        </Card>
    )
  }

  return (
    <div className="space-y-8">
      {user?.username && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><LinkIcon/> Your Affiliate Link</CardTitle>
            <CardDescription>Share this link to start earning commissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input readOnly value={affiliateLink} />
              <Button onClick={copyToClipboard}>Copy</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings (7d)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)} AUD</div>
            <p className="text-xs text-muted-foreground">+20.1% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeReferrals}</div>
            <p className="text-xs text-muted-foreground">Next target: 10 for 75% rate</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{commissionRate}%</div>
            <p className="text-xs text-muted-foreground">{10 - activeReferrals} more referrals to next tier</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><AreaChartIcon className="h-5 w-5" />Daily Earnings</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart data={earningsData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Area dataKey="earnings" type="monotone" fill="var(--color-earnings)" fillOpacity={0.4} stroke="var(--color-earnings)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2"><BarChartIcon className="h-5 w-5" />New Referrals (6m)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart data={referralsData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <Tooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="referrals" fill="var(--color-referrals)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">Recent Referrals</CardTitle>
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


export default function DashboardOverviewPage() {
    const { user } = useAuth();
    const isAdmin = user?.email === 'renntapog@gmail.com';

    return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}
