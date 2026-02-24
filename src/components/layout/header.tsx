"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/icons/logo';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/auth-provider';

const navLinks = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/strategy-center', label: 'Strategy Center' },
];

export function Header() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user } = useAuth();

  const ref = searchParams.get('ref');
  
  const createHref = (path: string) => {
    if (!ref) return path;
    const params = new URLSearchParams();
    params.set('ref', ref);
    return `${path}?${params.toString()}`;
  }

  const signupHref = createHref('/signup');
  const loginHref = createHref('/login');
  const homeHref = createHref('/');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href={homeHref} className="mr-6 flex items-center space-x-2">
            <Logo className="h-6 w-6" />
            <span className="font-bold font-headline sm:inline-block">
              Host Pro Ai
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={createHref(link.href)}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <>
              <Button variant="ghost" asChild>
                <Link href={loginHref}>Login</Link>
              </Button>
              <Button asChild>
                <Link href={signupHref}>Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
