"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Bot, 
  HardDrive, 
  Wallet, 
  Settings, 
  BookOpen, 
  ArrowUpCircle, 
  Users, 
  CircleHelp,
  Globe,
  Package,
  ShieldAlert
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/icons/logo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useAuth } from "../auth/auth-provider";
import { Separator } from "../ui/separator";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/hosting", label: "Hosting", icon: HardDrive },
  { href: "/dashboard/website", label: "Website", icon: Globe },
  { href: "/dashboard/ai-content", label: "AI Content", icon: Bot },
  { href: "/strategy-center", label: "Marketing Guides", icon: BookOpen, target: "_blank" },
  { href: "/dashboard/upgrade", label: "Upgrade", icon: ArrowUpCircle },
  { href: "/dashboard/referrals", label: "Referrals", icon: Users },
  { href: "/dashboard/payouts", label: "Payouts", icon: Wallet },
  { href: "/dashboard/request-refund", label: "Request Refund", icon: CircleHelp },
];

const adminLinks = [
    { href: "/dashboard/admin/packages", label: "Packages", icon: Package },
    { href: "/dashboard/admin/manage-refunds", label: "Manage Refunds", icon: ShieldAlert },
]

export function DashboardSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isAdmin = user?.email === 'renntapog@gmail.com';

  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
            <span className="sr-only">Host Pro Ai</span>
          </Link>
          {navLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  target={link.target}
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
        <div className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          {isAdmin && (
            <>
                <Separator />
                <span className="text-xs text-muted-foreground">Admin</span>
                {adminLinks.map((link) => (
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
            </>
          )}
          <Tooltip>
              <TooltipTrigger asChild>
                  <Link
                  href="/dashboard/settings"
                  className={cn(
                      "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                      pathname.startsWith("/dashboard/settings") && "bg-accent text-accent-foreground"
                  )}
                  >
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                  </Link>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </aside>
  );
}
