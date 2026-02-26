
'use client';

import {
  AreaChart as AreaChartIcon,
  BarChart as BarChartIcon,
  DollarSign,
  Users,
  Percent,
  Link as LinkIcon,
  Heart,
  Hourglass,
  CreditCard,
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
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
  const { allUsers, setFamilyStatus } = useAuth();
  const { toast } = useToast();

  const handleActivate = (email: string, displayName: string) => {
    setFamilyStatus(email, true);
    toast({
        title: "Family Member Activated!",
        description: `${displayName} has been granted free Diamond plan access.`,
    });
  };

  // Don't show the admin in their own activation list
  const usersToDisplay = allUsers.filter(u => u.email !== 'rentapog@gmail.com');

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform-wide user management.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="font-headline">All Registered Users</CardTitle>
          <CardDescription>Activate users here to grant them free "Family" status and a Diamond plan.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Display Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Referred By</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersToDisplay.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell className="font-medium">{user.displayName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.isFriendAndFamily ? 'default' : 'secondary'}>
                      {user.isFriendAndFamily ? 'Family' : (user.isPaid ? 'Active' : 'Pending')}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{user.referrer || 'Direct'}</TableCell>
                  <TableCell className="text-right">
                      {!user.isFriendAndFamily && user.email && (
                          <Button
                              size="sm"
                              onClick={() => handleActivate(user.email!, user.displayName || user.email!)}
                          >
                              Activate
                          </Button>
                      )}
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

function FriendsAndFamilyDashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
          <Heart className="text-destructive" />
          Welcome to the Family!
        </CardTitle>
        <CardDescription>
          Your account is fully activated with our top-tier Diamond plan, completely free.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Enjoy full access to all features, including the AI Video Studio and unlimited website hosting. We appreciate you being part of our journey!</p>
      </CardContent>
    </Card>
  );
}

function PendingActivationCard() {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <Hourglass />
            Account Pending Activation
          </CardTitle>
          <CardDescription>
            Welcome! An administrator needs to manually activate your account for free access.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Please notify the platform owner that you have registered. Once they activate you, you will be granted full, free access to all features. If you prefer not to wait, you can choose to pay for a plan yourself.
          </p>
        </CardContent>
         <CardFooter>
            <Button asChild className="w-full">
            <Link href="/dashboard/upgrade">Choose a Plan & Pay Now</Link>
            </Button>
        </CardFooter>
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
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
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
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
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

  if (isAdmin) {
    return <AdminDashboard />;
  }

  // Handle "Family" users
  if (user?.isFriendAndFamily) {
    // This is correct now. They are paid (for free) and family.
    return <FriendsAndFamilyDashboard />;
  }
  
  // Handle regular users
  if (!user?.isPaid) {
    // This now correctly captures all new, non-family signups
    return <ActivationCard />;
  }
  
  // If they are a regular paid user, show the standard dashboard
  return <UserDashboard />;
}
