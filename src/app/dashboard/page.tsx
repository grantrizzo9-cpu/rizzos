
'use client';

import {
  AreaChart as AreaChartIcon,
  BarChart as BarChartIcon,
  DollarSign,
  Users,
  Percent,
  Link as LinkIcon,
  Info,
  TrendingUp,
  CreditCard,
  Heart,
  UserCheck,
  ReceiptText,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { AreaChart, Area, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { useAuth } from '@/components/auth/auth-provider';
import { useEarnings } from '@/components/earnings/earnings-provider';
import { useReferrals } from '@/components/referrals/referral-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { pricingTiers } from '@/lib/site';

const chartConfig = {
  referrals: {
    label: 'Referrals',
    color: 'hsl(var(--destructive))',
  },
  Starter: { label: 'Starter', color: 'hsl(var(--chart-1))' },
  Bronze: { label: 'Bronze', color: 'hsl(var(--chart-2))' },
  Silver: { label: 'Silver', color: 'hsl(var(--chart-3))' },
  Gold: { label: 'Gold', color: 'hsl(var(--chart-4))' },
  Platinum: { label: 'Platinum', color: 'hsl(var(--chart-5))' },
  Diamond: { label: 'Diamond', color: 'hsl(var(--chart-2))' }, // Re-use color
};

function AdminDashboard() {
  const { referrals: platformReferrals } = useReferrals();
  const pendingActivationsCount = platformReferrals.filter(r => r.status === 'pending').length;

  const activatedReferrals = platformReferrals.filter(r => r.status === 'activated');

  // Business Logic: The first payment from every new user is a 100% platform fee.
  const totalFirstPaymentsRevenue = activatedReferrals.reduce((total, referral) => {
    const tier = pricingTiers.find(t => t.name === referral.plan);
    return total + (tier ? tier.price : 0);
  }, 0);
  
  // Simulate recurring payments for the admin view. Assume half are recurring.
  const recurringReferrals = activatedReferrals.filter((_, index) => index % 2 !== 0);

  const recurringRevenueDetails = recurringReferrals.reduce((acc, referral) => {
    const affiliateReferralCount = platformReferrals.filter(r => r.affiliate === referral.affiliate && r.status === 'activated').length;
    const commissionRate = affiliateReferralCount >= 10 ? 75 : 70;
    
    const tier = pricingTiers.find(t => t.name === referral.plan);
    if (tier) {
        const dailyPayment = tier.price;
        acc.affiliatePayout += dailyPayment * (commissionRate / 100);
        acc.platformShare += dailyPayment * ((100 - commissionRate) / 100);
    }
    return acc;
  }, { platformShare: 0, affiliatePayout: 0 });

  const totalRecurringPlatformShare = recurringRevenueDetails.platformShare;
  const totalRecurringAffiliatePayouts = recurringRevenueDetails.affiliatePayout;
  const totalRefundsProcessed = 0.00;

  const totalPlatformEarnings = totalFirstPaymentsRevenue + totalRecurringPlatformShare - totalRefundsProcessed;

  // Calculate total unique users and affiliates
  const totalUsers = new Set(platformReferrals.map(r => r.email)).size + 1; // +1 for admin
  const totalAffiliates = new Set(platformReferrals.map(r => r.affiliate)).size;


  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
      <p className="text-muted-foreground">Platform-wide affiliate activity summary.</p>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>You are the Platform Owner</AlertTitle>
        <AlertDescription>
          This Admin section shows platform-wide revenue. The first payment from every new user is a
          100% platform fee. Commissions are earned on subsequent recurring payments.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">First Payment Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFirstPaymentsRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">100% platform revenue from all initial activations.</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Platform Share</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRecurringPlatformShare.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">30% share from future recurring payments.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPlatformEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total profit after affiliate payouts & refunds.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Refunds Processed</CardTitle>
            <ReceiptText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRefundsProcessed.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Total value of all processed refunds.</p>
          </CardContent>
        </Card>
      </div>

       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
         <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recurring Affiliate Payouts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalRecurringAffiliatePayouts.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">70-75% commissions on recurring payments.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform-Wide Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{platformReferrals.length}</div>
            <p className="text-xs text-muted-foreground">
              Total users referred across the entire platform.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Platform Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              Total number of user accounts on the platform.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Active Affiliates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAffiliates}</div>
            <p className="text-xs text-muted-foreground">
              Total unique users who have referred someone.
            </p>
          </CardContent>
        </Card>
       </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/dashboard/admin/activations" className="block">
          <Card className="hover:bg-muted h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Activations</CardTitle>
              <UserCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingActivationsCount}</div>
              <p className="text-xs text-muted-foreground">
                Click to manage new accounts pending activation.
              </p>
            </CardContent>
          </Card>
        </Link>
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
                    <Badge variant={referral.status === 'activated' ? 'default' : 'secondary'}>
                      {referral.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="pt-8 mt-8 border-t">
        <h2 className="text-2xl font-bold font-headline mb-4">Friends &amp; Family View</h2>
        <FriendsAndFamilyDashboard />
      </div>
    </div>
  );
}

function FriendsAndFamilyDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Heart className="text-destructive" />
          Friends &amp; Family Dashboard
        </CardTitle>
        <CardDescription>
          Welcome! We've given you a special dashboard with full access to all features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Enjoy the platform! We appreciate you being part of our journey.</p>
      </CardContent>
    </Card>
  );
}

function ActivationCard() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <CreditCard />
          Activate Your Account
        </CardTitle>
        <CardDescription>
          Your account is not yet active. To start using the dashboard and earning commissions, you
          need to activate your plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Click the button below to choose a plan and complete the activation. Your 3-day free trial
          will start immediately after the one-time activation fee is paid.
        </p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link href="/dashboard/upgrade">Activate Your Plan</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

function UserDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  // Use live data from context instead of mock data
  const { referrals, dailyEarnings, monthlyReferrals, totalEarnings, activeReferrals } =
    useEarnings();

  const commissionRate = activeReferrals >= 10 ? 75 : 70;

  const affiliateLink = user?.username ? `https://hostproai.com/?ref=${user.username}` : '';

  const copyToClipboard = () => {
    if (!affiliateLink) return;
    navigator.clipboard.writeText(affiliateLink);
    toast({
      title: 'Copied to clipboard!',
      description: 'Your affiliate link has been copied.',
    });
  };

  return (
    <div className="space-y-8">
      {user?.username && (
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <LinkIcon /> Your Affiliate Link
            </CardTitle>
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
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalEarnings.toFixed(2)} AUD</div>
            <p className="text-xs text-muted-foreground">All earnings from your referrals.</p>
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
            <p className="text-xs text-muted-foreground">
              {10 - activeReferrals > 0
                ? `${10 - activeReferrals} more referrals to next tier`
                : 'Top tier unlocked!'}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <AreaChartIcon className="h-5 w-5" />
              Daily Earnings by Plan (This Week)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart data={dailyEarnings} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value as number}`} />
                <ChartTooltipContent indicator="dot" />
                {pricingTiers.map((tier) => (
                    <Area
                        key={tier.id}
                        dataKey={tier.name}
                        type="monotone"
                        stackId="a"
                        fill={`var(--color-${tier.name})`}
                        fillOpacity={0.4}
                        stroke={`var(--color-${tier.name})`}
                    />
                ))}
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <BarChartIcon className="h-5 w-5" />
              New Referrals (This Year)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <BarChart
                data={monthlyReferrals}
                margin={{ top: 5, right: 20, left: -10, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltipContent indicator="dot" />
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
          {referrals.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No referrals yet. Share your link to get started!
            </p>
          ) : (
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
                {referrals.map(referral => (
                  <TableRow key={referral.id}>
                    <TableCell>{referral.email}</TableCell>
                    <TableCell>{referral.plan}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          referral.status === 'Active'
                            ? 'default'
                            : referral.status === 'Trial'
                              ? 'secondary'
                              : 'destructive'
                        }
                      >
                        {referral.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">${referral.commission.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function DashboardOverviewPage() {
  const { user } = useAuth();
  const isAdmin = user?.email === 'rentapog@gmail.com';
  const isFriendsAndFamily = user?.isFriendAndFamily;

  if (!user?.isPaid) {
    return <ActivationCard />;
  }

  if (isAdmin) {
    return <AdminDashboard />;
  }

  if (isFriendsAndFamily) {
    return <FriendsAndFamilyDashboard />;
  }

  return <UserDashboard />;
}
