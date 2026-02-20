import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowUpCircle } from "lucide-react";
import Link from "next/link";

export default function UpgradePage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="font-headline text-2xl flex items-center gap-2">
            <ArrowUpCircle/>
            Upgrade Your Plan
        </CardTitle>
        <CardDescription>
            Unlock more features and increase your earning potential by upgrading your plan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>Access more powerful AI tools, host more websites, and unlock higher commission tiers. Explore our pricing page to find the plan that best fits your ambitions.</p>
      </CardContent>
      <CardFooter>
          <Button asChild className="w-full">
              <Link href="/pricing">View Plans & Upgrade</Link>
          </Button>
      </CardFooter>
    </Card>
  );
}
