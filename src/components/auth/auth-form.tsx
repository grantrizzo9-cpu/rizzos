"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { useReferrals } from '@/components/referrals/referral-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

type AuthFormProps = {
  mode: 'login' | 'signup';
  referrer?: string;
};

export function AuthForm({ mode, referrer }: AuthFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const { addReferral } = useReferrals();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Mocking auth flow
    setTimeout(() => {
      if (mode === 'signup') {
        addReferral({
          referredUser: username,
          email: email,
          affiliate: referrer || 'hostproai', // Default to platform owner if no referrer
        });

        signIn({
          uid: `mock-user-${Date.now()}`,
          email: email,
          displayName: username,
          username: username,
        }, true, referrer);
        router.push('/dashboard/upgrade');
      } else {
        // For login, we check if it's the admin email.
        if (email.toLowerCase() === 'renntapog@gmail.com') {
          // If it's the admin, use the default signIn to log in as admin.
          signIn();
        } else {
          // For any other user, create a mock user object.
          // In a real app, you'd fetch this user's data after validating credentials.
          const mockLoggedInUser = {
              uid: `mock-user-${Date.now()}`,
              email: email,
              displayName: email.split('@')[0],
              username: email.split('@')[0],
              isPaid: true, // Assuming existing users are paid
              plan: 'Gold', // Mock a default plan for existing users
          };
          signIn(mockLoggedInUser);
        }
        router.push('/dashboard');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-full max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl">
              {mode === 'login' ? 'Welcome Back' : 'Create an Account'}
            </CardTitle>
            <CardDescription>
              {mode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Start your journey to daily income.'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="your-username"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="affiliate@domain.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'login' ? 'Login' : 'Sign Up'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
