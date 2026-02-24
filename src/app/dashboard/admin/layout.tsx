"use client";

import { useAuth } from "@/components/auth/auth-provider";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.email !== 'rentapog@gmail.com') {
      router.replace('/dashboard');
    }
  }, [user, loading, router]);
  
  if (loading || user?.email !== 'rentapog@gmail.com') {
    return null; // or a loading spinner
  }

  return (
    <div>
        <Alert variant="destructive" className="mb-8">
            <ShieldAlert className="h-4 w-4" />
            <AlertTitle>Admin Area</AlertTitle>
            <AlertDescription>
                You are in the admin section. Changes here affect the entire platform.
            </AlertDescription>
        </Alert>
        {children}
    </div>
  );
}
