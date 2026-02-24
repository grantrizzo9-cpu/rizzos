import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HardDrive, ExternalLink } from "lucide-react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HostingPage() {
  return (
    <div className="space-y-8">
       <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center gap-2"><HardDrive/>Hosting Manager</CardTitle>
          <CardDescription>Connect and manage your custom domains for your websites.</CardDescription>
        </CardHeader>
        <CardContent>
            <Alert>
                <HardDrive className="h-4 w-4" />
                <AlertTitle>Ready to Connect Your Domain?</AlertTitle>
                <AlertDescription>
                    <p>We've created a comprehensive step-by-step guide to help you purchase and connect your custom domain name.</p>
                    <Button asChild className="mt-4">
                        <Link href="/strategy-center/connecting-your-domain">
                            View Domain Connection Guide <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                </AlertDescription>
            </Alert>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Connected Domains</CardTitle>
          <CardDescription>This feature is coming soon. Your connected domains will be listed here.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground py-8">You have not connected any domains yet.</p>
        </CardContent>
      </Card>

    </div>
  );
}
