"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

type AuthFormProps = {
  mode: 'login' | 'signup';
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
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
        signIn({
          uid: `mock-user-${Date.now()}`,
          email: email,
          displayName: username,
          username: username,
        }, true);
      } else {
        // For login, we use the signIn with a default user.
        // This is a mock, in a real app you'd validate credentials
        signIn();
      }
      router.push('/dashboard');
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
