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
import { Logo } from "@/components/icons/logo";
import { useAuth } from "../auth/auth-provider";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel
} from "@/components/ui/sidebar";


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

  const isActive = (href: string) => {
    return pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
  }

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
             <Link
                href="/dashboard"
                className="group flex w-full items-center justify-center gap-2"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
                    <Logo className="h-5 w-5 transition-all group-hover:scale-110" />
                </div>
                <span className="text-lg font-semibold tracking-tight text-foreground group-data-[collapsible=icon]:-ml-8 group-data-[collapsible=icon]:opacity-0">Host Pro Ai</span>
            </Link>
        </SidebarHeader>

        <SidebarContent>
            <SidebarMenu>
                {navLinks.map(link => (
                    <SidebarMenuItem key={link.href}>
                        <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label}>
                            <Link href={link.href} target={link.target}>
                                <link.icon/>
                                <span>{link.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            
            {isAdmin && (
                <SidebarGroup>
                    <SidebarGroupLabel>Admin</SidebarGroupLabel>
                    <SidebarMenu>
                        {adminLinks.map(link => (
                            <SidebarMenuItem key={link.href}>
                               <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={link.label}>
                                    <Link href={link.href}>
                                        <link.icon/>
                                        <span>{link.label}</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            )}

        </SidebarContent>

        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive('/dashboard/settings')} tooltip="Settings">
                        <Link href="/dashboard/settings">
                             <Settings/>
                             <span>Settings</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
  );
}
