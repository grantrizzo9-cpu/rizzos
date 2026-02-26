'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { useReferrals } from '@/components/referrals/referral-provider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { themes } from '@/lib/data';

type AuthFormProps = {
  mode: 'login' | 'signup';
  referrer?: string;
  themeName?: string;
};

// Simple hash function for consistent ID generation
const simpleHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return `user_${Math.abs(hash).toString(16)}`;
};

// Re-defining user type here as we can't import it from auth-provider.
interface MockUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  username: string | null;
  isPaid?: boolean;
  plan?: string;
  isFriendAndFamily?: boolean;
  referrer?: string | null;
}

// Mock user DB functions
const MOCK_USER_DB_KEY = 'mock_user_db';

const getMockUserDB = (): MockUser[] => {
  if (typeof window === 'undefined') return [];
  try {
    const db = window.localStorage.getItem(MOCK_USER_DB_KEY);
    return db ? JSON.parse(db) : [];
  } catch {
    return [];
  }
};

const saveMockUserDB = (db: MockUser[]) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(MOCK_USER_DB_KEY, JSON.stringify(db));
};

const findUserByEmail = (email: string): MockUser | undefined => {
  const db = getMockUserDB();
  return db.find(u => u.email?.toLowerCase() === email.toLowerCase());
}

const addUserToDB = (user: MockUser) => {
    const db = getMockUserDB();
    // remove user if exists to avoid duplicates, then add the new one
    const filteredDb = db.filter(u => u.email?.toLowerCase() !== user.email?.toLowerCase());
    saveMockUserDB([...filteredDb, user]);
}


export function AuthForm({ mode, referrer, themeName }: AuthFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const { addReferral } = useReferrals();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (themeName) {
      const selectedTheme = themes.find(t => t.name === decodeURIComponent(themeName));
      if (selectedTheme) {
        const root = document.documentElement;
        
        const themeColorKeys = Object.keys(selectedTheme.colors);
        themeColorKeys.forEach(key => {
            root.style.setProperty(key, selectedTheme.colors[key as keyof typeof selectedTheme.colors]);
        });

        return () => {
          themeColorKeys.forEach(key => {
              root.style.removeProperty(key);
          });
        };
      }
    }
  }, [themeName]);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (mode === 'signup') {
      const effectiveReferrer = referrer || 'hostproai';
      
      const existingUser = findUserByEmail(email);
      if (existingUser) {
          alert("User with this email already exists. Please log in.");
          setIsLoading(false);
          return;
      }

      const stableUid = simpleHash(email.toLowerCase());
      const newUser: MockUser = {
          uid: stableUid,
          email: email,
          displayName: username,
          username: username,
          isPaid: false,
          plan: undefined,
          isFriendAndFamily: true,
          referrer: effectiveReferrer,
      };
      
      addUserToDB(newUser);

      addReferral({
          referredUser: username,
          email: email,
          affiliate: effectiveReferrer,
      });

      // The `as any` cast is necessary because MockUser is defined locally.
      signIn(newUser as any, true, effectiveReferrer);
      router.push('/dashboard/upgrade');

    } else { // Login mode
      if (email.toLowerCase() === 'rentapog@gmail.com') {
          signIn(); // Special case for admin login
          router.push('/dashboard');
      } else {
          const existingUser = findUserByEmail(email);
          if (existingUser) {
              // In a real app, you would verify the password here.
              // We pass the full, correct user object from our mock DB.
              signIn(existingUser as any, false);
              router.push('/dashboard');
          } else {
              alert("No user found with this email. Please sign up first.");
              setIsLoading(false);
          }
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
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
