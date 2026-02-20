"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const studioNavLinks = [
  { href: "/dashboard/ai-content/blog", label: "Blog Generator" },
  { href: "/dashboard/ai-content/ads", label: "Ad Studio" },
  { href: "/dashboard/ai-content/video", label: "Video Studio" },
  { href: "/dashboard/ai-content/website", label: "Website Builder" },
];

export default function AiStudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-2">
      <h1 className="text-3xl font-semibold font-headline">AI Content Studio</h1>
      <div className="flex items-center gap-4 border-b pb-2">
        {studioNavLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={cn(
              "text-muted-foreground transition-colors hover:text-foreground",
              pathname === link.href && "font-semibold text-primary"
            )}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <div className="py-4">
        {children}
      </div>
    </div>
  );
}
