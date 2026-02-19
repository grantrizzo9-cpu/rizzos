import Link from 'next/link';
import { Logo } from '@/components/icons/logo';

const legalLinks = [
  { href: '/disclaimer', label: 'Disclaimer (Earnings)' },
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms & Conditions' },
];

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built for the modern affiliate marketer.
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {legalLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-foreground">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
