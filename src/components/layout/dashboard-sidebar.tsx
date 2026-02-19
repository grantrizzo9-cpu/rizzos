"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AreaChart, Bot, Dna, HardDrive, Wallet, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const navLinks = [
  { href: "/dashboard", label: "Overview", icon: AreaChart },
  { href: "/dashboard/ai-studio", label: "AI Studio", icon: Bot },
  { href: "/dashboard/hosting", label: "Hosting", icon: HardDrive },
  { href: "/dashboard/payouts", label: "Payouts", icon: Wallet },
];

const bottomLinks = [
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
]

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Affiliate AI Host</span>
          </Link>
          {navLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    (pathname === link.href || (link.href !== '/dashboard' && pathname.startsWith(link.href))) && "bg-accent text-accent-foreground"
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {bottomLinks.map((link) => (
            <Tooltip key={link.href}>
                <TooltipTrigger asChild>
                    <Link
                    href={link.href}
                    className={cn(
                        "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                        pathname.startsWith(link.href) && "bg-accent text-accent-foreground"
                    )}
                    >
                    <link.icon className="h-5 w-5" />
                    <span className="sr-only">{link.label}</span>
                    </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
           ))}
        </nav>
      </TooltipProvider>
    </aside>
  );
}
